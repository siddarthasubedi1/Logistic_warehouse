module.exports = function attemptEventPlugin(schema, { targetType }) {
    schema.post('save', async doc => { await require('../services/trustedEventService').handleAttemptEvent(targetType, doc); });
    schema.post('findOneAndUpdate', async function (doc) {
        if (!doc) return;
        // A query can request the before document; always retrieve final state.
        const after = await this.model.findById(doc._id).lean();
        if (after) await require('../services/trustedEventService').handleAttemptEvent(targetType, after);
    });
};
