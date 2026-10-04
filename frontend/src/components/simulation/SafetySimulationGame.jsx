import { useCallback, useEffect, useRef, useState } from 'react';
import api, { API_BASE_URL } from '../../services/api';
import PanoramaCanvas from '../trainee/PanoramaCanvas';
import useInitialLoad from '../../hooks/useInitialLoad';
import SimulationImage from './SimulationImage';
import { missionCover, objectVisual } from './simulationVisuals';
import { applyInteraction, createMissionState, finishMission, moveMission, publicMission, validateSimulation } from '../../../../shared/simulationEngine.mjs';
import './SafetySimulation.css';
const duration = value => { const n = Math.max(0, Math.floor(value || 0)); return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`; };
const date = value => value ? new Date(value).toLocaleString() : '—';
const source = value => value?.startsWith('/uploads/') ? `${API_BASE_URL.replace(/\/api\/?$/, '')}${value}` : value;
const wrap = angle => ((angle + 180) % 360 + 360) % 360 - 180;
const rulesFor = game => ({ timeLimitSeconds: game.timeLimitSeconds, incorrectPenalty: game.incorrectPenalty, completionBonus: game.completionBonus, maxTimeBonus: game.maxTimeBonus, maxScore: game.maxScore });

export default function SafetySimulationGame({ gameId, previewGame = null, onExit }) {
  const [game, setGame] = useState(() => previewGame ? publicMission(previewGame) : null);
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(0);
  const [clock, setClock] = useState(null);
  const [objectId, setObjectId] = useState('');
  const [paused, setPaused] = useState(false);
  const [view, setView] = useState({ yaw: 0, pitch: 0, fov: 78 });
  const [size, setSize] = useState({ width: 1000, height: 580 });
  const [scores, setScores] = useState(null);
  const [bestUpdated, setBestUpdated] = useState(false);
  const imageDialogRef = useRef(null);
  const stageRef = useRef(null), lastControlRef = useRef(null), gameRef = useRef(null);
  const previewRef = useRef(previewGame);
  const state = attempt?.simulationState;
  const running = attempt?.result === 'in-progress';
  const elapsed = clock ? clock.elapsed + (tick - clock.receivedAt) / 1000 : 0;
  const remaining = Math.max(0, (game?.timeLimitSeconds || 0) - Math.floor(elapsed));
  const locations = game?.environment?.locations || [];
  const room = locations.find(row => row.id === (state?.locationId || game?.environment?.startingLocationId));
  const objects = (game?.objects || []).filter(row => row.locationId === room?.id);
  const selected = objects.find(row => row.id === objectId);
  const selectedId = selected?.id;
  const selectedVisual = selected ? objectVisual(game.moduleKey, selected, state?.completedActions) : null;
  const selectedActions = selected ? game.actions.filter(action => action.objectId === selected.id) : [];
  const completedCount = object => game.actions.filter(action => action.objectId === object.id && state?.completedActions.includes(action.id)).length;
  const hasAttempt = !!attempt;
  const accept = useCallback(data => {
    setAttempt(data.attempt); setGame(data.game); setBestUpdated(data.personalBestUpdated || false);
    const now = Date.now();
    setClock({ elapsed: Math.max(0, (new Date(data.serverNow) - new Date(data.attempt.startedAt)) / 1000), receivedAt: now });
    setTick(now);
  }, []);
  const load = useCallback(async () => {
    if (previewGame) return;
    try { const { data } = await api.get(`/safety-simulations/${gameId}`); setGame(data.game); }
    catch (e) { setError(e.response?.data?.message || 'Unable to load this mission.'); }
  }, [gameId, previewGame]);
  useInitialLoad(load);
  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (!running || remaining > 0 || busy) return undefined;
    let live = true;
    const timer = window.setTimeout(async () => {
      try {
        if (previewRef.current) {
          const at = new Date().toISOString();
          const next = finishMission(previewRef.current.simulation, state, rulesFor(previewRef.current), at, elapsed, 'timeout');
          if (live) accept({ attempt: { ...attempt, result: next.result, simulationState: next, finishedAt: at, durationSeconds: Math.floor(elapsed), score: next.score }, game: publicMission(previewRef.current, next), serverNow: at });
        } else { const { data } = await api.get(`/safety-simulations/${gameId}/attempts/${attempt._id}`); if (live) accept(data); }
      } catch (e) { if (live) setError(e.response?.data?.message || 'Unable to refresh mission time.'); }
    }, 300);
    return () => { live = false; window.clearTimeout(timer); };
  }, [remaining, running, busy, accept, gameId, state, elapsed, attempt]);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(stage); return () => observer.disconnect();
  }, [hasAttempt]);
  useEffect(() => {
    if (!selectedId) return undefined;
    const previous = document.activeElement;
    lastControlRef.current?.focus();
    return () => { if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, [selectedId]);

  const start = async (restart = false) => {
    setBusy(true); setError(''); setObjectId(''); setScores(null); setPaused(false); setView({ yaw: 0, pitch: 0, fov: 78 });
    try {
      if (previewGame) {
        const draft = { ...previewGame, simulation: validateSimulation(previewGame.simulation) }; previewRef.current = draft;
        const at = new Date().toISOString(); const initial = createMissionState(draft.simulation, at);
        accept({ game: publicMission(draft, initial), attempt: { _id: 'preview', result: 'in-progress', startedAt: at, simulationState: initial, score: 0 }, serverNow: at });
      } else { const { data } = await api.post(`/safety-simulations/${gameId}/attempts/start`, { restart }); accept(data); }
    } catch (e) { setError(e.response?.data?.message || e.message || 'Unable to start mission.'); }
    finally { setBusy(false); }
  };
  const interact = async (body, complete = false) => {
    if (busy || !running) return;
    setBusy(true); setError('');
    try {
      if (previewGame) {
        const draft = previewRef.current, at = new Date().toISOString();
        const next = complete ? finishMission(draft.simulation, state, rulesFor(draft), at, Math.floor(elapsed)) : body.kind === 'move' ? moveMission(draft.simulation, state, body.locationId, at) : applyInteraction(draft.simulation, state, body.actionId, rulesFor(draft), at);
        accept({ game: publicMission(draft, next), attempt: { ...attempt, simulationState: next, result: next.result, score: next.score, ...(next.finishedAt ? { finishedAt: next.finishedAt, durationSeconds: Math.floor(elapsed) } : {}) }, serverNow: at });
      } else {
        const { data } = await api.post(`/safety-simulations/${gameId}/attempts/${attempt._id}/${complete ? 'complete' : 'action'}`, body); accept(data);
      }
      if (body.kind === 'move') { setObjectId(''); setView({ yaw: 0, pitch: 0, fov: 78 }); }
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Unable to perform that interaction.');
      if (e.response?.data?.code === 'ATTEMPT_CHANGED') { const { data } = await api.get(`/safety-simulations/${gameId}/attempts/${attempt._id}`); accept(data); }
    } finally { setBusy(false); }
  };
  const openObject = object => { setObjectId(object.id); setView(current => ({ ...current, yaw: object.yaw, pitch: object.pitch })); };
  const leaderboard = async () => {
    setBusy(true); setError('');
    try { const { data } = await api.get(`/safety-simulations/${gameId}/leaderboard`); setScores(data.entries); }
    catch (e) { setError(e.response?.data?.message || 'Unable to load scores.'); }
    finally { setBusy(false); }
  };
  if (!game) return <section className='sim-card'><p role={error ? 'alert' : 'status'}>{error || 'Loading mission…'}</p><button className='sim-button' onClick={onExit}>Back</button></section>;
  return <section className='sim-game' ref={gameRef} aria-label={game.title}>
    {previewGame && <div className='sim-preview-banner' role='status'>Preview Mode · Attempts, scores and statistics are not saved.</div>}
    <header className='sim-header'><div><span className='sim-eyebrow'>{game.moduleKey?.replace(/-/g, ' ')} · {game.difficulty}</span><h1>{game.title}</h1></div><div className='sim-actions'><button className='sim-button sim-button--light' onClick={() => { if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); else gameRef.current?.requestFullscreen?.().catch(() => {}); }}>Full screen</button><button className='sim-button sim-button--light' onClick={onExit}>Exit mission</button></div></header>
    {error && <p className='sim-alert' role='alert'>{error}</p>}
    {!attempt ? <div className='sim-briefing sim-card'>
      <SimulationImage className='sim-briefing-image' src={missionCover(game)} fallback={missionCover({ moduleKey: game.moduleKey })} alt={`${game.title} training area`} />
      <div><span className='sim-eyebrow'>Mission briefing</span><h2>{game.mission}</h2><p>{game.description}</p><p>{game.instructions}</p><div className='sim-metrics'><span>Time limit <strong>{duration(game.timeLimitSeconds)}</strong></span><span>Maximum score <strong>{game.maxScore}</strong></span></div>
      <ul className='sim-objectives'>{game.objectives.map(row => <li key={row.id}>{row.label}{!row.required && <small> · Optional</small>}</li>)}</ul>
      {game.locked && <p className='sim-alert'>Pass this level assessment to unlock the mission.</p>}
      <button className='sim-button' disabled={busy || game.locked} onClick={() => start()}>{busy ? 'Starting…' : 'Start mission'}</button></div>
    </div> : <>
      <div className='sim-hud'><span aria-live='off'>Time remaining <strong>{duration(remaining)}</strong></span><span>Score <strong>{attempt.score} / {game.maxScore}</strong></span><span>Objectives <strong>{state.completedObjectives.length} / {game.objectives.length}</strong></span><span>Mistakes <strong>{state.mistakes}</strong></span><div className='sim-controls'>{running && <button className='sim-button sim-button--light' onClick={() => { setObjectId(''); setPaused(v => !v); }}>{paused ? 'Resume view' : 'Pause view'}</button>}<button className='sim-button sim-button--light' disabled={busy} onClick={() => start(true)}>Restart</button></div></div>
      {running ? <div className='sim-play-layout'>
        <div className='sim-environment-column'>
          <div className='sim-stage' ref={stageRef} aria-label={`Environment: ${room?.name}`}>
            <PanoramaCanvas src={source(room?.panorama || '/panoramas/logistics-indoor.png')} yaw={view.yaw} pitch={view.pitch} fov={view.fov} onViewChange={(yaw, pitch, fov) => setView({ yaw, pitch, fov })} />
            <div className='sim-location-name'><strong>{room?.name}</strong><span>{room?.description || 'Explore and interact with the objects in this area.'}</span></div>
            {!paused && objects.map(object => {
              const dx = wrap(object.yaw - view.yaw), dy = object.pitch - view.pitch;
              const vfov = Math.max(35, view.fov * size.height / Math.max(1, size.width));
              if (Math.abs(dx) > view.fov * .42 || Math.abs(dy) > vfov * .4) return null;
              const done = game.actions.filter(action => action.objectId === object.id).some(action => state.completedActions.includes(action.id));
              return <button key={object.id} type='button' className={`sim-object-pin ${done ? 'sim-object-pin--used' : ''}`} style={{ left: `${50 + dx / view.fov * 100}%`, top: `${50 - dy / vfov * 100}%` }} onClick={() => openObject(object)} aria-label={`Interact with ${object.name}`}><b aria-hidden='true'>{done ? '✓' : '◎'}</b><span>{object.name}</span></button>;
            })}
            {paused && <div className='sim-pause'><h2>View paused</h2><p>The mission timer continues.</p><button className='sim-button' onClick={() => setPaused(false)}>Resume</button></div>}
            <div className='sim-look-controls'><button type='button' aria-label='Look left' onClick={() => setView(v => ({ ...v, yaw: wrap(v.yaw - 25) }))}>←</button><button type='button' aria-label='Look right' onClick={() => setView(v => ({ ...v, yaw: wrap(v.yaw + 25) }))}>→</button><button type='button' aria-label='Zoom in' onClick={() => setView(v => ({ ...v, fov: Math.max(45, v.fov - 10) }))}>+</button><button type='button' aria-label='Zoom out' onClick={() => setView(v => ({ ...v, fov: Math.min(105, v.fov + 10) }))}>−</button></div>
          </div>
          <nav className='sim-room-nav' aria-label='Move between mission areas'>{room?.connections?.map(connection => <button key={connection.targetLocationId} type='button' className='sim-button sim-button--light' disabled={busy || paused || !connection.allowed} title={!connection.allowed ? 'Complete required preparation first' : ''} onClick={() => interact({ kind: 'move', locationId: connection.targetLocationId })}>{connection.allowed ? '→' : '🔒'} {connection.label || locations.find(row => row.id === connection.targetLocationId)?.name}</button>)}</nav>
          <div className='sim-object-picker'><div className='sim-section-heading'><div><span className='sim-eyebrow'>Explore this area</span><p>Select an image to inspect the object and choose an action.</p></div></div>
            <div className='sim-object-shelf' aria-label='Objects in this area'>{objects.map(object => {
              const visual = objectVisual(game.moduleKey, object, state.completedActions), count = completedCount(object);
              return <button key={object.id} type='button' aria-label={object.name} aria-pressed={objectId === object.id} className={`sim-object-card ${objectId === object.id ? 'sim-object-card--selected' : ''}`} disabled={paused} onClick={() => openObject(object)}>
                <SimulationImage src={visual.src} fallback={visual.fallback} alt='' loading='lazy' />
                <span className='sim-object-card-name'>{object.name}</span><span className={`sim-object-card-status ${count ? 'sim-object-card-status--used' : ''}`}>{count ? `✓ ${count} action${count === 1 ? '' : 's'} completed` : 'Inspect object'}</span>
              </button>;
            })}</div>
          </div>
          {selected && !paused && <section className={`sim-interaction sim-card ${['workstation', 'email', 'file', 'device'].includes(selected.type) ? 'sim-interaction--digital' : ''}`} aria-labelledby='sim-object-heading' onKeyDown={event => { if (event.key === 'Escape') setObjectId(''); }}>
            <div className='sim-interaction-heading'><div><span className='sim-eyebrow'>{selected.type}</span><h2 id='sim-object-heading'>{selected.name}</h2></div><button ref={lastControlRef} type='button' className='sim-button sim-button--light' aria-label='Close object controls' onClick={() => setObjectId('')}>×</button></div>
            <div className='sim-object-detail'>
              <figure className='sim-object-figure'><button type='button' className='sim-image-inspect' aria-label={`Enlarge image of ${selected.name}`} onClick={() => imageDialogRef.current?.showModal()}><SimulationImage className='sim-object-image' src={selectedVisual.src} fallback={selectedVisual.fallback} alt={selectedVisual.alt} /><span>Enlarge image ↗</span></button><figcaption>{selected.imageUrl ? 'Object reference image' : 'Training illustration'} · {selected.name}</figcaption></figure>
              <div className='sim-object-content'><p>{selected.description}</p>
                {['workstation', 'email', 'file', 'device'].includes(selected.type) && <span className='sim-digital-label'>Simulated device · all interactions stay inside the mission</span>}
                <span className='sim-eyebrow'>Choose your action</span><div className='sim-action-list'>{selectedActions.map(action => <div className='sim-action-option' key={action.id}><button type='button' className='sim-button' disabled={busy || !action.allowed} title={action.reason || ''} onClick={() => interact({ actionId: action.id })}>{state.completedActions.includes(action.id) ? '✓ ' : ''}{action.label}</button>{!action.allowed && !state.completedActions.includes(action.id) && action.reason && <small>{action.reason}</small>}</div>)}</div>
              </div>
            </div>
            <dialog key={selected.id} ref={imageDialogRef} className='sim-image-dialog' aria-label={`${selected.name} image viewer`} onKeyDown={event => { if (event.key === 'Escape') event.stopPropagation(); }}><div className='sim-interaction-heading'><h2>{selected.name}</h2><button type='button' className='sim-button sim-button--light' autoFocus onClick={() => imageDialogRef.current?.close()} aria-label='Close enlarged image'>×</button></div><SimulationImage src={selectedVisual.src} fallback={selectedVisual.fallback} alt={selectedVisual.alt} /><p className='sim-help'>Press Escape or close the viewer to return to the mission. The timer continues.</p></dialog>
          </section>}
          <div className='sim-feedback' role='status' aria-live='polite'>{state.feedback || 'Choose an object in the environment to begin.'}</div>
        </div>
        <aside className='sim-objective-panel sim-card'><span className='sim-eyebrow'>Mission objective</span><h2>{game.mission}</h2><ol className='sim-objectives'>{game.objectives.map(objective => <li key={objective.id} className={state.completedObjectives.includes(objective.id) ? 'sim-objective--done' : ''}><span aria-hidden='true'>{state.completedObjectives.includes(objective.id) ? '✓' : '○'}</span> {objective.label}{!objective.required && <small> · Optional</small>}</li>)}</ol>
          {state.flags.length > 0 && <p className='sim-state-note'>Current state: {state.flags.map(flag => flag.replace(/[-_]/g, ' ')).join(' · ')}</p>}
          <button className='sim-button' disabled={busy || paused} onClick={() => interact({}, true)}>Complete mission</button><p className='sim-help'>Use object buttons or the area list. Drag the view or use arrow keys to look around.</p>
        </aside>
      </div> : <section className='sim-result sim-card' aria-live='polite'><span className='sim-eyebrow'>Mission result</span><h2>{attempt.result === 'completed' ? 'Mission successful' : attempt.result === 'timeout' ? 'Time limit reached' : 'Mission ended'}</h2><p>{state.feedback}</p><div className='sim-metrics'><span>Score <strong>{attempt.score}</strong></span><span>Duration <strong>{duration(attempt.durationSeconds)}</strong></span><span>Completed objectives <strong>{state.completedObjectives.length}</strong></span><span>Mistakes <strong>{state.mistakes}</strong></span></div><p>Started: {date(attempt.startedAt)}<br />Finished: {date(attempt.finishedAt)}</p>{bestUpdated && <p className='sim-state-note'>Your personal best improved.</p>}<div className='sim-actions'><button className='sim-button' disabled={busy} onClick={() => start(true)}>Play again</button>{!previewGame && <button className='sim-button sim-button--light' disabled={busy} onClick={leaderboard}>View mission scores</button>}</div>
      </section>}
      {scores && <section className='sim-card'><h2>Mission scores</h2><p>Rank and score are shared with trainees.</p>{scores.length ? <table className='sim-table'><thead><tr><th>Rank</th><th>Score</th></tr></thead><tbody>{scores.map((row, index) => <tr key={index}><td>{row.rank}</td><td>{row.score}</td></tr>)}</tbody></table> : <p>No successful scores yet.</p>}</section>}
    </>}
  </section>;
}
