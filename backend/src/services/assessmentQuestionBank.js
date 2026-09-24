const AssessmentQuestion = require('../models/AssessmentQuestion');

const MIN_QUESTIONS_PER_LEVEL = 30;

const normalizeModule = (value) => String(value || '').trim().toLowerCase();
const normalizeAssessmentLevel = (value) => {
    const level = String(value || '').trim().toLowerCase();
    if (['beginner', 'easy', 'basic'].includes(level)) return 'basic';
    if (['intermediate', 'medium'].includes(level)) return 'intermediate';
    if (['advanced', 'high'].includes(level)) return 'high';
    return 'basic';
};

const banks = {
    'cyber-awareness': [
        ['you leave your workstation unattended', 'Lock the screen before leaving', ['Leave it signed in', 'Only switch off the monitor', 'Ask a colleague to watch it']],
        ['you receive an unexpected MFA approval request', 'Deny the request and report it as suspicious', ['Approve it to clear the notification', 'Share the code with a colleague', 'Disable MFA']],
        ['an email asks you to sign in through an unfamiliar link', 'Use a trusted route to verify the request before signing in', ['Open the link because it looks urgent', 'Forward the link to other staff', 'Reply with your password']],
        ['an unknown USB drive is found in the workplace', 'Do not connect it and follow the approved reporting process', ['Plug it in to identify the owner', 'Use it on a spare work computer', 'Take it home to inspect']],
        ['a colleague asks to use your account because theirs is locked', 'Do not share credentials; direct them to the approved support process', ['Share the password temporarily', 'Log in and leave the session open for them', 'Write the password down for them']],
        ['you need to send sensitive company information externally', 'Use the approved secure sharing method and verify the recipient', ['Use any personal file-sharing account', 'Send it to several addresses just in case', 'Remove the subject line only']],
        ['a caller claims to be IT support and asks for your password', 'Refuse to provide the password and verify the caller through an approved channel', ['Give the password if the caller knows your name', 'Provide only half of the password', 'Disable screen locking']],
        ['you notice a suspicious login alert on your work account', 'Report it promptly and secure the account using the approved process', ['Ignore it if work still functions', 'Delete the alert', 'Wait several days before telling anyone']],
        ['a work laptop must be used on public Wi-Fi', 'Use the organisation-approved secure connection method and avoid unnecessary sensitive activity', ['Disable security software', 'Share files openly on the network', 'Use any network with the strongest signal']],
        ['a message pressures you to make an urgent payment change', 'Verify the request independently using an approved contact method', ['Act immediately because it is urgent', 'Reply asking for a password', 'Forward it outside the company']],
        ['a browser warns that a website certificate is invalid', 'Stop and verify the site before proceeding', ['Ignore the warning', 'Enter credentials quickly', 'Turn off browser protection']],
        ['you are disposing of a document containing confidential information', 'Use the approved secure disposal process', ['Put it in a normal bin', 'Leave it beside the printer', 'Take it home']],
        ['a software update prompt appears on a work device', 'Use the approved update process or verify it with IT', ['Install software from an unknown pop-up', 'Disable future updates', 'Ignore all security updates permanently']],
        ['you receive an attachment you were not expecting', 'Verify the sender and context before opening it', ['Open it to see what it is', 'Rename the file and open it', 'Upload it to a public website']],
        ['a colleague posts a photo that shows confidential information on a screen', 'Ask for the exposure to be removed and report it through the appropriate process', ['Share the photo more widely', 'Ignore it because it is only a photo', 'Copy the confidential information']],
        ['you need a new password for a work account', 'Use a strong unique password or approved password manager', ['Reuse a personal password', 'Use the company name and year', 'Share one password across all systems']],
        ['an email sender address is slightly different from the expected domain', 'Treat it as suspicious and verify the sender independently', ['Trust the display name only', 'Reply with sensitive information', 'Add the sender to trusted contacts immediately']],
        ['a device containing company email is lost', 'Report the loss promptly using the approved process', ['Wait to see if it is returned', 'Post the account password online', 'Remove device security from another computer']],
        ['you see someone without authorisation near a restricted server area', 'Follow the physical security and reporting procedure', ['Hold the secure door open for them', 'Ignore them because they look busy', 'Give them your access badge']],
        ['a website requests more personal or company data than expected', 'Stop and verify why the information is required before providing it', ['Provide everything requested', 'Use another employee’s details', 'Disable privacy controls']],
        ['a colleague receives repeated unexpected MFA prompts', 'Treat the prompts as a possible account attack and report them', ['Approve one to stop the prompts', 'Turn off MFA', 'Share the authentication code']],
        ['you must work remotely with confidential documents', 'Use approved devices, secure access and appropriate privacy controls', ['Use a shared public computer', 'Leave documents visible in a public place', 'Email copies to a personal account']],
        ['a QR code in an unsolicited message asks you to sign in', 'Verify the source and destination before scanning or entering credentials', ['Scan it because QR codes are safe', 'Enter credentials if the page has a logo', 'Send the code to customers']],
        ['you accidentally send sensitive data to the wrong recipient', 'Report the incident immediately and follow the data-breach procedure', ['Delete your sent email and say nothing', 'Wait for the recipient to complain', 'Send more data to explain']],
        ['a coworker asks you to install an unapproved browser extension', 'Use only approved software and request review if the tool is needed', ['Install it because a coworker recommended it', 'Disable endpoint protection first', 'Use your administrator password on their device']],
        ['a shared meeting screen displays confidential information', 'Stop sharing or hide the confidential content immediately', ['Continue because the meeting is internal', 'Take a screenshot for everyone', 'Upload the screen recording publicly']],
        ['a phishing message contains accurate personal details about you', 'Still verify the request independently before taking action', ['Assume it is genuine because the details are correct', 'Send more information to confirm identity', 'Disable spam filtering']],
        ['you are asked to bypass an access-control rule to finish work faster', 'Use the approved access process and escalate the work need', ['Bypass the control temporarily', 'Use another person’s account', 'Share an administrator account']],
        ['you notice antivirus or endpoint protection has been disabled', 'Stop risky activity and report or restore protection through the approved process', ['Ignore it if the device is fast', 'Download test malware', 'Disable the firewall as well']],
        ['a supplier asks for confidential files through a new unapproved platform', 'Verify the request and use an approved secure transfer method', ['Upload the files immediately', 'Send them from a personal account', 'Remove file names but keep the data unencrypted']],
    ],
    'manual-handling': [
        ['you need to move an unfamiliar load', 'Assess the load, route and destination before lifting', ['Lift it first to judge the weight', 'Carry it above shoulder height', 'Move it quickly before it becomes tiring']],
        ['a box is too heavy or awkward for safe individual handling', 'Use suitable assistance or a mechanical aid', ['Use more force', 'Twist while lifting', 'Carry it alone in stages']],
        ['the route is blocked before a load is moved', 'Clear or change the route before handling the load', ['Step over obstacles while carrying', 'Carry the load higher so you can see', 'Walk faster through the obstruction']],
        ['you are lifting from a low position', 'Use a stable stance and controlled movement while keeping the load close', ['Keep the legs straight and bend sharply at the waist', 'Hold the load away from the body', 'Twist during the lift']],
        ['a load blocks your view of the walking route', 'Reduce the load or use assistance so the route remains visible', ['Continue and guess the route', 'Walk backward without checking', 'Raise the load above your head']],
        ['you need to change direction while carrying a load', 'Move your feet and turn the whole body rather than twisting the torso', ['Twist from the waist', 'Keep the feet fixed', 'Swing the load quickly']],
        ['a pallet truck or trolley is available for a heavy load', 'Use the aid when it reduces the handling risk and you are trained to use it', ['Ignore it because manual lifting is quicker', 'Overload the aid', 'Ride on the equipment']],
        ['two workers must move a long or awkward item', 'Plan the team lift, agree commands and move together', ['Let each person choose their own timing', 'One person should suddenly take most of the weight', 'Twist in opposite directions']],
        ['the floor is wet on the planned carrying route', 'Control the slip hazard before moving the load', ['Walk faster', 'Carry more items to reduce trips', 'Ignore the floor if footwear is dry']],
        ['a load has no secure handhold', 'Reposition, repackage or use suitable handling assistance before moving it', ['Grip only the wrapping loosely', 'Lift from one corner', 'Throw it onto a trolley']],
        ['a worker feels pain while handling a load', 'Stop the task and report or seek appropriate assistance', ['Continue until the task is finished', 'Hide the pain', 'Increase the load to finish sooner']],
        ['a load is stored above comfortable reach height', 'Use an appropriate method or equipment to bring it into a safer handling position', ['Stretch and pull it down quickly', 'Stand on unstable packaging', 'Jump to reach it']],
        ['a worker repeatedly handles small loads for a long period', 'Consider repetition, posture, pace and task rotation in the risk assessment', ['Assume small loads cannot cause injury', 'Increase the pace', 'Remove rest opportunities']],
        ['a load is unstable and its contents may shift', 'Stabilise or secure the load before moving it', ['Carry it faster', 'Hold it away from the body', 'Shake it to settle the contents while walking']],
        ['you must place a load onto a shelf', 'Plan the final position and keep control of the load until it is stable', ['Throw the load onto the shelf', 'Let go before checking stability', 'Twist at full reach']],
        ['a task requires frequent lifting from floor level', 'Redesign or adjust the task to reduce low-level lifting where reasonably practicable', ['Accept the posture as unavoidable without review', 'Increase load weight', 'Remove mechanical aids']],
        ['you are unsure of a package weight', 'Check available weight information or test safely before committing to the lift', ['Assume it is light', 'Lift suddenly', 'Ask someone else to guess']],
        ['a manual handling task is being done in a narrow space', 'Check clearance and reposition the task or load before moving', ['Twist through the gap', 'Carry the load sideways without checking', 'Ignore pinch points']],
        ['a worker is rushing because a vehicle is waiting', 'Maintain the safe handling method and escalate unrealistic time pressure', ['Skip the assessment', 'Lift beyond capability', 'Run with the load']],
        ['a load must be moved up or down steps', 'Assess the route and use suitable assistance or equipment for the change in level', ['Carry it without seeing the steps', 'Jump the last step', 'Use one hand only']],
        ['a damaged box may fail during lifting', 'Repackage or secure it before handling', ['Lift it from the damaged area', 'Ignore the damage', 'Carry it over other workers']],
        ['a trolley is difficult to push because it is overloaded', 'Reduce the load to a safe level before moving it', ['Pull harder with one hand', 'Run to gain momentum', 'Ask someone to stand on it']],
        ['you need to push a wheeled load', 'Keep good visibility and use controlled force in a stable posture', ['Push with a bent and twisted back', 'Close your eyes on corners', 'Push from an unsafe hand position']],
        ['you need to lower a heavy item to the floor', 'Use controlled movement and a stable stance, keeping the item close', ['Drop it from knee height', 'Twist while lowering', 'Hold it at arm’s length']],
        ['the destination for a load is not ready', 'Prepare the destination before starting the lift', ['Hold the load until space appears', 'Put it in a walkway', 'Balance it temporarily on an unstable surface']],
        ['a manual handling risk assessment no longer matches the task', 'Stop and review the assessment before continuing', ['Keep using the old assessment', 'Ignore the change', 'Remove controls to save time']],
        ['a load is bulky but not especially heavy', 'Treat size, grip, visibility and posture as handling risks as well as weight', ['Assume only weight matters', 'Carry it above eye level', 'Grip the weakest part']],
        ['a colleague suggests lifting beyond the stated safe method', 'Use the approved method and request assistance if needed', ['Copy the colleague because they are experienced', 'Skip the handling aid', 'Compete to see who can lift more']],
        ['a worker cannot keep the load close because of packaging shape', 'Use a different handling method, aid or packaging arrangement', ['Extend the arms and accept the strain', 'Twist to compensate', 'Carry it one-handed']],
        ['several manual handling hazards are present at the same time', 'Control the combined risks before starting the task', ['Control only the easiest hazard', 'Start and adjust later', 'Rely on individual strength']],
    ],
    'working-at-height': [
        ['work must be carried out where a fall could cause injury', 'Plan the work and use suitable fall-prevention controls before starting', ['Rely on worker balance', 'Work faster to reduce exposure time', 'Remove warning signs']],
        ['a ladder is damaged during a pre-use check', 'Remove it from use and report or replace it', ['Use it only for a short task', 'Ask someone to hold the damaged part', 'Hide the damage']],
        ['an elevated edge has no suitable protection', 'Provide appropriate collective edge protection or another suitable safe system before work', ['Rely on caution only', 'Stand farther from the edge without controls', 'Work only when no one is watching']],
        ['tools could fall onto people below', 'Secure tools and establish suitable exclusion or protection controls', ['Ask people below to look up', 'Work faster', 'Place tools loosely on the edge']],
        ['a ladder is placed on an unstable surface', 'Reposition it on a firm stable base before use', ['Climb carefully anyway', 'Put loose packaging underneath', 'Have one person stand on the bottom rung']],
        ['weather conditions make an outdoor height task unsafe', 'Stop or postpone the work until conditions are adequately controlled', ['Continue because the schedule is important', 'Remove PPE to move more easily', 'Work closer to the edge']],
        ['you need both hands for a prolonged task at height', 'Use suitable work equipment that provides a stable working platform', ['Balance on a ladder with no handhold', 'Stand on the top rung', 'Lean far to one side']],
        ['a worker must access a fragile roof area', 'Use a specifically planned safe access system with suitable protection', ['Walk only on areas that look strong', 'Crawl to spread body weight', 'Test the roof by jumping lightly']],
        ['an opening in a floor is discovered', 'Guard or cover it securely and control access', ['Mark it with a small object only', 'Step around it', 'Leave it for the next shift']],
        ['materials are stacked near an elevated edge', 'Move or secure them so they cannot fall and do not obstruct protection', ['Stack them higher', 'Leave them loose', 'Use the edge protection as a shelf']],
        ['a mobile access platform is to be moved', 'Follow the equipment procedure and ensure people are not exposed during movement', ['Move it with a person still working unsafely on it', 'Push it over uneven ground at speed', 'Release all stabilisation without checking']],
        ['a worker needs to overreach from a ladder', 'Descend and reposition the ladder or use more suitable equipment', ['Stretch farther', 'Stand on one foot', 'Ask someone to pull the ladder sideways']],
        ['the planned anchor point for fall protection is uncertain', 'Stop and have the anchor suitability verified before relying on it', ['Use it because it looks strong', 'Attach to any pipe', 'Share one unverified anchor without checking']],
        ['people are working below an elevated task', 'Coordinate the work and protect the area from falling-object risk', ['Ignore the work below', 'Drop waste carefully', 'Ask workers below to move only when something falls']],
        ['a platform guardrail has been removed temporarily', 'Restore suitable protection before normal work resumes', ['Work carefully until the end of shift', 'Use a warning sign as the only control', 'Stand near the missing section to warn others']],
        ['a height task changes from the original plan', 'Reassess the risks and controls before continuing', ['Continue under the old plan', 'Remove controls that slow the task', 'Assume the change is minor']],
        ['a worker has not been trained to use specific access equipment', 'Use a competent trained person or provide required training before use', ['Let them learn while working', 'Give only a quick verbal instruction', 'Allow use if supervised from a distance']],
        ['an emergency rescue would be difficult from the work position', 'Include a suitable rescue plan before the work starts', ['Rely only on emergency services arriving', 'Ignore rescue because falls are unlikely', 'Remove communication equipment']],
        ['a ladder must be used near a doorway or traffic route', 'Control the doorway or traffic and secure the work area before use', ['Assume others will notice the ladder', 'Block the door with the ladder itself', 'Use headphones so you can focus']],
        ['a worker wants to use a chair or box to gain extra height', 'Use suitable access equipment designed for the task', ['Use the chair if someone holds it', 'Stack boxes carefully', 'Stand on a pallet']],
        ['scaffold components appear loose or altered', 'Stop use and arrange inspection by a competent person', ['Tighten anything by hand while standing on it', 'Keep working on the opposite side', 'Ignore it if the platform feels stable']],
        ['work at height is planned near overhead electrical hazards', 'Coordinate the task and maintain required electrical clearances and controls', ['Rely only on rubber footwear', 'Move metal equipment closer for convenience', 'Ignore the electrical hazard if power is normally on']],
        ['a worker feels unwell while already at height', 'Stop the task and move to a safe position using the planned method', ['Finish the task first', 'Climb faster', 'Remove fall protection']],
        ['a harness or lanyard shows signs of damage', 'Remove it from service and follow the inspection/replacement process', ['Use it for one last task', 'Tape over the damage', 'Share it with another worker']],
        ['a platform is cluttered with loose materials', 'Clear and secure the work area before continuing', ['Kick items toward the edge', 'Work around the clutter', 'Stack materials against the guardrail']],
        ['a short-duration task is proposed without normal controls', 'Assess the actual risk; short duration does not remove the need for suitable controls', ['Skip controls because the task is quick', 'Use any nearby object for access', 'Ask someone to watch instead of controlling the risk']],
        ['a worker needs to climb while carrying tools', 'Use an approved method to keep hands and access secure, such as suitable tool transport', ['Carry tools in both hands', 'Put loose tools in pockets where they can fall', 'Throw tools to the platform']],
        ['visibility is poor around an elevated work area', 'Improve lighting or postpone work until the task can be performed safely', ['Continue by memory', 'Remove barriers to make movement easier', 'Use a phone flashlight while climbing one-handed']],
        ['multiple contractors are working at different heights in the same area', 'Coordinate the activities and control interaction and falling-object risks', ['Let each contractor manage only their own task', 'Start all tasks at the same time without coordination', 'Remove exclusion zones']],
        ['the safest access method is not immediately available', 'Delay the task or arrange suitable equipment rather than improvise', ['Use an unsuitable substitute', 'Climb the storage racking', 'Proceed because production is waiting']],
    ],
};

