const { ensurePropChallenge } = require('./propChallengeContent');
const Puzzle = require('../models/Puzzle');
const Challenge = require('../models/Challenge');
const TrainingProgramme = require('../models/TrainingProgramme');

const normalizeLevel = value => ({
  easy: 'beginner', basic: 'beginner', beginner: 'beginner',
  medium: 'intermediate', intermediate: 'intermediate',
  high: 'advanced', advanced: 'advanced',
}[String(value || '').trim().toLowerCase()] || 'beginner');

const LEVEL_CONFIG = {
  beginner: { cards: 4, timeLimitSeconds: 180, basePoints: 800, incorrectPenalty: 40, hintPenalty: 40, maxTimeBonus: 200 },
  intermediate: { cards: 5, timeLimitSeconds: 150, basePoints: 820, incorrectPenalty: 50, hintPenalty: 50, maxTimeBonus: 180 },
  advanced: { cards: 6, timeLimitSeconds: 120, basePoints: 850, incorrectPenalty: 60, hintPenalty: 60, maxTimeBonus: 150 },
};

const TITLES = {
  'manual-handling': {
    beginner: [
      'Safe Lifting Sequence Challenge', 'Box Movement Preparation', 'Safe Carrying Sequence', 'Pallet Item Lift',
      'Shelf-to-Trolley Move', 'Team Lift Basics', 'Safe Set-Down Sequence', 'Route Check Before Lifting',
    ],
    intermediate: [
      'Awkward Load Handling Challenge', 'Team Lift Coordination', 'Handling Aid Selection', 'Narrow Route Load Move',
      'Unstable Load Control', 'Repeated Handling Task', 'Loading Bench Transfer', 'Manual Handling Risk Controls',
    ],
    advanced: [
      'Complex Manual Handling Control Plan', 'Heavy Load Risk Reduction', 'Multi-Person Lift Planning', 'Mechanical Aid Failure Response',
      'Restricted-Space Handling', 'High-Frequency Handling Review', 'Mixed Load Dispatch Plan', 'Dynamic Manual Handling Assessment',
    ],
  },
  'working-at-height': {
    beginner: [
      'Safe Work at Height Preparation Challenge', 'Ladder Pre-Use Order', 'Step Platform Setup', 'Work Area Exclusion Setup',
      'Tool Safety at Height', 'Access Equipment Positioning', 'Safe Descent Sequence', 'Height Hazard Check',
    ],
    intermediate: [
      'Elevated Work Area Setup Challenge', 'Edge Protection Preparation', 'Mobile Platform Setup', 'Falling Object Controls',
      'Work Positioning Check', 'Access Route Control', 'Two-Person Height Task', 'Weather and Surface Review',
    ],
    advanced: [
      'High-Risk Work at Height Control Challenge', 'Rescue Readiness Sequence', 'Roof Edge Work Controls', 'Complex Access Selection',
      'Permit and Authorisation Flow', 'Suspended Work Preparation', 'Changing Conditions Response', 'Height Task Close-Out Review',
    ],
  },
  'cyber-awareness': {
    beginner: [
      'Phishing Response Sequence Challenge', 'Suspicious Link Check', 'Password Safety Sequence', 'Unattended Workstation Security',
      'Unknown USB Response', 'Safe File Download Check', 'Basic Incident Reporting', 'Mobile Device Lockdown',
    ],
    intermediate: [
      'Suspicious Account Activity Response Challenge', 'Unexpected MFA Request', 'Remote Working Security', 'Sensitive File Sharing',
      'Potential Malware Response', 'Social Engineering Call', 'Lost Device Response', 'Shared Account Risk Control',
    ],
    advanced: [
      'Business Email Compromise Verification Challenge', 'Privileged Account Incident', 'Ransomware First Response', 'Third-Party Access Verification',
      'Data Exfiltration Warning', 'Credential Theft Containment', 'Payment Change Verification', 'Cyber Incident Escalation',
    ],
  },
};

