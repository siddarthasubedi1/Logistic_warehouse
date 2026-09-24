const LearningSection = require('../models/LearningSection');
const Scenario = require('../models/Scenario');
const { ensureAssessmentQuestionBank } = require('./assessmentQuestionBank');
const label = t => ({ 'manual-handling': 'Manual Handling', 'working-at-height': 'Working at Height', 'cyber-awareness': 'Cyber Awareness' }[String(t || '').toLowerCase()] || 'Workplace Safety');
const topics = t => String(t).toLowerCase() === 'manual-handling' ? [
    ['Introduction & Risk Awareness', 'Understand safe manual handling, common warehouse tasks and how poor technique can cause injury.'], ['Plan the Task', 'Check the load, route, destination, space and need for assistance before moving anything.'], ['Safe Lifting & Carrying', 'Use stable positioning, a secure grip and controlled movement; avoid twisting with a load.'], ['Mechanical Aids & Team Handling', 'Recognise when trolleys, pallet trucks, lifting aids or coordinated team handling are safer.'], ['Hazard Identification', 'Identify blocked routes, unstable loads, poor stacking, awkward postures and vehicle interfaces.'], ['Practical Safety Check', 'Apply the programme knowledge to a realistic warehouse task before the scenario and assessment.']]
    : String(t).toLowerCase() === 'working-at-height' ? [
        ['Introduction & Fall Risk Awareness', 'Understand working-at-height activities and why falls and falling objects can cause serious harm.'], ['Planning Work at Height', 'Assess the task, access route, equipment, surrounding activity and environment before work starts.'], ['Ladders & Access Equipment', 'Select suitable access equipment, complete pre-use checks and position it securely.'], ['Platforms, Edges & Protection', 'Recognise unprotected edges, missing guardrails, unsafe platforms and collective fall-prevention controls.'], ['Falling Objects & Exclusion Zones', 'Secure tools and materials and protect people below using barriers and exclusion areas.'], ['Practical Safety Check', 'Apply the programme knowledge to a realistic elevated-work situation before the scenario and assessment.']]
        : [['Cyber Awareness Fundamentals', 'Understand common workplace cyber threats and how employee decisions affect organisational security.'], ['Phishing & Social Engineering', 'Check senders, links, attachments, unusual requests and pressure tactics before responding.'], ['Passwords & Multi-Factor Authentication', 'Use strong unique credentials, protect authentication codes and treat unexpected MFA prompts as suspicious.'], ['Devices, USB & Mobile Security', 'Lock unattended devices, avoid unknown removable media and protect work laptops and smartphones.'], ['Data, Network & Access Security', 'Use approved sharing methods, protect sensitive information and respect access controls.'], ['Incident Recognition & Reporting', 'Recognise suspicious activity and report incidents promptly through approved channels.']];