const levelName = (level) => ({ basic: 'Beginner', intermediate: 'Intermediate', high: 'Advanced' }[level] || 'Beginner');
const moduleName = (moduleType) => ({
    'cyber-awareness': 'Cyber Awareness',
    'manual-handling': 'Manual Handling',
    'working-at-height': 'Working at Height',
}[moduleType] || 'Workplace Safety');

const buildQuestionBank = (moduleType, level) => {
    const moduleKey = normalizeModule(moduleType);
    const assessmentLevel = normalizeAssessmentLevel(level);
    const source = banks[moduleKey] || banks['manual-handling'];
    return source.map(([situation, correctAnswer, distractors], index) => {
        const question = assessmentLevel === 'basic'
            ? `In ${moduleName(moduleKey)} training, ${situation}. What should you do?`
            : assessmentLevel === 'intermediate'
                ? `During normal operations, ${situation}. Other work is continuing nearby. What is the most appropriate response?`
                : `During a time-critical operation, ${situation}. Which response best manages the combined risk and follows the safe system of work?`;
        const rawOptions = [correctAnswer, ...distractors];
        const levelOffset = { basic: 0, intermediate: 1, high: 2 }[assessmentLevel] || 0;
        const shift = (index + levelOffset) % rawOptions.length;
        const storedOptions = rawOptions.slice(shift).concat(rawOptions.slice(0, shift));
        return {
            question,
            // Generated banks are already balanced across A/B/C/D positions in
            // storage. The assessment endpoint additionally shuffles them per
            // attempt, so trainees cannot learn a fixed answer position.
            options: storedOptions,
            correctAnswer,
            points: 1,
            feedback: `${levelName(assessmentLevel)} ${moduleName(moduleKey)}: ${correctAnswer}.`,
            bankOrder: index + 1,
        };
    });
};