const STEP_SETS = {
  'manual-handling': {
    beginner: [
      'Check the load and decide whether it is safe to move',
      'Clear the route and choose a stable destination',
      'Use a stable stance and secure grip before lifting',
      'Move and lower the load smoothly without twisting',
    ],
    intermediate: [
      'Assess the load, task, route and individual capability',
      'Choose the safest method, handling aid or team lift',
      'Prepare the route, destination and communication plan',
      'Move the load using coordinated controlled movement',
      'Set the load down safely and review any handling problem',
    ],
    advanced: [
      'Identify load, task, environment and people-related risks',
      'Eliminate or reduce unnecessary manual handling where possible',
      'Select engineering controls, mechanical aids and suitable equipment',
      'Define roles, supervision, communication and contingency actions',
      'Verify the route, equipment and work area before starting',
      'Perform, monitor and review the task, stopping if conditions change',
    ],
  },
  'working-at-height': {
    beginner: [
      'Identify the fall hazard and check whether height work is necessary',
      'Choose suitable access equipment and inspect it before use',
      'Secure the area and position the equipment correctly',
      'Complete the task while maintaining safe access and positioning',
    ],
    intermediate: [
      'Review the height, duration, surface and nearby activities',
      'Choose and inspect the safest suitable access system',
      'Set up edge protection and other collective fall controls',
      'Control falling objects, tools and the area below',
      'Confirm the setup before work begins and monitor it during use',
    ],
    advanced: [
      'Complete a task-specific risk assessment including foreseeable changes',
      'Avoid or reduce work at height wherever reasonably practicable',
      'Prioritise collective fall prevention and suitable access equipment',
      'Prepare rescue, emergency and falling-object arrangements before exposure',
      'Verify competence, inspections, permits and exclusion controls',
      'Carry out, supervise and close the task while recording defects or lessons',
    ],
  },
  'cyber-awareness': {
    beginner: [
      'Stop and avoid interacting with the suspicious item or request',
      'Inspect the sender, device, link or context for warning signs',
      'Verify the request using a trusted official method',
      'Report and safely remove or isolate the item as required',
    ],
    intermediate: [
      'Stop risky activity and do not approve unexpected requests',
      'Secure the device or account and preserve useful evidence',
      'Report the issue through the approved security channel',
      'Use the official recovery process to reset or revoke access where required',
      'Monitor for further suspicious activity and record follow-up actions',
    ],
    advanced: [
      'Pause the high-risk action before any payment, access or data change occurs',
      'Inspect the full context, identities, logs and warning signs',
      'Verify independently using a known trusted contact or control',
      'Escalate to security and the responsible business owner',
      'Contain the risk while preserving evidence and audit records',
      'Proceed or recover only through the approved authorised workflow',
    ],
  },
};

// Each starter has its own scenario. Keep the original STEP_SETS solely to
// identify old, unedited shared answers during migration.
const SCENARIOS = {
  'manual-handling': [
    ['Inspect the load for weight, shape and secure packaging', 'Clear the route and prepare a stable destination', 'Grip the load with feet positioned for balance', 'Carry it close and lower it without twisting'],
    ['Check the box weight and whether the contents can shift', 'Remove obstacles between pickup and destination', 'Position feet and grip the box securely', 'Lift smoothly and place the box on a stable surface'],
    ['Check the load and the distance it must be carried', 'Plan a clear route and rest points if needed', 'Lift with the load close to the body', 'Walk steadily and set it down with control'],
    ['Inspect the pallet item and identify pinch points', 'Check the pallet edge and receiving surface', 'Grip the item securely before moving it', 'Transfer and set it down without twisting'],
    ['Check shelf height, item weight and trolley capacity', 'Position and secure the trolley close to the shelf', 'Take a stable grip and remove the item carefully', 'Place the item securely on the trolley'],
    ['Check whether the load requires two people', 'Agree the route, roles and lifting commands', 'Take positions and lift together on the agreed signal', 'Move together and lower on a shared command'],
    ['Inspect the destination for space and stability', 'Approach slowly while keeping the load close', 'Bend at the hips and knees without twisting', 'Release the grip only once the load is stable'],
    ['Assess the load before planning its movement', 'Walk the route to identify obstructions and slopes', 'Remove hazards or choose a safer route', 'Begin the lift only after the destination is ready'],
  ],
  'working-at-height': [
    ['Confirm whether the task can be done from the ground', 'Assess fall hazards and choose suitable access', 'Inspect and position access equipment securely', 'Control the work area before starting the task'],
    ['Check that a ladder is suitable for this short task', 'Inspect rails, feet and rungs for defects', 'Place it on firm level ground at a safe angle', 'Secure it and maintain safe contact when climbing'],
    ['Inspect the platform and its locking parts', 'Select firm level ground near the task', 'Open and lock the platform as instructed', 'Check stability before stepping onto it'],
    ['Identify the area where a person or object may fall', 'Position barriers around the danger zone', 'Display warnings and restrict entry below', 'Check that the exclusion area remains clear'],
    ['Identify tools needed for the elevated task', 'Inspect tools and suitable retention equipment', 'Secure tools so they cannot fall onto others', 'Lower tools safely rather than dropping them'],
    ['Check the surface and access route', 'Choose equipment suitable for the task and height', 'Position it away from traffic and hazards', 'Confirm stability before anyone climbs'],
    ['Stop the task and secure loose tools', 'Check the descent route and equipment condition', 'Descend facing the access equipment with safe contact', 'Clear the work area after reaching the ground'],
    ['Survey edges, openings and overhead hazards', 'Assess people and objects below the task', 'Choose controls for falls and falling objects', 'Confirm the controls before work begins'],
  ],
  'cyber-awareness': [
    ['Stop before opening the unexpected message or attachment', 'Inspect the sender address and message for warning signs', 'Verify the request through a known trusted channel', 'Report the message and remove it as instructed'],
    ['Do not click the unfamiliar link', 'Inspect its destination and the surrounding request', 'Open the service through a known official address', 'Report the suspicious link through the approved channel'],
    ['Identify where the account needs a new password', 'Create a unique strong password or passphrase', 'Store it in the approved password manager', 'Enable multifactor authentication where available'],
    ['Notice that the workstation will be left unattended', 'Save work and close sensitive information', 'Lock the screen before walking away', 'Unlock it securely when you return'],
    ['Do not connect the unknown USB device', 'Leave it isolated and note where it was found', 'Report it to the security or IT team', 'Hand it over using the approved process'],
    ['Check the source and purpose of the proposed download', 'Verify the official publisher and expected file', 'Use an approved download location and security checks', 'Report or delete a suspicious file without opening it'],
    ['Recognise and stop the suspicious activity', 'Record what happened without altering evidence', 'Report it promptly through the approved channel', 'Follow the security team’s instructions'],
    ['Check that the mobile device is still in your possession', 'Save work and lock the screen when stepping away', 'Keep it physically secure and avoid unattended access', 'Report loss or suspicious access promptly'],
  ],
};

