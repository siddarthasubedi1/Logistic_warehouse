import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import api from '../../services/api';
import { puzzleImage } from '../../utils/puzzleImages';
import { getSessionUser, normalizeRole } from '../../utils/session';

const emptyForm = {
  programmeId: '',
  title: '',
  instructions: '',
  type: 'sequence',
  propsText: '',
  pairsText: '',
  hazardsText: JSON.stringify([{ id: 'exit-01', locationId: 'emergency', yaw: 30, pitch: -8, label: 'Blocked emergency exit', hazardType: 'obstruction', description: 'Pallets block the emergency exit route.', availableActions: ['Remove the pallets', 'Ignore the obstruction', 'Add another pallet'], correctAction: 'Remove the pallets', points: 100, penalty: 25, hint: 'Escape routes must remain clear.', correctFeedback: 'The exit is clear.', incorrectFeedback: 'The escape route is still blocked.' }], null, 2),
  hint: '',
  correctFeedback: '',
  incorrectFeedback: '',
  status: 'active',
  timeLimitSeconds: 180,
  basePoints: 800,
  incorrectPenalty: 50,
  hintPenalty: 50,
  maxTimeBonus: 200,
  completionBonus: 200,
  maxScore: 1000,
  tieRule: 'faster-time',
  challengeStatus: 'active',
};

