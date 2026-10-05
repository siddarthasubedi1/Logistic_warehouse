// One deterministic engine for authoritative server play and isolated draft previews.
// It does not use browser storage, network calls, random scores, or client clocks.
const clone = value => JSON.parse(JSON.stringify(value));
export class MissionError extends Error {
  constructor(message, code = 'INVALID_CONFIGURATION', status = 400) { super(message); this.code = code; this.status = status; }
}
const assert = (condition, message) => { if (!condition) throw new MissionError(message); };
const identifier = value => typeof value === 'string' && /^[a-z][a-z0-9_-]{0,63}$/.test(value);
const string = (value, label, max = 3000, required = false) => {
  assert(value == null || typeof value === 'string', `${label} must be text.`);
  const result = (value || '').trim();
  assert(result.length <= max && (!required || result.length > 0), `${label} is required or exceeds ${max} characters.`);
  return result;
};
const number = (value, fallback, min, max, label) => {
  const result = value == null ? fallback : value;
  if (result === null && fallback === null) return null;
  assert(typeof result === 'number' && Number.isFinite(result) && result >= min && result <= max, `${label} must be between ${min} and ${max}.`);
  return result;
};
const boolean = (value, fallback, label) => { assert(value == null || typeof value === 'boolean', `${label} must be true or false.`); return value ?? fallback; };
const list = (value, label, max = 100) => { assert(Array.isArray(value) && value.length <= max, `${label} must be an array of at most ${max} items.`); return value; };
const ids = (value = [], label) => { const result = list(value, label); assert(result.every(identifier) && new Set(result).size === result.length, `${label} must contain unique identifiers.`); return [...result]; };
const asset = value => { const result = string(value, 'Asset', 1000); assert(!result || /^\/(?!\/)[^\s\\]*$/.test(result) || /^https:\/\/[^\s]+$/i.test(result), 'Assets must use a local /path or HTTPS URL.'); return result; };
const unique = (rows, label) => { assert(rows.every(row => identifier(row.id)), `${label} identifiers must start with a letter and contain letters, digits, - or _.`); assert(new Set(rows.map(row => row.id)).size === rows.length, `${label} identifiers must be unique.`); };