function scenarioSteps(moduleKey, level, index) {
  const base = SCENARIOS[moduleKey][index];
  const title = TITLES[moduleKey][level][index].toLowerCase();
  if (level === 'beginner') return base;
  // Higher levels add planning and response steps tied to the named situation.
  const topic = title.replace(/ challenge$/, '');
  if (level === 'intermediate') return [
    `Identify the specific hazards and warning signs in ${topic}`,
    `Check the people, equipment and surroundings involved in ${topic}`,
    `Choose controls and agree the safe procedure for ${topic}`,
    `Carry out the procedure while monitoring for changes`,
    `Report problems and verify the outcome of ${topic}`,
  ];
  return [
    `Define the scope, people and assets affected by ${topic}`,
    `Assess changing conditions and the highest-impact risks`,
    `Select preventive controls and a contingency plan for ${topic}`,
    `Confirm authorisation, equipment and communication before starting`,
    `Perform the task under supervision and stop if conditions change`,
    `Escalate exceptions and document the outcome of ${topic}`,
  ];
}

function makeStarter(moduleKey, level, index) {
  const title = TITLES[moduleKey][level][index];
  const steps = scenarioSteps(moduleKey, level, index);
  const prefix = `${moduleKey.replace(/[^a-z0-9]/g, '-')}-${level}-${index + 1}`;
  const digitalProps = steps.map((label, i) => ({ id: `${prefix}-step-${i + 1}`, label }));
  return {
    starterKey: `${moduleKey}:${level}:${index + 1}`,
    title,
    instructions: `Arrange the ${level} ${title.toLowerCase()} steps into the safest correct order.`,
    digitalProps,
    expectedSolution: digitalProps.map(item => item.id),
    hint: level === 'beginner'
      ? 'Think from checking and preparation first, then safe action, then reporting or completion.'
      : level === 'intermediate'
        ? 'Plan and control the risk before action. Recovery, review or reporting belongs after the immediate controls.'
        : 'Use the control hierarchy: assess, reduce or prevent, verify readiness, act under control, then review or recover.',
    correctFeedback: `Correct. You arranged this ${level} ${moduleKey.replace(/-/g, ' ')} puzzle in the safe sequence.`,
    incorrectFeedback: `The steps are valid, but the order is not yet correct for this ${level} activity. Review the risk-control sequence and try again.`,
  };
}

const STARTERS = Object.fromEntries(Object.keys(TITLES).map(moduleKey => [
  moduleKey,
  Object.fromEntries(['beginner', 'intermediate', 'advanced'].map(level => [
    level,
    TITLES[moduleKey][level].map((_, index) => makeStarter(moduleKey, level, index)),
  ])),
]));

