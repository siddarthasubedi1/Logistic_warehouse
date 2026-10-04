import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import PropMatchingBoard from './PropMatchingBoard';
import PuzzleLeaderboard from './PuzzleLeaderboard';
import { puzzleImage } from '../../utils/puzzleImages';
import EnvironmentalPuzzleExperience from './EnvironmentalPuzzleExperience';
import './PuzzleStudio.css';

const pretty = value => String(value || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const formatTime = seconds => `${Math.max(0, Math.floor(seconds / 60))}:${String(Math.max(0, seconds % 60)).padStart(2, '0')}`;
const letterFor = index => String.fromCharCode(65 + index);

function chooseRandomActivities(rows = [], count = 5) {
  const copy = [...rows];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

function reorder(list, from, to) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export default function OrderingPuzzleExperience({
  programmeId,
  embedded = false,
  immersive360 = false,
  onBack,
}) {
  const [propActivities, setPropActivities] = useState([]);
  const [view, setView] = useState('play');
  const [scoreSummary, setScoreSummary] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const [programme, setProgramme] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activityPoolSize, setActivityPoolSize] = useState(0);
  const [selected, setSelected] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [placements, setPlacements] = useState({});
  const [cardOrder, setCardOrder] = useState([]);
  // Letters belong to the card for one attempt. The trainee can move the full
  // A/B/C card anywhere, but the hidden backend ID is what is actually scored.
  const [cardLetters, setCardLetters] = useState({});
  const [initialOrder, setInitialOrder] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragIndex, setDragIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async ({ chooseSessionSet = false } = {}) => {
    setLoading(true);
    try {
      const [a, h] = await Promise.all([
        api.get(`/programmes/${programmeId}/activities`),
        api.get('/trainee/challenge-attempts', { params: { programmeId } }),
      ]);
      const allActivities = (a.data?.activities || []).filter(row => row.puzzle.type !== 'matching');
      setPropActivities((a.data?.activities || []).filter(row => row.puzzle.type === 'matching'));

      setProgramme(a.data?.programme || null);
      setActivityPoolSize(allActivities.length);
      setActivities(current => {
        if (chooseSessionSet || !current.length) return chooseRandomActivities(allActivities, 5);
        return current.map(row => allActivities.find(next => String(next.puzzle?._id) === String(row.puzzle?._id)) || row);
      });
      setHistory(h.data?.attempts || []);
      if (!allActivities.length) setMessage('No active puzzle challenge has been added to this level yet.');
      else setMessage('');
    } catch (e) {
      setMessage(e.response?.data?.message || 'Unable to load puzzle challenges.');
    } finally {
      setLoading(false);
    }
  };

  // Pick a fresh random 5 only when this puzzle screen is opened again.
  // Submitting/retrying inside the same visit keeps the same five questions.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { if (programmeId) load({ chooseSessionSet: true }); }, [programmeId]);

  useEffect(() => {
    if (!attempt || !selected || result) return undefined;
    const started = new Date(attempt.startedAt).getTime();
    const limit = Number(selected.challenge.timeLimitSeconds || 0);
    const tick = () => setRemaining(Math.max(0, limit - Math.floor((Date.now() - started) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [attempt, selected, result]);

  const props = useMemo(() => selected?.puzzle?.digitalProps || [], [selected]);
  const propById = useMemo(() => new Map(props.map(p => [String(p.id), p])), [props]);
  const timeLimit = Number(selected?.challenge?.timeLimitSeconds || 1);
  const timePercent = Math.max(0, Math.min(100, (remaining / timeLimit) * 100));
  const selectedActivityIndex = activities.findIndex(a => String(a.puzzle?._id) === String(selected?.puzzle?._id));
  const questionNumber = String(selectedActivityIndex >= 0 ? selectedActivityIndex + 1 : 1).padStart(2, '0');
  const orderChanged = cardOrder.length > 1 && initialOrder.length === cardOrder.length && cardOrder.some((id, index) => id !== initialOrder[index]);
  const hasNextPuzzle = selectedActivityIndex >= 0 && activities.slice(selectedActivityIndex + 1).some(row => !row.locked);

  const begin = async activity => {
    setMessage('');
    setResult(null);
    setHint('');
    setSubmitting(false);
    setDragIndex(null);
    setView('play');
    try {
      const r = await api.post(`/challenges/${activity.challenge._id}/start`);
      const p = r.data?.puzzle || activity.puzzle;
      const challenge = r.data?.challenge || activity.challenge;
      const shuffled = (p.digitalProps || []).map(item => String(item.id));
      setSelected({ ...activity, puzzle: p, challenge });
      setAttempt(r.data?.attempt || null);
      setRemaining(Number(challenge.timeLimitSeconds || 0));
      setCardOrder(shuffled);
      setPlacements({});
      setCardLetters(Object.fromEntries(shuffled.map((id, index) => [String(id), letterFor(index)])));
      setInitialOrder(shuffled);
      window.dispatchEvent(new Event('puzzle-studio-start'));
    } catch (e) {
      setMessage(e.response?.data?.message || 'Unable to start challenge.');
    }
  };

  const dragCardOver = targetIndex => {
    if (submitting || remaining <= 0) return;
    if (dragIndex === null || dragIndex === targetIndex) return;
    setCardOrder(current => reorder(current, dragIndex, targetIndex));
    setDragIndex(targetIndex);
  };

  const moveCard = (index, delta) => {
    if (submitting || remaining <= 0) return;
    const target = index + delta;
    setCardOrder(current => reorder(current, index, target));
  };

  const resetOrder = () => {
    if (submitting || remaining <= 0) return;
    setCardOrder(initialOrder);
    setDragIndex(null);
    setMessage('');
  };

  const useHint = async () => {
    if (!attempt?._id) return;
    try {
      const r = await api.post(`/challenge-attempts/${attempt._id}/hint`);
      setHint(r.data?.hint || '');
    } catch (e) {
      setMessage(e.response?.data?.message || 'Unable to load hint.');
    }
  };

  const submit = async () => {
    if (!attempt?._id || !selected || submitting) return;
    if (remaining > 0 && selected.puzzle.type === 'matching' && Object.keys(placements).length !== selected.puzzle.targets.length) { setMessage('Place a prop at every target first.'); return; }
    if (cardOrder.length !== props.length || new Set(cardOrder).size !== props.length) {
      setMessage('The puzzle is incomplete. Every card must appear exactly once before you can check the order.');
      return;
    }
    setSubmitting(true);
    try {
      const r = await api.post(`/challenges/${selected.challenge._id}/submit`, {
        attemptId: attempt._id,
        answers: selected.puzzle.type === 'matching' ? placements : cardOrder,
      });
      setResult(r.data);
      window.dispatchEvent(new Event('puzzle-studio-start'));
      setMessage('');
      await load();
    } catch (e) {
      setMessage(e.response?.data?.message || 'Unable to submit challenge.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetChallenge = () => {
    setAttempt(null);
    setSelected(null);
    setResult(null);
    setCardOrder([]);
    setCardLetters({});
    setInitialOrder([]);
    setHint('');
    setMessage('');
    setDragIndex(null);
    window.dispatchEvent(new Event('puzzle-studio-start'));
  };

  const nextPuzzle = () => {
    const currentIndex = activities.findIndex(row => String(row.puzzle?._id) === String(selected?.puzzle?._id));
    const next = currentIndex < 0 ? null : activities.slice(currentIndex + 1).find(row => !row.locked);
    if (next) begin(next);
    else resetChallenge();
  };

  const shellClass = embedded
    ? 'space-y-5 p-1 md:p-2'
    : 'mx-auto max-w-6xl space-y-6 p-4 md:p-6';

  return <div className={`${shellClass} ordering-puzzle-experience puzzle-studio ${immersive360 ? 'ordering-puzzle-experience--immersive360' : ''}`}>
    {!embedded && <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#0b4f87]">{pretty(programme?.programmeType)}</p>
        <h2 className="text-2xl font-bold">{programme?.title || 'Training Challenge'}</h2>
        <p className="text-sm text-slate-500">{pretty(programme?.level)} level · puzzle score is separate from compulsory pass/fail.</p>
      </div>
      {onBack && <button onClick={onBack} className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-slate-50">← Back to 360 Training</button>}
    </div>}

    {embedded && !immersive360 && <div className="rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#0b4f87]">360° Puzzle Station · {pretty(programme?.level)} Level</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">{programme?.title || 'Training Challenge'}</h2>
          <p className="mt-1 text-xs text-slate-500">Solve the level puzzle without leaving the immersive training environment.</p>
        </div>
        {onBack && <button onClick={onBack} className="rounded-xl border bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">← Return to 360 view</button>}
      </div>
    </div>}

    {message && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{message}</div>}
    {loading && !attempt ? <div className="rounded-xl border bg-white p-6">Loading {pretty(programme?.level)} puzzle activities…</div> : null}

    {!attempt && !result && !loading && <>
      <section className="studio-welcome">
        <div className="studio-welcome__copy"><span className="studio-eyebrow">{pretty(programme?.level)} · LEARN BY DOING</span><h2>Explore. Arrange. Build your best.</h2><p>Practise real decisions in your 360° learning space. Choose a picture puzzle or step into the Prop Lab.</p><div className="studio-welcome__tags"><span>{activities.length} puzzles this visit</span><span>{activityPoolSize} in the level bank</span><span>Best scores saved</span></div></div>
        <div className="studio-total"><span>Your total best</span><strong>{scoreSummary ? Number(scoreSummary.highScore).toLocaleString() : '—'}</strong><small>across all puzzles</small><button type="button" onClick={() => setView('scores')}>View trainee scores ↗</button></div>
      </section>
      <div className="studio-navigation"><div className="studio-tabs" role="tablist" aria-label="Puzzle workspace"><button id="studio-play-tab" role="tab" type="button" aria-selected={view === 'play'} aria-controls="studio-play-panel" onClick={() => setView('play')}>Puzzle activities</button><button id="studio-scores-tab" role="tab" type="button" aria-selected={view === 'scores'} aria-controls="studio-scores-panel" onClick={() => setView('scores')}>Trainee scores</button></div><button className="studio-button studio-button--secondary" type="button" onClick={() => load({ chooseSessionSet: true })}>↻ Draw a new set</button></div>
      <div id="studio-play-panel" role="tabpanel" aria-labelledby="studio-play-tab" hidden={view !== 'play'}>
        {propActivities.length > 0 && <section className="studio-prop-lab"><div><span className="studio-eyebrow">INTERACTIVE PRACTICE</span><h3>Prop Lab</h3><p>Select an object. Place the right control. Learn through action.</p></div><div className="studio-prop-lab__activities">{propActivities.map(activity => <button key={activity.puzzle._id} disabled={activity.locked} onClick={() => begin(activity)}><span className="studio-prop-icon" aria-hidden="true">◇</span><span><b>{activity.puzzle.title.replace(/^Prop Lab [—–-] /, '')}</b><small>{activity.locked ? 'Pass this level assessment to unlock' : 'Select and place · Enter lab →'}</small></span></button>)}</div></section>}
        <section className="studio-activity-grid" aria-label="Picture puzzle activities">
          {activities.length ? activities.map((activity, index) => <article key={activity.puzzle?._id || index} className="studio-activity-card">
            <div className="studio-activity-art"><img src={puzzleImage(activity.puzzle?.digitalProps?.[0])} alt="" /><span>{String(index + 1).padStart(2, '0')}</span></div>
            <div className="studio-activity-copy"><span className="studio-eyebrow">{activity.puzzle?.type === 'environmental-hazard' ? '360° investigation' : 'Picture sequence'} · {pretty(programme?.level)}</span><h3>{activity.puzzle?.title}</h3><p>{activity.puzzle?.instructions}</p><div className="studio-activity-meta"><span>◷ {activity.challenge?.timeLimitSeconds || 0}s</span><span>{activity.puzzle?.type === 'environmental-hazard' ? `${activity.puzzle?.hazards?.length || 0} hazards` : `${activity.puzzle?.digitalProps?.length || 0} cards`}</span>{activity.personalBest?.score > 0 && <span className="studio-best">Best {activity.personalBest.score}</span>}</div><button type="button" className="studio-button" disabled={activity.locked} onClick={() => begin(activity)}>{activity.locked ? 'Assessment required' : 'Start puzzle →'}</button></div>
          </article>) : <p className="studio-notice">No puzzle activities are available for this level.</p>}
        </section>
      </div>
    </>}

    {attempt && selected?.puzzle?.type === 'environmental-hazard' && <EnvironmentalPuzzleExperience key={attempt._id} selected={selected} initialAttempt={attempt} onRetry={() => { resetChallenge(); load(); }} onBack={onBack} />}
    {attempt && selected && selected.puzzle?.type !== 'environmental-hazard' && !result && <section className="puzzle360-live overflow-hidden rounded-3xl border bg-white shadow-lg">
      <div className="studio-live-heading bg-gradient-to-r from-[#073763] to-[#1769aa] p-5 text-white md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-100">{pretty(programme?.level)} Level · Puzzle {questionNumber}</p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">{selected.puzzle.title}</h2>
            <p className="mt-3 text-sm leading-6 text-blue-50">{selected.puzzle.instructions}</p>
          </div>
          <div className={`min-w-28 rounded-2xl border border-white/20 px-4 py-3 text-center backdrop-blur ${remaining <= 15 ? 'bg-red-500/30' : 'bg-white/10'}`}><span className="text-[10px] font-bold uppercase tracking-wider text-blue-100">Time Left</span><b className="mt-1 block text-3xl tabular-nums">{formatTime(remaining)}</b></div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/20"><div className={`h-full rounded-full transition-all duration-500 ${remaining <= 15 ? 'bg-red-300' : 'bg-white'}`} style={{ width: `${timePercent}%` }} /></div>
      </div>

      <div className="studio-live-body p-5 md:p-6">
        {selected.puzzle.type === 'matching' ? <PropMatchingBoard puzzle={selected.puzzle} placements={placements} onChange={setPlacements} disabled={submitting || remaining <= 0} /> : <>

        <div className="puzzle360-instructions mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
          <div>
            <h3 className="font-bold text-slate-900">Arrange the picture cards into the correct order</h3>
            <label className="studio-description-toggle mt-2 block text-sm"><input type="checkbox" checked={showLabels} onChange={e => setShowLabels(e.target.checked)} /> Show step descriptions</label>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600">Press and hold anywhere on a complete card, then drag it to a new position. The option letter moves with that card. All cards are valid; only their top-to-bottom order is scored.</p>
          </div>
          <button type="button" onClick={resetOrder} disabled={!orderChanged || submitting || remaining <= 0} className="rounded-xl border bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">↺ Reset Shuffle</button>
        </div>

        <div className="studio-ordering-board mx-auto max-w-4xl space-y-3" aria-label="Arrange picture cards">
          {cardOrder.map((id, index) => {
            const card = propById.get(String(id));
            return <div
              key={id}
              draggable={!submitting && remaining > 0}
              onDragStart={e => { setDragIndex(index); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(id)); }}
              onDragEnter={e => { e.preventDefault(); dragCardOver(index); }}
              onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
              onDrop={e => { e.preventDefault(); setDragIndex(null); }}
              onDragEnd={() => setDragIndex(null)}
              className={`puzzle360-card group flex flex-wrap min-h-20 cursor-grab select-none items-center gap-4 rounded-2xl border-2 bg-white p-4 shadow-sm transition-all active:cursor-grabbing ${dragIndex === index ? 'z-10 scale-[1.02] border-blue-500 opacity-75 shadow-xl' : 'border-slate-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md'}`}
              aria-label={`Option ${cardLetters[String(id)] || letterFor(index)}: ${card?.label || id}. Draggable answer card currently in position ${index + 1}.`}
            >
              <span className="studio-card-position" aria-label={`Position ${index + 1}`}>{index + 1}</span>
              <span className="studio-drag-handle rounded-xl bg-slate-100 px-2.5 py-2 text-2xl leading-none text-slate-400 transition group-hover:bg-blue-50 group-hover:text-[#0b4f87]">⋮⋮</span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0b4f87] text-base font-extrabold text-white shadow-sm">{cardLetters[String(id)] || letterFor(index)}</span>
              <img src={puzzleImage(card)} alt={card?.imageAlt || card?.label || "Puzzle step"} draggable={false} className="studio-card-image shrink-0 rounded-xl object-contain" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/puzzle-images/plan.svg"; }} />
              {showLabels && <span className="studio-card-label flex-1 text-sm font-semibold leading-6 text-slate-800 md:text-base">{card?.label || id}</span>}
              <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:inline">Drag card</span>
              <div className="studio-card-movers flex gap-1" onMouseDown={e => e.stopPropagation()}>
                <button type="button" onClick={() => moveCard(index, -1)} disabled={!index || submitting || remaining <= 0} className="rounded-lg border bg-white px-2.5 py-1.5 text-xs font-bold disabled:opacity-20" title="Move up" aria-label={`Move option ${cardLetters[String(id)] || letterFor(index)} up`}>↑</button>
                <button type="button" onClick={() => moveCard(index, 1)} disabled={index === cardOrder.length - 1 || submitting || remaining <= 0} className="rounded-lg border bg-white px-2.5 py-1.5 text-xs font-bold disabled:opacity-20" title="Move down" aria-label={`Move option ${cardLetters[String(id)] || letterFor(index)} down`}>↓</button>
              </div>
            </div>;
          })}
        </div>

        <div className="mx-auto mt-4 max-w-4xl rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500">All {cardOrder.length} cards are valid steps. Solve the level puzzle by changing only their positions.</div>

        </>}
        {hint && <div className="mx-auto mt-5 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><div className="flex gap-3"><span className="text-xl">💡</span><div><b>Hint unlocked</b><p className="mt-1">{hint}</p></div></div></div>}

        <div className="studio-check-bar mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          <div className="flex flex-wrap gap-2 text-xs text-slate-500"><span className="rounded-full bg-slate-100 px-3 py-1.5">✓ Points require a completely correct solution</span><span className="rounded-full bg-slate-100 px-3 py-1.5">💡 Hints reduce the time bonus</span></div>
          <div className="flex flex-wrap gap-2"><button type="button" disabled={submitting || remaining <= 0} onClick={useHint} className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:bg-amber-50">💡 Use Hint</button><button type="button" onClick={submit} disabled={submitting || !cardOrder.length} className="rounded-xl bg-[#0b4f87] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#073763] disabled:cursor-not-allowed disabled:bg-slate-300">{submitting ? 'Checking…' : remaining <= 0 ? 'Finish & Record Timeout' : selected.puzzle.type === 'matching' ? 'Check My Props →' : 'Check My Order →'}</button></div>
        </div>
      </div>
    </section>}

    {result && <section className="puzzle360-result overflow-hidden rounded-2xl border border-[#d7e0ea] bg-white shadow-sm">
      <div className={`p-5 ${result.exact ? 'bg-emerald-50' : result.attempt?.result === 'timeout' ? 'bg-red-50' : 'bg-amber-50'}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-full text-xl ${result.exact ? 'bg-emerald-600 text-white' : 'bg-white text-amber-700'}`}>{result.exact ? '✓' : result.attempt?.result === 'timeout' ? '⏱' : '↻'}</span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#0b4f87]">{pretty(programme?.level)} puzzle result</p>
              <h2 className="text-xl font-bold text-[#172033]">{result.exact ? 'Challenge solved' : result.attempt?.result === 'timeout' ? 'Time limit reached' : 'Not correct yet'}</h2>
            </div>
          </div>
          {result.exact ? <div className="rounded-xl bg-[#073763] px-5 py-3 text-center text-white"><small className="block text-[10px] font-bold uppercase tracking-wider text-blue-100">Score recorded</small><b className="text-2xl">{result.attempt?.score}</b><span className="text-xs text-blue-100"> / {result.scoring?.maxScore}</span></div> : <div className="rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-bold text-amber-800">No score recorded</div>}
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{result.feedback}</p>
      </div>
      <div className="p-5">
        {result.exact ? <>
          <div className="grid gap-3 sm:grid-cols-3"><Metric label="Time" value={`${result.attempt?.durationSeconds || 0}s`} /><Metric label="Hints" value={result.attempt?.hintsUsed ?? 0} /><Metric label="Personal Best" value={result.personalBest?.score ?? result.attempt?.score ?? 0} /></div>
          {result.personalBestUpdated ? <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">🏆 New personal best recorded. Your total has improved.</div> : <p className="mt-4 text-sm text-slate-600">Your saved best stays unchanged because this score did not improve it.</p>}
        </> : <div className="rounded-xl border border-[#d7e0ea] bg-[#f8fafc] p-4 text-sm text-[#475569]">Incorrect or partial solutions receive no points. Review the answer below before continuing.</div>}
        {result.matchingAnswer?.length > 0 && <div className="mt-4 rounded-xl bg-blue-50 p-4"><h3 className="font-bold">Correct prop placements</h3><ul className="mt-2 space-y-2">{result.matchingAnswer.map((row, i) => <li key={i}><b>{row.target}:</b> {row.prop}</li>)}</ul></div>}
        {result.answer?.length > 0 && <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-[#172033]"><h3 className="font-bold">Correct answer</h3><ol className="mt-2 list-inside list-decimal space-y-1">{result.answer.map((step, index) => <li key={`${index}-${step}`}>{step}</li>)}</ol></div>}
        <div className="mt-5 flex flex-wrap gap-3"><button onClick={() => begin(selected)} className="studio-button studio-button--secondary">Try again ↻</button><button onClick={nextPuzzle} className="rounded-xl bg-[#0b4f87] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#073763]">{hasNextPuzzle ? 'Next Puzzle →' : 'Finish Puzzle Set →'}</button></div>
      </div>
    </section>}

    <div id="studio-scores-panel" role="tabpanel" aria-labelledby={!attempt && !result ? 'studio-scores-tab' : undefined} hidden={(!result && view !== 'scores') || (!!attempt && !result)}>
      <PuzzleLeaderboard refreshKey={history.length} onSummary={setScoreSummary} />
    </div>
    {!attempt && view === 'play' && <details className="puzzle360-history rounded-2xl border bg-white p-5 shadow-sm"><summary>My {pretty(programme?.level)} attempt history <span>{history.length} attempts</span></summary><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b"><th className="p-2">Activity</th><th className="p-2">Score</th><th className="p-2">Time</th><th className="p-2">Errors</th><th className="p-2">Hints</th><th className="p-2">Result</th></tr></thead><tbody>{history.length ? history.map(a => <tr key={a._id} className="border-b"><td className="p-2">{a.puzzle?.title || 'Puzzle'}</td><td className="p-2 font-semibold">{Number(a.accuracy) === 1 && Number(a.score) > 0 ? a.score : 'No score'}</td><td className="p-2">{a.durationSeconds ?? '—'}s</td><td className="p-2">{a.errors}</td><td className="p-2">{a.hintsUsed}</td><td className="p-2">{a.result}</td></tr>) : <tr><td colSpan="6" className="p-4 text-center text-slate-500">No puzzle attempts yet for this level.</td></tr>}</tbody></table></div></details>}
  </div>;
}

function Metric({ label, value }) { return <div className="rounded-xl border bg-white p-4"><span className="text-xs text-slate-500">{label}</span><b className="mt-1 block text-lg">{value}</b></div>; }
