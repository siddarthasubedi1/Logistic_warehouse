import { useId, useState } from 'react';
import { simulationDraftForProgramme, simulationProgrammeLevel } from '../../../../shared/simulationTemplates.mjs';
import SimulationImage from './SimulationImage';
import { objectVisual } from './simulationVisuals';
const split = value => String(value || '').split(',').map(item => item.trim()).filter(Boolean);
const pretty = value => String(value || '').replace(/[-_]/g, ' ');
export function Field({ label, value, onChange, type = 'text', options, hint, ...rest }) {
  const id = useId();
  const attributes = { id, ...(hint ? { 'aria-describedby': `${id}-help` } : {}), ...rest };
  return <div className='sim-field'><label htmlFor={id}>{label}</label>{type === 'textarea' ? <textarea value={value ?? ''} onChange={event => onChange(event.target.value)} {...attributes} /> : options ? <select value={value ?? ''} onChange={event => onChange(event.target.value)} {...attributes}><option value=''>Select…</option>{options.map(option => <option key={option.id} value={option.id}>{option.name || option.label || option.id}</option>)}</select> : type === 'checkbox' ? <input type='checkbox' checked={!!value} onChange={event => onChange(event.target.checked)} {...attributes} /> : <input type={type} value={value ?? ''} onChange={event => onChange(type === 'number' ? (event.target.value === '' ? null : Number(event.target.value)) : event.target.value)} {...attributes} />}{hint && <small id={`${id}-help`}>{hint}</small>}</div>;
}
function References({ label, value = [], options, onChange }) {
  return <fieldset className='sim-reference-field'><legend>{label}</legend><div>{options.map(option => <label key={option.id}><input type='checkbox' checked={value.includes(option.id)} onChange={event => onChange(event.target.checked ? [...value, option.id] : value.filter(id => id !== option.id))} />{option.name || option.label || option.id}</label>)}</div>{value.filter(id => !options.some(option => option.id === id)).map(id => <button key={id} type='button' className='sim-alert' onClick={() => onChange(value.filter(v => v !== id))}>Remove missing reference: {id}</button>)}</fieldset>;
}
const schemas = {
  objects: [['name', 'Name'], ['description', 'Description', 'textarea'], ['type', 'Object type'], ['locationId', 'Location', 'locations'], ['imageUrl', 'Image asset path / HTTPS URL'], ['yaw', 'Horizontal angle (−180 to 180)', 'number'], ['pitch', 'Vertical angle (−75 to 75)', 'number'], ['requiredFlags', 'Visible when these state flags exist', 'flags'], ['hiddenAfterActionIds', 'Hide after any of these actions', 'actions']],
  actions: [['label', 'Action label'], ['objectId', 'Interactive object', 'objects'], ['verb', 'Interaction verb'], ['requiredActionIds', 'Prerequisite actions', 'actions'], ['requiredFlags', 'Required state flags', 'flags'], ['setFlags', 'Add state flags', 'flags'], ['clearFlags', 'Remove state flags', 'flags'], ['points', 'Correct action points (blank uses default)', 'number'], ['penalty', 'Action penalty (blank uses default)', 'number'], ['unsafe', 'Unsafe action', 'checkbox'], ['critical', 'End mission immediately', 'checkbox'], ['once', 'Perform only once', 'checkbox'], ['feedback', 'Feedback after this action', 'textarea'], ['resolveHazardIds', 'Resolve these hazards', 'hazards'], ['moveTo', 'Move player to this location (optional)', 'locations']],
  hazards: [['name', 'Name'], ['description', 'Description', 'textarea'], ['locationId', 'Location', 'locations'], ['severity', 'Severity'], ['triggerActionIds', 'Triggered by these actions', 'actions'], ['correctResponseActionId', 'Correct response action', 'single-action'], ['penalty', 'Additional hazard penalty', 'number'], ['critical', 'End mission when triggered', 'checkbox'], ['feedback', 'Hazard feedback', 'textarea'], ['imageUrl', 'Feedback image asset path / HTTPS URL']],
  objectives: [['label', 'Objective'], ['actionIds', 'Actions that complete this objective', 'actions'], ['required', 'Required objective', 'checkbox']],
  locations: [['name', 'Name'], ['description', 'Description', 'textarea'], ['panorama', 'Panorama asset path / HTTPS URL'], ['warehouseLocationId', 'Use existing warehouse room (optional)', 'warehouse']],
};
function defaults(kind, id, config) {
  if (kind === 'locations') return { id, name: 'New location', panorama: config.environment.locations.find(room => room.id === config.environment.startingLocationId)?.panorama || '/panoramas/training-room.jpg', connections: [] };
  if (kind === 'objects') return { id, name: 'New object', type: 'equipment', locationId: config.environment.startingLocationId, yaw: 0, pitch: -8 };
  if (kind === 'actions') return { id, label: 'New interaction', objectId: config.objects[0]?.id || '', verb: 'inspect', once: true, points: 50, unsafe: false, critical: false };
  if (kind === 'hazards') return { id, name: 'New hazard', locationId: config.environment.startingLocationId, penalty: 40, triggerActionIds: [], critical: false };
  return { id, label: 'New objective', actionIds: [], required: true };
}
function ItemBuilder({ kind, rows, onChange, config, warehouseLocations, moduleKey }) {
  const [openId, setOpenId] = useState('');
  const locations = config.environment.locations;
  const patch = (index, key, value) => onChange(rows.map((row, i) => i === index ? { ...row, [key]: value } : row));
  const move = (index, delta) => { const next = [...rows], target = index + delta; [next[index], next[target]] = [next[target], next[index]]; onChange(next); };
  const add = () => { let number = rows.length + 1, id = `${kind.slice(0, -1)}-${number}`; while (rows.some(row => row.id === id)) id = `${kind.slice(0, -1)}-${++number}`; onChange([...rows, defaults(kind, id, config)]); setOpenId(id); };
  return <section className='sim-builder'><div className='sim-section-heading'><h3>{pretty(kind)}</h3><button className='sim-button sim-button--light' type='button' onClick={add}>Add {kind.slice(0, -1)}</button></div>{!rows.length && <p>Add items to configure this mission.</p>}{rows.map((row, index) => <div className='sim-builder-item' key={row.id}>
    <div className='sim-builder-item-heading'><button type='button' aria-expanded={openId === row.id} onClick={() => setOpenId(openId === row.id ? '' : row.id)}><b>{index + 1}. {row.name || row.label || row.id}</b><small>{row.id}</small></button><div><button type='button' aria-label={`Move ${row.name || row.label || row.id} up`} disabled={!index} onClick={() => move(index, -1)}>↑</button><button type='button' aria-label={`Move ${row.name || row.label || row.id} down`} disabled={index === rows.length - 1} onClick={() => move(index, 1)}>↓</button><button type='button' aria-label={`Remove ${row.name || row.label || row.id}`} onClick={() => onChange(rows.filter((_, i) => i !== index))}>×</button></div></div>
    {openId === row.id && <div className='sim-form-grid'>
      <p className='sim-wide sim-help'>Identifier: {row.id}. Related items refer to this identifier.</p>
      {kind === 'objects' && <figure className='sim-wide sim-builder-visual'><SimulationImage src={objectVisual(moduleKey, row).src} fallback={objectVisual(moduleKey, row).fallback} alt={objectVisual(moduleKey, row).alt} /><figcaption>Object image preview. Leave the image field blank to use the supplied module artwork, or enter your own image path.</figcaption></figure>}
      {schemas[kind].map(([key, label, type = 'text']) => {
        let options = type === 'locations' ? locations : type === 'objects' ? config.objects : type === 'single-action' ? config.actions : type === 'warehouse' ? warehouseLocations.map(location => ({ id: location.locationId, name: location.name })) : null;
        if (['actions', 'hazards'].includes(type)) return <References key={key} label={label} value={row[key]} options={(type === 'actions' ? config.actions : config.hazards).filter(item => !(kind === 'actions' && key === 'requiredActionIds' && item.id === row.id))} onChange={value => patch(index, key, value)} />;
        if (type === 'flags') return <Field key={key} label={label} value={(row[key] || []).join(', ')} onChange={value => patch(index, key, split(value))} hint='Comma-separated state names, e.g. task-ready, incident-reported' />;
        return <Field key={key} label={label} type={type === 'number' || type === 'checkbox' || type === 'textarea' ? type : 'text'} options={options} value={row[key]} onChange={value => patch(index, key, value)} hint={kind === 'objects' && key === 'imageUrl' ? 'Optional. Built-in artwork is shown automatically for this module.' : undefined} />;
      })}
      {kind === 'locations' && <div className='sim-wide'><h4>Connected areas</h4>{(row.connections || []).map((connection, i) => <div className='sim-connection' key={i}><Field label='Destination' value={connection.targetLocationId} options={locations.filter(location => location.id !== row.id)} onChange={value => patch(index, 'connections', row.connections.map((item, j) => j === i ? { ...item, targetLocationId: value } : item))} /><Field label='Movement label' value={connection.label || ''} onChange={value => patch(index, 'connections', row.connections.map((item, j) => j === i ? { ...item, label: value } : item))} /><References label='Required preparation before moving' value={connection.requiredActionIds} options={config.actions} onChange={value => patch(index, 'connections', row.connections.map((item, j) => j === i ? { ...item, requiredActionIds: value } : item))} /><button type='button' className='sim-button sim-button--light' onClick={() => patch(index, 'connections', row.connections.filter((_, j) => j !== i))}>Remove connection</button></div>)}<button type='button' className='sim-button sim-button--light' onClick={() => patch(index, 'connections', [...(row.connections || []), { targetLocationId: locations.find(location => location.id !== row.id)?.id || '', label: '', requiredActionIds: [] }])}>Add connection</button></div>}
    </div>}
  </div>)}</section>;
}
export default function SafetySimulationForm({ form, setForm, programmes, modules, warehouseLocations, onSave, onPreview, onClose, onTemplate, saving }) {
  const config = form.simulation;
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const configure = (key, value) => setForm(current => ({ ...current, simulation: { ...current.simulation, [key]: value } }));
  const settings = (section, key, value) => setForm(current => ({ ...current, simulation: { ...current.simulation, [section]: { ...current.simulation[section], [key]: value } } }));
  const moduleProgrammes = programmes.filter(programme => programme.programmeType === form.moduleKey && programme.status === 'active' && !programme.deletedAt);
  const changeModule = key => {
    if (key === form.moduleKey) return;
    const programme = programmes.filter(p => p.programmeType === key && p.status === 'active' && !p.deletedAt)
      .sort((a, b) => Number(simulationProgrammeLevel(b.level) === 'beginner') - Number(simulationProgrammeLevel(a.level) === 'beginner') || new Date(a.createdAt) - new Date(b.createdAt))[0];
    const draft = simulationDraftForProgramme(programme || { _id: '', programmeType: key });
    setForm(current => ({ ...draft, ...(current._id ? { _id: current._id, createdAt: current.createdAt, updatedAt: current.updatedAt } : {}) }));
  };
  return <form className='sim-author-form sim-card' onSubmit={event => { event.preventDefault(); onSave('draft'); }}>
    <div className='sim-section-heading'><div><span className='sim-eyebrow'>Mission designer</span><h2>{form._id ? 'Edit safety simulation' : 'Create safety simulation'}</h2></div><button type='button' className='sim-button sim-button--light' onClick={onClose}>Close editor</button></div>
    <details open><summary>Basic information</summary><div className='sim-form-grid'>
      <Field label='Training model' value={form.moduleKey} options={modules.filter(module => module.status === 'active').map(module => ({ id: module.key, name: module.name }))} onChange={changeModule} hint='Changing the module loads its matching sample and replaces the current draft content. Save your draft first if you want to keep it.' required />
      <Field label='Training programme' value={form.programmeId} options={moduleProgrammes.map(p => ({ id: p._id, name: `${p.title} · ${simulationProgrammeLevel(p.level).replace(/^./, c => c.toUpperCase())}` }))} onChange={value => setForm(current => ({ ...current, programmeId: value, difficulty: simulationProgrammeLevel(programmes.find(p => String(p._id) === String(value))?.level) }))} required />
      <Field label='Game title' value={form.title} onChange={value => update('title', value)} required maxLength={150} />
      <Field label='Category' value={form.category} onChange={value => update('category', value)} />
      <Field label='Difficulty' value={form.difficulty} options={['beginner', 'intermediate', 'advanced'].map(id => ({ id }))} onChange={value => update('difficulty', value)} required />
      <Field label='Thumbnail asset path / HTTPS URL' value={form.thumbnail} onChange={value => update('thumbnail', value)} />
      <Field label='Estimated duration (seconds)' type='number' min={15} max={3600} value={form.estimatedDurationSeconds} onChange={value => update('estimatedDurationSeconds', value)} />
      <Field label='Description' type='textarea' value={form.description} onChange={value => update('description', value)} />
      <Field label='Instructions and scenario procedure' type='textarea' value={form.instructions} onChange={value => update('instructions', value)} />
      <button type='button' className='sim-button sim-button--light' onClick={onTemplate}>Load sample for this model</button>
    </div></details>
    <details open><summary>Mission and environment</summary><div className='sim-form-grid'>
      <Field label='Mission objective' type='textarea' value={config.mission} onChange={value => configure('mission', value)} required />
      <Field label='Time limit (seconds)' type='number' value={form.timeLimitSeconds} min={15} max={3600} onChange={value => update('timeLimitSeconds', value)} />
      <Field label='Starting location' value={config.environment.startingLocationId} options={config.environment.locations} onChange={value => configure('environment', { ...config.environment, startingLocationId: value })} />
      <Field label='Initial state flags' value={(config.initialFlags || []).join(', ')} onChange={value => configure('initialFlags', split(value))} />
    </div><ItemBuilder kind='locations' rows={config.environment.locations} onChange={locations => configure('environment', { ...config.environment, locations })} config={config} warehouseLocations={warehouseLocations} /></details>
    {['objects', 'actions', 'hazards', 'objectives'].map(kind => <details key={kind}><summary>{pretty(kind)} · {(config[kind] || []).length}</summary><ItemBuilder kind={kind} rows={config[kind] || []} onChange={value => configure(kind, value)} config={config} warehouseLocations={warehouseLocations} moduleKey={form.moduleKey} /></details>)}
    <details><summary>Scoring</summary><div className='sim-form-grid'>{[['baseScore', 'Mission base score (awarded after success)'], ['correctActionPoints', 'Default correct action points'], ['failurePenalty', 'Failure penalty']].map(([key, label]) => <Field key={key} type='number' label={label} value={config.scoring[key]} onChange={value => settings('scoring', key, value)} />)}{[['incorrectPenalty', 'Default unsafe action penalty'], ['completionBonus', 'Completion bonus'], ['maxTimeBonus', 'Maximum time bonus'], ['maxScore', 'Maximum score']].map(([key, label]) => <Field key={key} label={label} type='number' value={form[key]} onChange={value => update(key, value)} />)}</div></details>
    <details><summary>Completion and failure rules</summary><div className='sim-form-grid'>
      <Field label='Required objective completion threshold (0.1–1)' type='number' min={.1} max={1} step={.1} value={config.completion.threshold} onChange={value => settings('completion', 'threshold', value)} />
      <Field label='Finish at this location (optional)' value={config.completion.locationId || ''} options={config.environment.locations} onChange={value => settings('completion', 'locationId', value)} />
      <Field label='Required completion state flags' value={(config.completion.requiredFlags || []).join(', ')} onChange={value => settings('completion', 'requiredFlags', split(value))} />
      <Field label='Success feedback' type='textarea' value={config.completion.successMessage} onChange={value => settings('completion', 'successMessage', value)} />
      <Field label='Maximum unsafe actions before failure' type='number' min={1} max={100} value={config.failure.maxMistakes} onChange={value => settings('failure', 'maxMistakes', value)} />
      <Field label='Failure state flags (any one stops mission)' value={(config.failure.flags || []).join(', ')} onChange={value => settings('failure', 'flags', split(value))} />
      <Field label='Failure feedback' type='textarea' value={config.failure.message} onChange={value => settings('failure', 'message', value)} />
    </div></details>
    <div className='sim-form-footer'><button type='submit' className='sim-button sim-button--light' disabled={saving}>Save draft</button><button type='button' className='sim-button sim-button--light' disabled={saving} onClick={onPreview}>Preview current draft</button><button type='button' className='sim-button' disabled={saving} onClick={() => onSave('active')}>Save and activate</button></div>
  </form>;
}
