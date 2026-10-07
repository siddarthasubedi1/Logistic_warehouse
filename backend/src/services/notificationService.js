const Notification = require('../models/Notification');
const User = require('../models/User');

async function notify(recipient, event) {
    // Only trusted server code calls this function. There is no notification
    // creation endpoint accepting a client-supplied recipient.
    try {
        return await Notification.findOneAndUpdate(
            { recipient, eventKey: event.eventKey },
            { $setOnInsert: { recipient, ...event } },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
    } catch (error) {
        if (error.code !== 11000) throw error;
        return Notification.findOne({ recipient, eventKey: event.eventKey });
    }
}
async function notifyUsers(filter, event) {
    const cursor = User.find(filter).select('_id').lean().cursor();
    let batch = [];
    const flush = async () => {
        if (!batch.length) return;
        await Notification.bulkWrite(batch.map(user => ({ updateOne: {
            filter: { recipient: user._id, eventKey: event.eventKey },
            update: { $setOnInsert: { recipient: user._id, ...event, read: false, readAt: null } },
            upsert: true,
        } })), { ordered: true });
        batch = [];
    };
    for await (const user of cursor) { batch.push(user); if (batch.length === 500) await flush(); }
    await flush();
}
module.exports = { notify, notifyUsers };