const pretty = value => String(value || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const answerLabels = text => String(text || '').split('\n').map(x => x.trim()).filter(Boolean);
const hasDuplicateLabels = labels => new Set(labels.map(x => x.toLowerCase())).size !== labels.length;
const letterFor = index => String.fromCharCode(65 + index);

function parseProps(text) {
  return answerLabels(text).map((line, index) => { const [label, imageUrl = '', imageAlt = ''] = line.split('|').map(s => s.trim()); return { id: `item-${index + 1}`, label, imageUrl, imageAlt }; });
}

function labelsInStoredCorrectOrder(row) {
  const props = row?.digitalProps || [];
  const byId = new Map(props.map(p => [String(p.id), p.imageUrl ? `${p.label} | ${p.imageUrl} | ${p.imageAlt || p.label}` : p.label]));
  const expected = Array.isArray(row?.expectedSolution) ? row.expectedSolution.map(String) : [];
  if (expected.length === props.length && expected.every(id => byId.has(id))) {
    return expected.map(id => byId.get(id));
  }
  return props.map(p => p.label);
}

function reorder(list, from, to) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export default function PuzzleManagementPage() {
  const role = normalizeRole(getSessionUser()?.role) || 'trainer';
  const [programmes, setProgrammes] = useState([]);
  const [puzzles, setPuzzles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [resultProgrammeId, setResultProgrammeId] = useState('');
  const [results, setResults] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  const load = async () => {
    const [p, z] = await Promise.all([api.get('/programmes'), api.get('/puzzles')]);
    const ps = p.data?.programmes || [];
    setProgrammes(ps);
    setPuzzles(z.data?.puzzles || []);
    if (!form.programmeId && ps[0]?._id) setForm(v => ({ ...v, programmeId: ps[0]._id }));
    if (!resultProgrammeId && ps[0]?._id) setResultProgrammeId(ps[0]._id);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { load().catch(e => setError(e.response?.data?.message || 'Unable to load Sprint 3 puzzle management.')); }, []);

  const selectedProgramme = useMemo(() => programmes.find(p => p._id === form.programmeId), [programmes, form.programmeId]);
  const labels = useMemo(() => answerLabels(form.propsText), [form.propsText]);

  const setCorrectOrderLabels = nextLabels => {
    setForm(current => ({ ...current, propsText: nextLabels.join('\n') }));
  };

  const moveStep = (index, delta) => {
    const target = index + delta;
    setCorrectOrderLabels(reorder(labels, index, target));
  };

  const dragStepOver = targetIndex => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = reorder(labels, dragIndex, targetIndex);
    setCorrectOrderLabels(next);
    setDragIndex(targetIndex);
  };

  const validateAnswerSetup = props => {
    if (props.length < 2) throw new Error('Add at least two puzzle steps.');
    if (hasDuplicateLabels(props.map(p => p.label))) throw new Error('Each puzzle step must be unique.');
  };

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const pairs = form.pairsText.split('\n').map(s => s.trim()).filter(Boolean).map(line => { const [target, label, imageUrl = ''] = line.split('|').map(s => s.trim()); return { target, label, imageUrl, targetId: crypto.randomUUID(), propId: crypto.randomUUID() }; });
      if (form.type === 'matching' && (pairs.length < 2 || pairs.some(p => !p.target || !p.label))) throw new Error('Enter at least two situation | prop pairs.');
      const props = form.type === 'matching' ? pairs.map(p => ({ id: p.propId, label: p.label, imageUrl: p.imageUrl, imageAlt: p.label })) : parseProps(form.propsText);
      if (form.type !== 'environmental-hazard') validateAnswerSetup(props);
      const hazards = form.type === 'environmental-hazard' ? JSON.parse(form.hazardsText) : [];

      // In a real ordering puzzle every card is valid. The order entered by the
      // Admin/Trainer is the hidden answer key. Trainees receive the same cards shuffled.
      const payload = {
        programmeId: form.programmeId,
        title: form.title,
        instructions: form.instructions,
        type: form.type,
        digitalProps: form.type === 'environmental-hazard' ? [] : props,
        hazards,
        targets: form.type === 'matching' ? pairs.map(p => ({ id: p.targetId, label: p.target })) : [],
        expectedSolution: form.type === 'matching' ? Object.fromEntries(pairs.map(p => [p.targetId, p.propId])) : props.map(p => p.id),
        hint: form.hint,
        correctFeedback: form.correctFeedback,
        incorrectFeedback: form.incorrectFeedback,
        status: form.status,
        challenge: {
          timeLimitSeconds: Number(form.timeLimitSeconds),
          basePoints: Number(form.basePoints),
          incorrectPenalty: Number(form.incorrectPenalty),
          hintPenalty: Number(form.hintPenalty),
          maxTimeBonus: Number(form.maxTimeBonus),
          completionBonus: Number(form.completionBonus),
          maxScore: Number(form.maxScore),
          tieRule: form.tieRule,
          status: form.challengeStatus,
        },
      };

      if (editingId) await api.patch(`/puzzles/${editingId}`, payload);
      else await api.post('/puzzles', payload);

      setMessage(editingId
        ? 'Puzzle and hidden correct order updated. Trainees will receive the cards in a random order.'
        : 'Puzzle created. The order shown in the Admin preview is stored as the hidden correct solution.');
      setEditingId('');
      setForm(v => ({ ...emptyForm, programmeId: v.programmeId }));
      await load();
    } catch (e2) {
      setError(e2.response?.data?.message || e2.message || 'Unable to save puzzle.');
    } finally {
      setSaving(false);
    }
  };

  const edit = row => {
    const c = row.challenge || {};
    const correctLabels = labelsInStoredCorrectOrder(row);
    setEditingId(row._id);
    setForm({
      programmeId: row.programme?._id || row.programme,
      title: row.title,
      instructions: row.instructions,
      type: row.type,
      propsText: correctLabels.join('\n'),
      pairsText: (row.targets || []).map(t => { const p = row.digitalProps.find(p => p.id === row.expectedSolution?.[t.id]); return `${t.label} | ${p?.label || ''} | ${p?.imageUrl || ''}`; }).join('\n'),
      hazardsText: JSON.stringify(row.hazards || [], null, 2),
      hint: row.hint || '',
      correctFeedback: row.correctFeedback || '',
      incorrectFeedback: row.incorrectFeedback || '',
      status: row.status || 'active',
      timeLimitSeconds: c.timeLimitSeconds ?? 180,
      basePoints: c.basePoints ?? 800,
      incorrectPenalty: c.incorrectPenalty ?? 50,
      hintPenalty: c.hintPenalty ?? 50,
      maxTimeBonus: c.maxTimeBonus ?? 200,
      completionBonus: c.completionBonus ?? 200,
      maxScore: c.maxScore ?? 1000,
      tieRule: c.tieRule || 'faster-time',
      challengeStatus: c.status || 'active',
    });
    setMessage(row.type === 'sequence' || row.type === 'sorting'
      ? ''
      : 'This older activity used a selection-style format. Saving it here converts it into the new drag-and-drop ordering puzzle format.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadResults = async () => {
    if (!resultProgrammeId) return;
    try {
      const r = await api.get(`/programmes/${resultProgrammeId}/challenge-results`);
      setResults(r.data);
      setError('');
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load challenge results.');
    }
  };

  return <DashboardLayout role={role} title="Puzzle & Challenge Management" subtitle="Manage ordering puzzles and 360° warehouse investigations with timed scoring.">
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</div>}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={save} className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">{editingId ? 'Edit Puzzle' : 'Create Puzzle'}</h2>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">Select an activity type. For investigations, place hazard hotspots at panorama yaw and pitch coordinates and provide corrective actions. For ordering puzzles, enter all steps in the correct order.</p>
          </div>
          {editingId && <button type="button" onClick={() => { setEditingId(''); setForm(v => ({ ...emptyForm, programmeId: v.programmeId })); setMessage(''); }} className="rounded-lg border px-3 py-2 text-xs">Cancel edit</button>}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Programme"><select required disabled={!!editingId} value={form.programmeId} onChange={e => setForm({ ...form, programmeId: e.target.value })} className="input"><option value="">Select programme</option>{programmes.map(p => <option key={p._id} value={p._id}>{p.title} · {pretty(p.level)}</option>)}</select></Field>
          <Field label="Puzzle Title"><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input" placeholder="Safe Lifting Order Challenge" /></Field>
          <Field label="Activity Type"><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input"><option value="sequence">Sequence Puzzle — Drag & Drop</option><option value="matching">Prop Matching — Select and Place</option><option value="sorting">Sorting Puzzle — Drag & Drop</option><option value="environmental-hazard">360° Warehouse Safety Investigation</option></select></Field>
          <Field label="Status"><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input"><option>active</option><option>inactive</option></select></Field>
          <Field label="Time Limit (seconds)"><input type="number" min="15" max="3600" value={form.timeLimitSeconds} onChange={e => setForm({ ...form, timeLimitSeconds: e.target.value })} className="input" /></Field>
          <Field label="Maximum Score"><input type="number" min="1" value={form.maxScore} onChange={e => setForm({ ...form, maxScore: e.target.value })} className="input" /></Field>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Field label="Question / Task"><textarea required value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} className="textarea" placeholder="Arrange the safe lifting steps into the correct order." /><span className="mt-1 block text-[11px] font-normal text-slate-500">Investigation instructions introduce the search; ordering instructions describe the sequence task.</span></Field>
          {!['environmental-hazard', 'matching'].includes(form.type) && <Field label="Puzzle Steps — enter in the CORRECT order, one per line"><textarea required value={form.propsText} onChange={e => setForm({ ...form, propsText: e.target.value })} className="textarea" placeholder={'Assess the load and route\nPosition feet securely and get close to the load\nLift smoothly using the legs\nKeep the load close while moving\nLower the load in a controlled way'} /><span className="mt-1 block text-[11px] font-normal text-slate-500">For picture cards, enter: step description | image URL | image description. Use an HTTPS image URL or /puzzle-images/filename.svg. Each image moves with its step. Enter steps in the correct order.</span></Field>}
        </div>

        {form.type === 'matching' && <Field label="Correct prop matches — one situation | prop description | optional image URL per line"><textarea required rows={6} value={form.pairsText} onChange={e => setForm({ ...form, pairsText: e.target.value })} className="textarea" placeholder="Heavy boxed load | Suitable trolley | /puzzle-images/move.svg" /><span className="block text-xs font-normal">Each situation has one unique prop. Trainees receive the props shuffled.</span></Field>}
        {form.type === 'environmental-hazard' && <Field label="Hazards (JSON array: ID, locationId, yaw, pitch, title, description, hazardType, availableActions, correctAction, points, penalty, hint and feedback)"><textarea required rows={14} value={form.hazardsText} onChange={e => setForm({ ...form, hazardsText: e.target.value })} className="textarea mt-3 font-mono text-xs" /><span className="block text-xs font-normal">Location IDs include entrance, main-aisle, manual, height, emergency and loading. Each hotspot uses the active warehouse panorama at its location.</span></Field>}
        {!['environmental-hazard', 'matching'].includes(form.type) && <section className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#0b4f87]">Admin / Trainer only</p>
              <h3 className="mt-1 text-base font-bold text-slate-900">Correct Order Preview</h3>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600">The order below is the real answer. Drag any full card to change the correct sequence before saving. A, B, C… are only position labels and update automatically.</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#0b4f87]">{labels.length} card{labels.length === 1 ? '' : 's'}</span>
          </div>

          {labels.length ? <div className="mt-4 space-y-2.5">
            {labels.map((label, index) => <div
              key={label}
              draggable
              onDragStart={e => { setDragIndex(index); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(index)); }}
              onDragEnter={e => { e.preventDefault(); dragStepOver(index); }}
              onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
              onDrop={e => { e.preventDefault(); setDragIndex(null); }}
              onDragEnd={() => setDragIndex(null)}
              className={`group flex cursor-grab items-center gap-3 rounded-2xl border-2 bg-white p-3 shadow-sm transition-all active:cursor-grabbing ${dragIndex === index ? 'scale-[1.01] border-blue-500 opacity-70 shadow-lg' : 'border-slate-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md'}`}
            >
              <span className="select-none rounded-xl bg-slate-100 px-2.5 py-2 text-xl leading-none text-slate-400 group-hover:bg-blue-50 group-hover:text-[#0b4f87]">⋮⋮</span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b4f87] text-sm font-extrabold text-white">{letterFor(index)}</span>
              <img src={puzzleImage(parseProps(label)[0])} alt={parseProps(label)[0]?.imageAlt || parseProps(label)[0]?.label} className="h-16 w-20 rounded-lg object-contain" draggable={false} /><span className="flex-1 text-sm font-semibold leading-6 text-slate-800">{parseProps(label)[0]?.label}</span>
              <span className="hidden rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0b4f87] sm:inline">Drag card</span>
              <div className="flex gap-1" onMouseDown={e => e.stopPropagation()}>
                <button type="button" onClick={() => moveStep(index, -1)} disabled={!index} className="rounded-lg border bg-white px-2.5 py-1.5 text-xs font-bold disabled:opacity-25" title="Move up">↑</button>
                <button type="button" onClick={() => moveStep(index, 1)} disabled={index === labels.length - 1} className="rounded-lg border bg-white px-2.5 py-1.5 text-xs font-bold disabled:opacity-25" title="Move down">↓</button>
              </div>
            </div>)}
          </div> : <div className="mt-4 rounded-xl border border-dashed border-blue-200 bg-white p-6 text-center text-sm text-slate-500">Enter the puzzle steps above. They will appear here as full draggable cards.</div>}
        </section>}

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <Field label="Hint"><textarea value={form.hint} onChange={e => setForm({ ...form, hint: e.target.value })} className="textarea" placeholder="Give a clue about the sequence without revealing it." /></Field>
          <Field label="Solved Feedback"><textarea required value={form.correctFeedback} onChange={e => setForm({ ...form, correctFeedback: e.target.value })} className="textarea" placeholder="Correct. You arranged every step in the safe order." /></Field>
          <Field label="Try Again Feedback"><textarea required value={form.incorrectFeedback} onChange={e => setForm({ ...form, incorrectFeedback: e.target.value })} className="textarea" placeholder="The steps are all valid, but one or more positions are wrong. Review the sequence and try again." /></Field>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <NumberField label={form.type === 'environmental-hazard' ? 'Discovery Points Pool' : 'Correctness Points'} name="basePoints" form={form} setForm={setForm} />
          <NumberField label="Wrong-position Penalty" name="incorrectPenalty" form={form} setForm={setForm} />
          <NumberField label="Hint Penalty" name="hintPenalty" form={form} setForm={setForm} />
          {form.type === 'environmental-hazard' && <NumberField label="Completion Bonus" name="completionBonus" form={form} setForm={setForm} />}
          <NumberField label="Max Time Bonus" name="maxTimeBonus" form={form} setForm={setForm} />
          <Field label="Tie Rule"><select value={form.tieRule} onChange={e => setForm({ ...form, tieRule: e.target.value })} className="input"><option value="faster-time">Faster time</option><option value="earlier-attempt">Earlier attempt</option></select></Field>
          <Field label="Challenge Status"><select value={form.challengeStatus} onChange={e => setForm({ ...form, challengeStatus: e.target.value })} className="input"><option>active</option><option>inactive</option></select></Field>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button disabled={saving} className="rounded-lg bg-[#0b4f87] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#073763] disabled:opacity-50">{saving ? 'Saving…' : editingId ? 'Update Puzzle' : 'Create Puzzle'}</button>
          <span className="text-xs text-slate-500">Module: {pretty(selectedProgramme?.programmeType || '—')}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Level: {pretty(selectedProgramme?.level || '—')}</span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0b4f87]">Correct order is never sent to the trainee</span>
        </div>
      </form>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Existing Sprint 3 Activities</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {puzzles.length ? puzzles.map(row => <article key={row._id} className="rounded-xl border p-4 transition hover:border-blue-200 hover:shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[#0b4f87]">{pretty(row.programme?.programmeType)} · {pretty(row.programme?.level)}</p>
                <h3 className="font-bold">{row.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{pretty(row.type)} · {row.type === 'environmental-hazard' ? `${row.hazards?.length || 0} hazards` : `${row.digitalProps?.length || 0} cards`} · {row.challenge?.timeLimitSeconds || '—'} sec · max {row.challenge?.maxScore || '—'} points · {row.status}</p>
              </div>
              <button onClick={() => edit(row)} className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">Edit</button>
            </div>
            <p className="mt-3 text-sm text-slate-600">{row.instructions}</p>
          </article>) : <p className="text-sm text-slate-500">No puzzles yet. Starter activities are created automatically when the server starts and matching programmes exist.</p>}
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-72 flex-1"><label className="text-xs font-semibold">Activity Results Programme</label><select value={resultProgrammeId} onChange={e => setResultProgrammeId(e.target.value)} className="input mt-1"><option value="">Select programme</option>{programmes.map(p => <option key={p._id} value={p._id}>{p.title} · {pretty(p.level)}</option>)}</select></div>
          <button onClick={loadResults} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Load Results</button>
        </div>
        {results && <div className="mt-5">
          <div className="grid gap-3 md:grid-cols-3"><Stat label="Attempts" value={results.attempts?.length || 0}/><Stat label="Personal Best Records" value={results.personalBests?.length || 0}/><Stat label="Programme" value={results.programme?.title || '—'}/></div>
          <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b"><th className="p-2">Trainee</th><th className="p-2">Puzzle</th><th className="p-2">Score</th><th className="p-2">Time</th><th className="p-2">Wrong positions</th><th className="p-2">Hints</th><th className="p-2">Result</th></tr></thead><tbody>{(results.attempts || []).map(a => <tr key={a._id} className="border-b"><td className="p-2">{a.trainee ? `${a.trainee.firstName} ${a.trainee.lastName}` : '—'}</td><td className="p-2">{a.puzzle?.title || '—'}</td><td className="p-2 font-semibold">{a.score}</td><td className="p-2">{a.durationSeconds}s</td><td className="p-2">{a.errors}</td><td className="p-2">{a.hintsUsed}</td><td className="p-2">{a.result}</td></tr>)}</tbody></table></div>
        </div>}
      </section>
    </div>
  </DashboardLayout>;
}

function Field({ label, children }) { return <label className="block text-xs font-semibold text-slate-700">{label}{children}</label>; }
function NumberField({ label, name, form, setForm }) { return <Field label={label}><input type="number" min="0" value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })} className="input" /></Field>; }
function Stat({ label, value }) { return <div className="rounded-xl bg-slate-50 p-4"><span className="text-xs text-slate-500">{label}</span><b className="mt-1 block text-lg">{value}</b></div>; }
