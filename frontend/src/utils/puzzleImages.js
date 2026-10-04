// Visual cues follow the meaning of the step, never its answer position.
export function puzzleImage(card) {
  if (card?.imageUrl) return card.imageUrl;
  const text = String(card?.label || '').toLowerCase();
  const rules = [
    [/report|escalate|record|document/, 'report'],
    [/stop|do not|pause|avoid/, 'stop'],
    [/lock|password|multifactor|revoke/, 'lock'],
    [/verify|confirm|authoris/, 'verify'],
    [/route|obstacle|obstruction|destination/, 'route'],
    [/barrier|exclusion|falling|restrict/, 'barrier'],
    [/ladder|platform|access equipment/, 'equipment'],
    [/grip|lift|bend|feet/, 'lift'],
    [/carry|move|transfer|trolley|lower/, 'move'],
    [/agree|roles|communication|team/, 'communicate'],
    [/inspect|check|assess|identify|survey/, 'inspect'],
  ];
  return `/puzzle-images/${rules.find(([pattern]) => pattern.test(text))?.[1] || 'plan'}.svg`;
}
