const creationSteps = [
  'Sign in as an Administrator or authorised Trainer. Make sure the training module and its programme are active.',
  'Open Safety Simulations and select Create game. Use the Training model filter first if you want a particular module.',
  'In Basic information, choose the Training model and Training programme. The matching module sample loads automatically; changing modules replaces the current draft content.',
  'Set Game title, Category, Difficulty, Thumbnail, Estimated duration, Description and Instructions. Load sample for this model resets the draft to its module sample.',
  'In Mission and environment, enter the mission objective, time limit and starting location. For the provided samples, keep the existing locations and connections for your first game.',
  'Expand a location to change its name, panorama and connected areas. Connection prerequisites decide which actions must be completed before moving.',
  'Expand Objects. Select an object to edit its name, description, type, location and hotspot angles, or use Add object. Built-in module artwork appears automatically; use Image asset path / HTTPS URL to supply your own image.',
  'Expand Actions. Link every action to an object, add prerequisite actions and feedback, and set points for safe actions. Unsafe actions must award zero points; critical actions end the mission.',
  'Expand Hazards. Link each hazard to the actions that trigger it and to its safe response. On the response action, also select the hazard under Resolve these hazards.',
  'Expand Objectives. Select the safe actions that complete each objective and mark compulsory objectives as Required.',
  'Set Scoring and Completion and failure rules. A completion threshold of 1 requires every compulsory objective. The required final location and state flags must also be satisfied.',
  'Select Save draft, then Preview current draft. Start the preview and complete the whole mission to check objects, actions, movement and the ending.',
  'Return from preview and select Save and activate. Draft or inactive games remain unavailable to trainees.',
  'Ensure the active programme is assigned to the trainee through Training Assignments. The trainee must complete learning, submit the whole scenario exercise and pass this level assessment before playing.',
];
const playSteps = [
  'Sign in as a Trainee. Open My Training, select your module and enter an unlocked training level.',
  'Complete each Learning section with Mark Complete. Submit every Scenario response, then pass the assessment for that same level.',
  'Select Safety Missions in the 360° environment, choose a mission and open its briefing.',
  'Read the mission, instructions, time limit and objective list. Select Start mission; Full screen is optional.',
  'Drag to look around or use the arrow and zoom controls. Select an object hotspot or an illustrated object card below the scene.',
  'Inspect the object image and description, then choose a safe action. Enlarge image opens a closer view; close it or press Escape to return. If an action is locked, complete its prerequisite actions first.',
  'Follow the objective list. Use the connected-area buttons to move after the required preparation is complete.',
  'Complete all compulsory objectives and move to the required final location. Select Complete mission.',
  'Review your result, score, mistakes and completed objectives. View mission scores shows the shared rankings.',
  'Select Restart for a new attempt, or Exit mission to leave. Returning and selecting Start mission resumes an unfinished attempt while its time remains.',
];
export default function SafetySimulationHelp({ mode = 'create' }) {
  return <details className='sim-help-guide sim-card'>
    <summary>{mode === 'play' ? 'How to play · step by step' : 'How to create a safety simulation · step by step'}</summary>
    <ol>{(mode === 'play' ? playSteps : creationSteps).map(step => <li key={step}>{step}</li>)}</ol>
    <p>{mode === 'play' ? 'Unsafe actions deduct points and can end the mission. Pause view hides the scene controls; the timer keeps running.' : 'Sample imports preserve existing missions and add drafts only. Activate each reviewed mission to make it available to trainees.'}</p>
  </details>;
}
