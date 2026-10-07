const User = require('../models/User');
const TrainingProgramme = require('../models/TrainingProgramme');
const TrainingAssignment = require('../models/TrainingAssignment');
const { ApiError, objectId } = require('../utils/apiValidation');

async function trainerProgrammeFilter(user) {
    if (user.role === 'admin') return {};
    if (user.role !== 'trainer') throw new ApiError(403, 'ROLE_ACCESS_DENIED', 'Access denied.');
    const trainer = await User.findById(user.id).select('assignedTrainingSections status role').lean();
    return {
        programmeType: { $in: trainer?.status === 'active' ? trainer.assignedTrainingSections || [] : [] },
        $or: [{ owner: user.id }, { authorizedTrainers: user.id }],
    };
}
async function canManageProgramme(user, programme) {
    if (user.role === 'admin') return true;
    if (user.role !== 'trainer' || !programme) return false;
    const trainer = await User.findById(user.id).select('assignedTrainingSections status').lean();
    return trainer?.status === 'active'
        && (trainer.assignedTrainingSections || []).includes(programme.programmeType)
        && (String(programme.owner?._id || programme.owner) === String(user.id)
            || (programme.authorizedTrainers || []).some(id => String(id?._id || id) === String(user.id)));
}
async function scopedAssignments(user, filters = {}) {
    const programmeFilter = { deletedAt: null, ...(await trainerProgrammeFilter(user)) };
    if (filters.programmeId) programmeFilter._id = objectId(filters.programmeId, 'programmeId');
    if (filters.moduleKey) {
        // Keep the trainer constraint even when the client requests a module.
        programmeFilter.$and = [{ programmeType: filters.moduleKey }];
    }
    const programmes = await TrainingProgramme.find(programmeFilter).lean();
    if (filters.programmeId && !programmes.length) throw new ApiError(404, 'TRAINING_NOT_AVAILABLE', 'Training record not available.');
    const query = { status: 'active', programme: { $in: programmes.map(p => p._id) } };
    if (filters.traineeId) query.trainee = objectId(filters.traineeId, 'traineeId');
    const rows = await TrainingAssignment.find(query).lean();
    if (filters.traineeId && !rows.length) throw new ApiError(404, 'TRAINING_NOT_AVAILABLE', 'Training record not available.');
    const byId = new Map(programmes.map(p => [String(p._id), p]));
    return rows.map(row => ({ ...row, programme: byId.get(String(row.programme)) }));
}
module.exports = { trainerProgrammeFilter, canManageProgramme, scopedAssignments };