export function validateSimulation(input) {
  assert(input && typeof input === 'object' && !Array.isArray(input), 'Mission configuration is required.');
  const env = input.environment || {};
  const locations = list(env.locations, 'Locations', 30).map(row => ({
    id: string(row.id, 'Location ID', 64, true), name: string(row.name, 'Location name', 120, true),
    description: string(row.description, 'Location description'), panorama: asset(row.panorama),
    warehouseLocationId: string(row.warehouseLocationId, 'Warehouse location ID', 100),
    connections: list(row.connections || [], 'Connections', 30).map(connection => ({
      targetLocationId: string(connection.targetLocationId, 'Destination', 64, true),
      label: string(connection.label, 'Navigation label', 120), requiredActionIds: ids(connection.requiredActionIds, 'Navigation prerequisites'),
    })),
  }));
  unique(locations, 'Location'); assert(locations.length > 0, 'Add at least one location.');
  const locationIds = new Set(locations.map(row => row.id));
  const objects = list(input.objects, 'Objects', 100).map(row => ({
    id: string(row.id, 'Object ID', 64, true), name: string(row.name, 'Object name', 120, true),
    description: string(row.description, 'Object description'), type: string(row.type || 'equipment', 'Object type', 60),
    locationId: string(row.locationId, 'Object location', 64, true), imageUrl: asset(row.imageUrl),
    yaw: number(row.yaw, 0, -180, 180, 'Object yaw'), pitch: number(row.pitch, 0, -75, 75, 'Object pitch'),
    requiredFlags: ids(row.requiredFlags, 'Object visibility flags'), hiddenAfterActionIds: ids(row.hiddenAfterActionIds, 'Object hiding actions'),
  }));
  unique(objects, 'Object'); assert(objects.length > 0, 'Add an interactive object.');
  const objectIds = new Set(objects.map(row => row.id));
  const actions = list(input.actions, 'Actions', 200).map(row => ({
    id: string(row.id, 'Action ID', 64, true), label: string(row.label, 'Action label', 120, true),
    objectId: string(row.objectId, 'Action object', 64, true), verb: string(row.verb || 'use', 'Action verb', 50),
    requiredActionIds: ids(row.requiredActionIds, 'Action prerequisites'), requiredFlags: ids(row.requiredFlags, 'Action state prerequisites'),
    setFlags: ids(row.setFlags, 'Result state flags'), clearFlags: ids(row.clearFlags, 'Cleared flags'),
    points: number(row.points, null, 0, 10000, 'Action points'), penalty: number(row.penalty, null, 0, 10000, 'Action penalty'),
    unsafe: boolean(row.unsafe, false, 'Unsafe action'), critical: boolean(row.critical, false, 'Critical action'),
    once: boolean(row.once, true, 'Single-use action'), feedback: string(row.feedback, 'Action feedback'),
    resolveHazardIds: ids(row.resolveHazardIds, 'Resolved hazards'), moveTo: string(row.moveTo, 'Action destination', 64),
  }));
  unique(actions, 'Action'); assert(actions.length > 0, 'Add an action.');
  const actionIds = new Set(actions.map(row => row.id));
  const hazards = list(input.hazards || [], 'Hazards', 100).map(row => ({
    id: string(row.id, 'Hazard ID', 64, true), name: string(row.name, 'Hazard name', 120, true),
    description: string(row.description, 'Hazard description'), locationId: string(row.locationId, 'Hazard location', 64, true),
    severity: string(row.severity || 'moderate', 'Hazard severity', 30), triggerActionIds: ids(row.triggerActionIds, 'Hazard triggers'),
    correctResponseActionId: string(row.correctResponseActionId, 'Hazard response action', 64),
    penalty: number(row.penalty, 0, 0, 10000, 'Hazard penalty'), critical: boolean(row.critical, false, 'Critical hazard'),
    feedback: string(row.feedback, 'Hazard feedback'), imageUrl: asset(row.imageUrl),
  }));
  unique(hazards, 'Hazard'); const hazardIds = new Set(hazards.map(row => row.id));
  const objectives = list(input.objectives, 'Objectives', 100).map(row => ({
    id: string(row.id, 'Objective ID', 64, true), label: string(row.label, 'Objective label', 180, true),
    actionIds: ids(row.actionIds, 'Objective actions'), required: boolean(row.required, true, 'Required objective'),
  }));
  unique(objectives, 'Objective'); assert(objectives.some(row => row.required), 'Add at least one required objective.');
  const references = (values, available, label) => assert(values.every(id => available.has(id)), `${label} contains an unknown identifier.`);
  for (const row of locations) for (const connection of row.connections) { references([connection.targetLocationId], locationIds, 'Navigation destination'); references(connection.requiredActionIds, actionIds, 'Navigation prerequisites'); }
  for (const row of objects) { references([row.locationId], locationIds, 'Object location'); references(row.hiddenAfterActionIds, actionIds, 'Object hiding actions'); }
  for (const row of actions) {
    references([row.objectId], objectIds, 'Action object'); references(row.requiredActionIds, actionIds, 'Action prerequisites');
    references(row.resolveHazardIds, hazardIds, 'Resolved hazards'); if (row.moveTo) references([row.moveTo], locationIds, 'Action destination');
    assert(!row.requiredActionIds.includes(row.id), 'An action cannot require itself.');
    assert(row.once || row.unsafe, 'Repeatable safe actions cannot award repeat points.');
    assert(!row.unsafe || !row.points, 'Unsafe actions cannot award points.');
  }
  const visiting = new Set(), visited = new Set();
  const visit = id => { if (visited.has(id)) return; assert(!visiting.has(id), 'Action prerequisites contain a cycle.'); visiting.add(id); for (const dependency of actions.find(row => row.id === id).requiredActionIds) visit(dependency); visiting.delete(id); visited.add(id); };
  for (const row of actions) visit(row.id);
  for (const row of hazards) { references([row.locationId], locationIds, 'Hazard location'); references(row.triggerActionIds, actionIds, 'Hazard triggers'); if (row.correctResponseActionId) references([row.correctResponseActionId], actionIds, 'Hazard response'); }
  for (const row of objectives) { assert(row.actionIds.length > 0, 'Every objective needs an action.'); references(row.actionIds, actionIds, 'Objective actions'); assert(row.actionIds.every(id => !actions.find(a => a.id === id).unsafe), 'Objectives cannot require unsafe actions.'); }
  const completion = input.completion || {}, failure = input.failure || {}, scoring = input.scoring || {};
  const startingLocationId = string(env.startingLocationId, 'Starting location', 64, true);
  references([startingLocationId], locationIds, 'Starting location');
  const locationId = string(completion.locationId, 'Completion location', 64);
  if (locationId) references([locationId], locationIds, 'Completion location');
  return {
    mission: string(input.mission, 'Mission objective', 1000, true), environment: { startingLocationId, locations }, objects, actions, hazards, objectives,
    initialFlags: ids(input.initialFlags, 'Initial flags'),
    completion: { threshold: number(completion.threshold, 1, .1, 1, 'Completion threshold'), locationId, requiredFlags: ids(completion.requiredFlags, 'Completion flags'), successMessage: string(completion.successMessage || 'Mission completed safely.', 'Success feedback') },
    failure: { maxMistakes: number(failure.maxMistakes, 5, 1, 100, 'Maximum mistakes'), flags: ids(failure.flags, 'Failure flags'), message: string(failure.message || 'Mission stopped. Review the procedure before trying again.', 'Failure feedback') },
    scoring: { baseScore: number(scoring.baseScore, 0, 0, 10000, 'Base score'), correctActionPoints: number(scoring.correctActionPoints, 50, 0, 10000, 'Correct action points'), failurePenalty: number(scoring.failurePenalty, 0, 0, 10000, 'Failure penalty') },
  };
}