function scenario(t, title) { if (t === 'manual-handling') return { title: `${title} – Handling Decision`, type: 'hazard', prompt: 'A worker is about to move a large unstable box through a partially obstructed route without checking its weight. What is the safest action?', options: ['Continue carefully', 'Stop, assess the load and route, clear hazards, and use assistance or a suitable handling aid if needed', 'Lift it higher', 'Ask someone to watch'], correctResponses: ['Stop, assess the load and route, clear hazards, and use assistance or a suitable handling aid if needed'] }; if (t === 'working-at-height') return { title: `${title} – Height Safety Decision`, type: 'hazard', prompt: 'A worker plans to use an unsecured ladder beside an unprotected elevated edge while people work below. What should happen first?', options: ['Start carefully', 'Stop work, select suitable access equipment, provide edge protection and secure the area below', 'Only move people below', 'Work for a shorter time'], correctResponses: ['Stop work, select suitable access equipment, provide edge protection and secure the area below'] }; return { title: `${title} – Cyber Security Decision`, type: 'cyber', prompt: 'An urgent email asks you to sign in through an unfamiliar link. An unlocked workstation and unknown USB are nearby. What is the safest response?', options: ['Open the link', 'Use the USB', 'Avoid the link and USB, secure/report the workstation, and report the suspicious activity', 'Forward the email'], correctResponses: ['Avoid the link and USB, secure/report the workstation, and report the suspicious activity'] }; }
function q(t, lvl) { if (t === 'cyber-awareness') return lvl === 'basic' ? ['Which action best protects an unattended workstation?', ['Leave it open', 'Lock the screen', 'Turn off the monitor', 'Hide the keyboard'], 'Lock the screen'] : lvl === 'intermediate' ? ['What is the safest response to an unexpected MFA approval request?', ['Approve it', 'Ignore all MFA', 'Deny it and report suspicious activity', 'Share the code'], 'Deny it and report suspicious activity'] : ['A payment-change email appears to come from a manager. What is the strongest response?', ['Follow it', 'Reply for a password', 'Verify independently using an approved contact method', 'Forward externally'], 'Verify independently using an approved contact method']; if (t === 'working-at-height') return lvl === 'basic' ? ['What should happen before using access equipment?', ['Begin immediately', 'Complete a suitable pre-use check', 'Remove warning signs', 'Always ask someone to hold it'], 'Complete a suitable pre-use check'] : lvl === 'intermediate' ? ['Which control is generally preferable near an exposed edge?', ['Worker caution only', 'Suitable collective edge protection', 'Work faster', 'Remove access'], 'Suitable collective edge protection'] : ['A task has an unprotected edge, unsecured tools and workers below. What is best?', ['Control only the edge', 'Control the combined fall and falling-object risks before work starts', 'Ask people to look up', 'Reduce duration'], 'Control the combined fall and falling-object risks before work starts']; return lvl === 'basic' ? ['What should you do before moving an unfamiliar load?', ['Lift it to test', 'Assess the load and route', 'Carry above shoulder height', 'Move quickly'], 'Assess the load and route'] : lvl === 'intermediate' ? ['When is a handling aid appropriate?', ['Only after injury', 'When it reduces the risk of moving the load', 'Never for short distances', 'Only if alone'], 'When it reduces the risk of moving the load'] : ['A heavy awkward load must pass through a narrow route. What is best?', ['Use more force', 'Plan the route and use suitable assistance or mechanical aids', 'Carry alone', 'Twist it through'], 'Plan the route and use suitable assistance or mechanical aids']; }
async function ensureStarterTrainingContent(programme, actorOverride = null) {
    if (!programme?._id) return { sections: 0, scenarios: 0, questions: 0, questionBank: null };
    const actor = actorOverride || programme.createdBy || programme.owner;
    if (!actor) return { sections: 0, scenarios: 0, questions: 0, questionBank: null };

    const made = { sections: 0, scenarios: 0, questions: 0, questionBank: null };
    const t = String(programme.programmeType || '').toLowerCase();
    const title = programme.title || label(t);
    const difficulty = String(programme.level || 'beginner').replace(/^./, c => c.toUpperCase());

    if (await LearningSection.countDocuments({ programme: programme._id }) === 0) {
        const docs = await LearningSection.insertMany(topics(t).map(([st, body], i) => ({
            programme: programme._id,
            title: st,
            content: `${body}\n\nProgramme: ${title}. Difficulty: ${difficulty}.\n\nApply this guidance to the hazards and decisions you encounter in the 360° training environment.`,
            order: i + 1,
            status: 'active',
            createdBy: actor,
        })));
        made.sections = docs.length;
    }

    if (await Scenario.countDocuments({ programme: programme._id }) === 0) {
        const sc = scenario(t, title);
        await Scenario.create({
            ...sc,
            programme: programme._id,
            feedbackCorrect: 'Correct. You selected the safer response and applied the programme controls.',
            feedbackIncorrect: 'Review the hazards and learning sections, then choose the response that controls the risk before continuing.',
            order: 1,
            status: 'active',
            createdBy: actor,
        });
        made.scenarios = 1;
    }

    // Keep every programme-level assessment at a professional pool size. The
    // trainee still receives only 10 randomly selected questions per attempt;
    // the larger bank makes retakes genuinely different and prevents the quiz
    // from becoming predictable.
    const bank = await ensureAssessmentQuestionBank(programme, actor);
    made.questions = bank.created;
    made.questionBank = bank;
    return made;
}
module.exports = { ensureStarterTrainingContent };
