const context = require('./auditContext');

// Capture actual persisted states rather than request bodies. Applies only to
// authenticated manager actions; seed scripts and trainee events are separate.
module.exports = function auditPlugin(schema, { targetType }) {
    const actor = () => { const c = context.getStore(); return c && ['admin', 'trainer'].includes(c.user.role) ? c : null; };
    const record = async (ctx, action, before, after) => {
        if (!ctx) return;
        const id = after?._id || before?._id;
        await require('./auditLogger').writeAuditLog({ req: ctx.req, user: ctx.user, action: `${targetType.toUpperCase()}_${action}`, status: 'success', targetType, targetId: id, before, after });
    };
    schema.pre('save', async function () {
        this.$locals.auditContext = actor();
        if (!this.$locals.auditContext && !['TrainingAssignment', 'TrainingModule', 'User'].includes(targetType)) return;
        this.$locals.auditBefore = this.isNew ? null : await this.constructor.findById(this._id).lean();
    });
    schema.post('save', async function (doc) {
        await record(doc.$locals.auditContext, doc.$locals.auditBefore ? 'UPDATED' : 'CREATED', doc.$locals.auditBefore, doc.toObject());
        await require('../services/trustedEventService').handleRecordEvent(targetType, doc.$locals.auditBefore, doc.toObject());
    });
    for (const operation of ['findOneAndUpdate', 'updateOne', 'updateMany', 'findOneAndDelete', 'deleteOne', 'deleteMany']) {
        schema.pre(operation, { query: true, document: false }, async function () {
            this._auditContext = actor();
            if (!this._auditContext) return;
            this._auditBefore = await this.model.find(this.getFilter()).lean();
        });
        schema.post(operation, { query: true, document: false }, async function () {
            if (!this._auditContext) return;
            for (const before of this._auditBefore || []) {
                const after = await this.model.findById(before._id).lean();
                await record(this._auditContext, after ? 'UPDATED' : 'DELETED', before, after);
                await require('../services/trustedEventService').handleRecordEvent(targetType, before, after);
            }
        });
    }
    schema.post('insertMany', async function (docs) {
        const ctx = actor();
        if (!ctx) return;
        for (const doc of docs) await record(ctx, 'CREATED', null, doc.toObject ? doc.toObject() : doc);
    });
    schema.pre('deleteOne', { document: true, query: false }, function () { this.$locals.auditContext = actor(); this.$locals.auditBefore = this.toObject(); });
    schema.post('deleteOne', { document: true, query: false }, async function () { await record(this.$locals.auditContext, 'DELETED', this.$locals.auditBefore, null); });
};