export function createMissionState(config, at) {
  return { locationId: config.environment.startingLocationId, flags: [...config.initialFlags], completedActions: [], performedActions: [], completedObjectives: [], objectiveEvents: [], actions: [], hazards: [], mistakes: 0, rawScore: 0, score: 0, result: 'in-progress', feedback: '', startedAt: at, finishedAt: null };
}
const hasAll = (required, actual) => required.every(id => actual.includes(id));
export function visibleObjects(config, state) {
  return config.objects.filter(row => row.locationId === state.locationId && hasAll(row.requiredFlags, state.flags) && !row.hiddenAfterActionIds.some(id => state.completedActions.includes(id)));
}
export function actionAvailability(action, state) {
  if (action.once && (state.performedActions || state.completedActions).includes(action.id)) return { allowed: false, reason: 'Already performed' };
  if (!hasAll(action.requiredActionIds, state.completedActions) || !hasAll(action.requiredFlags, state.flags)) return { allowed: false, reason: 'Complete the required preparation first' };
  return { allowed: true, reason: '' };
}
function objectivesAfter(config, state, actionId, at) {
  for (const objective of config.objectives) {
    if (objective.actionIds.includes(actionId) && !state.objectiveEvents.some(row => row.id === objective.id)) state.objectiveEvents.push({ id: objective.id, label: objective.label, startedAt: at, completedAt: null });
    if (!state.completedObjectives.includes(objective.id) && hasAll(objective.actionIds, state.completedActions)) {
      state.completedObjectives.push(objective.id);
      const event = state.objectiveEvents.find(row => row.id === objective.id); if (event) event.completedAt = at;
    }
  }
}
export function missionProgress(config, state) {
  const required = config.objectives.filter(row => row.required);
  return required.filter(row => state.completedObjectives.includes(row.id)).length / required.length;
}
const cap = (score, rules) => Math.max(0, Math.min(rules.maxScore, Math.round(score)));
export function applyInteraction(config, original, actionId, rules, at) {
  const state = clone(original);
  if (state.result !== 'in-progress') throw new MissionError('This mission has ended.', 'ATTEMPT_FINISHED', 409);
  if (state.actions.length >= 500) throw new MissionError('Interaction limit reached. Restart the mission.', 'ACTION_LIMIT', 409);
  const action = config.actions.find(row => row.id === actionId);
  if (!action) throw new MissionError('Unknown interaction.', 'UNKNOWN_ACTION');
  if (!visibleObjects(config, state).some(row => row.id === action.objectId)) throw new MissionError('Move to the object before interacting.', 'OBJECT_NOT_ACCESSIBLE', 409);
  const availability = actionAvailability(action, state);
  if (!availability.allowed) throw new MissionError(availability.reason, 'ACTION_BLOCKED', 409);
  const triggered = config.hazards.filter(row => row.locationId === state.locationId && row.triggerActionIds.includes(action.id));
  let delta = action.unsafe ? -(action.penalty ?? rules.incorrectPenalty) : (action.points ?? config.scoring.correctActionPoints);
  for (const hazard of triggered) {
    // Charge a hazard once per attempt; subsequent unsafe interactions still incur their action penalty.
    if (!state.hazards.some(row => row.id === hazard.id)) { state.hazards.push({ id: hazard.id, name: hazard.name, triggeredAt: at, resolvedAt: null }); delta -= hazard.penalty; }
  }
  const feedback = [action.feedback, ...triggered.map(row => row.feedback)].filter(Boolean).join(' ') || (action.unsafe ? 'Unsafe action recorded.' : 'Action completed.');
  state.actions.push({ actionId: action.id, label: action.label, objectId: action.objectId, locationId: state.locationId, at, safe: !action.unsafe, delta, feedback });
  state.performedActions ||= [...state.completedActions];
  state.performedActions.push(action.id);
  if (action.unsafe) state.mistakes += 1;
  else state.completedActions.push(action.id);
  state.flags = [...new Set([...state.flags.filter(flag => !action.clearFlags.includes(flag)), ...action.setFlags])];
  for (const hazard of config.hazards) {
    if (action.resolveHazardIds.includes(hazard.id) || hazard.correctResponseActionId === action.id) {
      const event = state.hazards.find(row => row.id === hazard.id);
      if (event) event.resolvedAt = at;
      else state.hazards.push({ id: hazard.id, name: hazard.name, identifiedAt: at, triggeredAt: null, resolvedAt: at });
    }
  }
  if (action.moveTo) state.locationId = action.moveTo;
  // Keep the full action ledger: clamping the display at zero must never erase a penalty.
  state.rawScore = state.actions.reduce((total, event) => total + Number(event.delta || 0), 0);
  state.score = cap(state.rawScore, rules); state.feedback = feedback;
  objectivesAfter(config, state, action.id, at);
  if (action.critical || triggered.some(row => row.critical) || state.mistakes >= config.failure.maxMistakes || config.failure.flags.some(flag => state.flags.includes(flag))) {
    state.result = 'failed'; state.finishedAt = at; state.rawScore -= config.scoring.failurePenalty; state.score = cap(state.rawScore, rules); state.feedback = `${feedback} ${config.failure.message}`;
  }
  return state;
}
export function moveMission(config, original, locationId, at) {
  if (original.result !== 'in-progress') throw new MissionError('This mission has ended.', 'ATTEMPT_FINISHED', 409);
  const current = config.environment.locations.find(row => row.id === original.locationId);
  const connection = current?.connections.find(row => row.targetLocationId === locationId);
  if (!connection) throw new MissionError('This area is not connected to your location.', 'INVALID_MOVEMENT');
  if (!hasAll(connection.requiredActionIds, original.completedActions)) throw new MissionError('Prepare the route or access equipment before moving.', 'ROUTE_BLOCKED', 409);
  if (original.actions.length >= 500) throw new MissionError('Interaction limit reached.', 'ACTION_LIMIT', 409);
  const state = clone(original); state.locationId = locationId;
  state.actions.push({ actionId: '__move__', locationId, fromLocationId: original.locationId, at, safe: true, delta: 0 });
  state.feedback = `Moved to ${config.environment.locations.find(row => row.id === locationId).name}.`;
  return state;
}
export function finishMission(config, original, rules, at, elapsedSeconds, result = 'completed') {
  if (original.result !== 'in-progress') throw new MissionError('This mission has already ended.', 'ATTEMPT_FINISHED', 409);
  const state = clone(original);
  if (result === 'completed') {
    if (missionProgress(config, state) < config.completion.threshold || !hasAll(config.completion.requiredFlags, state.flags) || (config.completion.locationId && state.locationId !== config.completion.locationId)) throw new MissionError('Complete the required objectives and finish at the configured destination.', 'OBJECTIVES_INCOMPLETE', 409);
    const timeBonus = Math.round(rules.maxTimeBonus * Math.max(0, rules.timeLimitSeconds - elapsedSeconds) / rules.timeLimitSeconds);
    state.rawScore = state.actions.reduce((total, event) => total + Number(event.delta || 0), 0) + config.scoring.baseScore + rules.completionBonus + timeBonus;
    state.score = cap(state.rawScore, rules); state.feedback = config.completion.successMessage;
  } else { state.rawScore = state.actions.reduce((total, event) => total + Number(event.delta || 0), 0) - config.scoring.failurePenalty; state.score = cap(state.rawScore, rules); state.feedback = result === 'timeout' ? 'Time limit expired.' : result === 'abandoned' ? 'Mission restarted or left.' : config.failure.message; }
  state.result = result; state.finishedAt = at;
  return state;
}

