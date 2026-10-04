import { useEffect, useRef, useState } from 'react';
import api from '../../services/api';
import Trainee360Environment from '../../pages/trainee/Trainee360Environment';

const clock = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
export default function EnvironmentalPuzzleExperience({ selected, initialAttempt, onRetry, onBack }) {
  const [attempt, setAttempt] = useState(initialAttempt);
  const [remaining, setRemaining] = useState(0);
  const [hazard, setHazard] = useState(null);
  const [action, setAction] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const [expired, setExpired] = useState(false);
  const timeoutSent = useRef(false);
  const challenge = selected.challenge;
  const hazards = selected.puzzle.hazards || [];
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, challenge.timeLimitSeconds - Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000)));
    tick(); const interval = setInterval(tick, 1000); return () => clearInterval(interval);
  }, [attempt.startedAt, challenge.timeLimitSeconds]);
  useEffect(() => {
    if (remaining !== 0 || timeoutSent.current || attempt.result !== 'in-progress') return;
    if (Date.now() - new Date(attempt.startedAt).getTime() < challenge.timeLimitSeconds * 1000) return;
    timeoutSent.current = true;
    api.post(`/challenges/${challenge._id}/hazard-action`, { attemptId: attempt._id, action: 'timeout' }).catch(() => {}).finally(() => setExpired(true));
  }, [remaining, attempt, challenge]);
  const interact = async choice => {
    if (!hazard || busy || attempt.result !== 'in-progress' || !remaining) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/challenges/${challenge._id}/hazard-action`, { attemptId: attempt._id, hazardId: hazard.id, action: choice });
      setAttempt(data.attempt); setFeedback(data.feedback || (data.correct ? 'Hazard resolved.' : 'That action does not make the area safe.'));
      if (data.correct) { setHazard(null); setAction(''); }
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to record the action.');
      if (error.response?.data?.code === 'TIMEOUT') setExpired(true);
    } finally { setBusy(false); }
  };
  const complete = attempt.result === 'completed';
  const timedOut = expired || (!remaining && !complete);
  return <div className="relative min-h-[70vh] text-[#172033]">
    {(complete || timedOut) ? <section className="rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="text-3xl font-bold">{complete ? 'Warehouse secured!' : 'Time limit reached'}</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[['Final score', `${attempt.score} / ${challenge.maxScore}`], ['Time', clock(attempt.durationSeconds ?? challenge.timeLimitSeconds)], ['Hazards found', `${attempt.solvedHazards?.length || 0} / ${hazards.length}`], ['Incorrect actions', attempt.errors], ['Hints', attempt.hintsUsed], ['Accuracy', `${Math.round((attempt.accuracy || 0) * 100)}%`]].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><small className="block">{label}</small><b>{value}</b></div>)}
      </div><div className="mt-6 flex gap-3"><button className="rounded-lg bg-[#0b4f87] px-4 py-2 text-white" onClick={onRetry}>Try again</button><button className="rounded-lg border px-4 py-2" onClick={onBack}>Return to 360 training</button></div>
    </section> : <>
      <Trainee360Environment embedded puzzleHazards={hazards} solvedHazards={attempt.solvedHazards || []} onHazardSelect={h => { if (!attempt.solvedHazards?.includes(h.id)) { setHazard(h); setFeedback(''); setAction(''); } }} hud={<div>TIME LEFT {clock(remaining)}<br/>FOUND {attempt.solvedHazards?.length || 0} / {hazards.length} · REMAINING {hazards.length - (attempt.solvedHazards?.length || 0)}<br/>SCORE {attempt.score || 0}</div>} />
      {hazard && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={e => { if (e.target === e.currentTarget) setHazard(null); }}><section className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="flex justify-between"><small className="font-bold text-amber-700">HAZARD DETECTED · {hazard.hazardType}</small><button onClick={() => setHazard(null)} aria-label="Close">×</button></div><h2 className="mt-2 text-2xl font-bold">{hazard.label}</h2><p className="mt-3">{hazard.description}</p><p className="mt-4 font-semibold">What action will make this area safe?</p><div className="mt-2 space-y-2">{hazard.availableActions.map(item => <label key={item} className="block rounded-xl border p-3"><input type="radio" name="hazard-action" checked={action === item} onChange={() => setAction(item)} /> <span className="ml-2">{item}</span></label>)}</div>{feedback && <p role="status" className="mt-3 rounded-lg bg-blue-50 p-3">{feedback}</p>}<div className="mt-4 flex gap-2"><button disabled={!action || busy} onClick={() => interact(action)} className="rounded-lg bg-[#0b4f87] px-4 py-2 text-white disabled:opacity-50">Confirm action</button><button disabled={busy || attempt.hazardEvents?.some(e => e.hazardId === hazard.id && e.hint)} onClick={() => interact('hint')} className="rounded-lg border px-4 py-2 disabled:opacity-50">Hint</button></div></section></div>}
    </>}
  </div>;
}
