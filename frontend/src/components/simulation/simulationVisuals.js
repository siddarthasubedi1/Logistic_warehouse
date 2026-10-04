const directory = '/simulation-images/';
const images = {
  'cyber-awareness': {
    workstation: 'cyber-workstation', screen: 'cyber-workstation', email: 'cyber-email',
    attachment: 'cyber-file', usb: 'cyber-usb', verify: 'cyber-directory', report: 'cyber-report',
    documents: 'cyber-documents', cabinet: 'cyber-cabinet', visitor: 'cyber-visitor',
  },
  'working-at-height': {
    route: 'height-route', ladder: 'height-ladder', platform: 'height-platform',
    barrier: 'height-barrier', tools: 'height-tools', task: 'height-maintenance', exit: 'height-gate',
    permit: 'height-permit', guardrail: 'height-guardrail', floor: 'height-platform',
    tag: 'height-tag', alternative: 'height-permit', report: 'height-permit',
  },
  'manual-handling': {
    load: 'manual-load', trolley: 'manual-trolley', route: 'manual-route', obstacle: 'manual-obstacle',
    'wet-floor': 'manual-wet-floor', traffic: 'manual-crossing', destination: 'manual-delivery',
    pallet: 'manual-load', jack: 'manual-trolley', exit: 'manual-route', crossing: 'manual-crossing',
    bay: 'manual-delivery', record: 'manual-checklist',
  },
};
const covers = {
  'cyber-awareness': '/panoramas/cyber-awareness.png',
  'working-at-height': '/panoramas/working-height.png',
  'manual-handling': '/panoramas/manual-handling.png',
};
// Older saved missions and frozen attempt snapshots receive the same visuals.
// A trainer's own object image always takes priority over the supplied artwork.
export function missionCover(game) {
  return game.thumbnail || covers[game.moduleKey] || '/panoramas/training-room.jpg';
}
export function objectVisual(moduleKey, object, completedActions = []) {
  let illustration = images[moduleKey]?.[object.id];
  if (moduleKey === 'cyber-awareness') {
    if (['workstation', 'screen'].includes(object.id) && completedActions.some(id => ['lock-workstation', 'lock-screen'].includes(id))) illustration = 'cyber-workstation-locked';
    if (object.id === 'email' && completedActions.includes('quarantine-email')) illustration = 'cyber-email-quarantined';
  }
  if (moduleKey === 'working-at-height' && object.id === 'ladder' && completedActions.includes('isolate-ladder')) illustration = 'height-ladder-isolated';
  const fallback = illustration ? `${directory}${illustration}.svg` : covers[moduleKey] || '/panoramas/training-room.jpg';
  return { src: object.imageUrl || fallback, fallback, alt: object.imageUrl ? object.name : `${object.name} training illustration` };
}