// Safe trainee projection: scoring rules, solutions, transitions and failure triggers stay on the server.
export function publicMission(challenge, state = null) {
  const config = challenge.simulation;
  return {
    _id: String(challenge._id || ''), programme: String(challenge.programme || ''), type: 'safety_simulation',
    moduleKey: challenge.moduleKey, title: challenge.title, description: challenge.description, instructions: challenge.instructions,
    difficulty: challenge.difficulty, thumbnail: challenge.thumbnail, status: challenge.status,
    timeLimitSeconds: challenge.timeLimitSeconds, maxScore: challenge.maxScore, estimatedDurationSeconds: challenge.estimatedDurationSeconds,
    mission: config.mission,
    environment: { startingLocationId: config.environment.startingLocationId, locations: config.environment.locations.map(row => ({ ...row, connections: row.connections.map(connection => ({ targetLocationId: connection.targetLocationId, label: connection.label, allowed: !state || hasAll(connection.requiredActionIds, state.completedActions) })) })) },
    objectives: config.objectives.map(row => ({ id: row.id, label: row.label, required: row.required })),
    objects: (state ? visibleObjects(config, state) : config.objects).map(row => ({ id: row.id, name: row.name, description: row.description, type: row.type, locationId: row.locationId, imageUrl: row.imageUrl, yaw: row.yaw, pitch: row.pitch })),
    actions: config.actions.map(row => ({ id: row.id, objectId: row.objectId, label: row.label, verb: row.verb, ...(state ? actionAvailability(row, state) : { allowed: false, reason: 'Start mission to interact' }) })),
  };
}