async function ensureChallenge(puzzle, actor, level) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.beginner;
  let challenge = await Challenge.findOne({ puzzle: puzzle._id });
  if (challenge) return challenge;
  if (!challenge) {
    challenge = new Challenge({ puzzle: puzzle._id, createdBy: actor });
  }
  challenge.timeLimitSeconds = cfg.timeLimitSeconds;
  challenge.basePoints = cfg.basePoints;
  challenge.incorrectPenalty = cfg.incorrectPenalty;
  challenge.hintPenalty = cfg.hintPenalty;
  challenge.maxTimeBonus = cfg.maxTimeBonus;
  challenge.maxScore = 1000;
  challenge.tieRule = 'faster-time';
  challenge.status = 'active';
  await challenge.save();
  return challenge;
}

async function ensureSprint3StarterForProgramme(programme, actorOverride = null) {
  if (!programme?._id) return [];
  const moduleKey = String(programme.programmeType || '').trim().toLowerCase();
  const level = normalizeLevel(programme.level);
  const starters = STARTERS[moduleKey]?.[level] || [];
  if (!starters.length) return [];

  const actor = actorOverride || programme.createdBy || programme.owner;
  if (!actor) return [];

  const ensured = [];
  for (const starter of starters) {
    // Prefer the stable starter key after the first migration. For databases
    // created by the earlier Sprint 3 build, fall back to the exact title so
    // the user's existing puzzle content is kept instead of duplicated.
    let puzzle = await Puzzle.findOne({ programme: programme._id, starterKey: starter.starterKey }).sort({ createdAt: 1 });
    if (!puzzle) {
      puzzle = await Puzzle.findOne({ programme: programme._id, title: starter.title }).sort({ createdAt: 1 });
    }

    if (!puzzle) {
      puzzle = await Puzzle.create({
        programme: programme._id,
        moduleKey,
        starterKey: starter.starterKey,
        title: starter.title,
        instructions: starter.instructions,
        type: 'sequence',
        digitalProps: starter.digitalProps,
        expectedSolution: starter.expectedSolution,
        hint: starter.hint,
        correctFeedback: starter.correctFeedback,
        incorrectFeedback: starter.incorrectFeedback,
        status: 'active',
        createdBy: actor,
      });
    } else {
      puzzle.moduleKey = moduleKey;
      puzzle.starterKey = starter.starterKey;
      puzzle.updatedBy = actor;

      // Do not overwrite a valid sequence/sorting puzzle already present in
      // MongoDB. This preserves the exact wording, cards, answer order, hints
      // and feedback from the user's exported puzzles collection. Only fill a
      // starter definition when the matching record is not a usable ordering
      // puzzle.
      const ids = Array.isArray(puzzle.digitalProps)
        ? puzzle.digitalProps.map(item => String(item?.id || '')).filter(Boolean)
        : [];
      const solution = Array.isArray(puzzle.expectedSolution)
        ? puzzle.expectedSolution.map(String)
        : [];
      const usableOrderingPuzzle = ['sequence', 'sorting'].includes(puzzle.type)
        && ids.length >= 2
        && solution.length === ids.length
        && new Set(ids).size === ids.length
        && new Set(solution).size === solution.length
        && solution.every(id => ids.includes(id));

      const oldLabels = STEP_SETS[moduleKey][level];
      const isUneditedSharedStarter = usableOrderingPuzzle
        && puzzle.digitalProps.length === oldLabels.length
        && puzzle.digitalProps.every((item, i) => item.label === oldLabels[i])
        && solution.every((id, i) => id === ids[i]);
      if (!usableOrderingPuzzle || isUneditedSharedStarter) {
        puzzle.instructions = starter.instructions;
        puzzle.type = 'sequence';
        puzzle.digitalProps = starter.digitalProps;
        puzzle.expectedSolution = starter.expectedSolution;
        puzzle.hint = starter.hint;
        puzzle.correctFeedback = starter.correctFeedback;
        puzzle.incorrectFeedback = starter.incorrectFeedback;
      }
      await puzzle.save();
    }
    await ensureChallenge(puzzle, actor, level);
    ensured.push(puzzle);
  }
  await ensurePropChallenge(programme, actor);
  return ensured;
}

async function ensureSprint3StarterContent() {
  const programmes = await TrainingProgramme.find({ status: 'active', deletedAt: null })
    .sort({ programmeType: 1, level: 1, createdAt: 1 });
  for (const programme of programmes) await ensureSprint3StarterForProgramme(programme);
}

module.exports = { STARTERS, ensureSprint3StarterContent, ensureSprint3StarterForProgramme };