const ensureAssessmentQuestionBank = async (programme, actorOverride = null) => {
    if (!programme?._id) return { created: 0, activeCount: 0, level: 'basic', target: MIN_QUESTIONS_PER_LEVEL };
    const actor = actorOverride || programme.createdBy || programme.owner;
    const level = normalizeAssessmentLevel(programme.level);
    const activeRows = await AssessmentQuestion.find({ programme: programme._id, level, status: 'active' })
        .select('_id question order')
        .sort({ order: 1 })
        .lean();
    if (activeRows.length >= MIN_QUESTIONS_PER_LEVEL || !actor) {
        return { created: 0, activeCount: activeRows.length, level, target: MIN_QUESTIONS_PER_LEVEL };
    }

    const allRows = await AssessmentQuestion.find({ programme: programme._id, level })
        .select('question order')
        .lean();
    const existingText = new Set(allRows.map(row => String(row.question || '').trim().toLowerCase()));
    let nextOrder = allRows.reduce((max, row) => Math.max(max, Number(row.order || 0)), 0) + 1;
    const candidates = buildQuestionBank(programme.programmeType, level);
    const needed = MIN_QUESTIONS_PER_LEVEL - activeRows.length;
    const docs = [];

    for (const candidate of candidates) {
        if (docs.length >= needed) break;
        const key = candidate.question.trim().toLowerCase();
        if (existingText.has(key)) continue;
        docs.push({
            programme: programme._id,
            level,
            question: candidate.question,
            options: candidate.options,
            correctAnswer: candidate.correctAnswer,
            points: candidate.points,
            feedback: candidate.feedback,
            order: nextOrder++,
            status: 'active',
            createdBy: actor,
        });
        existingText.add(key);
    }

    // If a programme already contains some bank questions under unusual text or
    // ordering, create clearly-labelled fallback scenarios so the active pool
    // still reaches the required minimum without overwriting existing content.
    let fallback = 1;
    while (docs.length < needed) {
        const source = candidates[(fallback - 1) % candidates.length];
        const question = `${source.question} (practice variation ${fallback})`;
        const key = question.toLowerCase();
        fallback += 1;
        if (existingText.has(key)) continue;
        docs.push({
            programme: programme._id,
            level,
            question,
            options: source.options,
            correctAnswer: source.correctAnswer,
            points: 1,
            feedback: source.feedback,
            order: nextOrder++,
            status: 'active',
            createdBy: actor,
        });
        existingText.add(key);
    }

    if (docs.length) await AssessmentQuestion.insertMany(docs, { ordered: true });
    return {
        created: docs.length,
        activeCount: activeRows.length + docs.length,
        level,
        target: MIN_QUESTIONS_PER_LEVEL,
    };
};

module.exports = {
    MIN_QUESTIONS_PER_LEVEL,
    buildQuestionBank,
    ensureAssessmentQuestionBank,
    normalizeAssessmentLevel,
};
