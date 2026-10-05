import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Field } from '../../components/simulation/SafetySimulationForm';
import useInitialLoad from '../../hooks/useInitialLoad';
import api from '../../services/api';
import { getSessionUser, normalizeRole } from '../../utils/session';
import '../../components/simulation/SafetySimulation.css';
const date = value => value ? new Date(value).toLocaleString() : '—';
export default function SafetySimulationResultsPage() {
  const role = normalizeRole(getSessionUser()?.role);
  const [data, setData] = useState(null), [gameId, setGameId] = useState(''), [error, setError] = useState(''), [selected, setSelected] = useState(null);
  const load = useCallback(async () => {
    try { const response = await api.get('/safety-simulations/results', { params: gameId ? { gameId } : {} }); setData(response.data); setError(''); }
    catch (e) { setError(e.response?.data?.message || 'Unable to load mission records.'); }
  }, [gameId]);
  useInitialLoad(load);
  const games = [...new Map((data?.attempts || []).filter(row => row.challenge).map(row => [row.challenge._id, { id: row.challenge._id, name: row.challenge.title }])).values()];
  return <DashboardLayout role={role} title='Safety Mission Results' subtitle='Review performance and the saved activity history.'><div className='sim-management'>
    <div className='sim-section-heading'><h2>Mission performance</h2><Link className='sim-button sim-button--light' to='/safety-simulations'>Manage games</Link></div>
    {error && <p className='sim-alert' role='alert'>{error}</p>}
    {data && <><section className='sim-card'><div className='sim-metrics'>{[['attempts', 'Attempts'], ['completionRate', 'Completion rate %'], ['averageScore', 'Average score'], ['bestScore', 'Best score'], ['averageCompletionSeconds', 'Average success time (s)'], ['failureRate', 'Failure rate %']].map(([key, label]) => <span key={key}>{label}<strong>{data.summary[key]}</strong></span>)}</div><div className='sim-filters'><Field label='Mission' value={gameId} options={games} onChange={setGameId} /><button className='sim-button sim-button--light' onClick={load}>Refresh</button></div><p className='sim-help'>Most recent {data.summary.recordLimit} attempts. Dates display in your local timezone.</p></section>
    <section className='sim-card'><h3>Attempt history</h3><div className='sim-table-scroll'><table className='sim-table'><thead><tr><th>Trainee</th><th>Mission / model</th><th>Started</th><th>Finished</th><th>Duration</th><th>Result</th><th>Score</th><th>Details</th></tr></thead><tbody>{data.attempts.map(row => <tr key={row._id}><td>{row.trainee?.firstName} {row.trainee?.lastName}</td><td>{row.challenge?.title}<small>{row.programme?.programmeType} · {row.challenge?.difficulty}</small></td><td>{date(row.startedAt)}</td><td>{date(row.finishedAt)}</td><td>{row.durationSeconds == null ? '—' : `${row.durationSeconds}s`}</td><td>{row.result}</td><td>{row.score}</td><td><button className='sim-button sim-button--light' onClick={() => setSelected(row)}>View</button></td></tr>)}</tbody></table></div>{!data.attempts.length && <p>No mission attempts yet.</p>}</section>
    {selected && <section className='sim-card'><div className='sim-section-heading'><h3>{selected.challenge?.title} · attempt {selected.attemptNumber}</h3><button className='sim-button sim-button--light' onClick={() => setSelected(null)}>Close details</button></div><p>Created: {date(selected.challenge?.createdAt)} · Updated: {date(selected.challenge?.updatedAt)} · Activated: {date(selected.challenge?.activatedAt)}</p><p>{selected.feedback}</p><h4>Interactions</h4><ol className='sim-event-list'>{(selected.simulationState?.actions || []).map((action, index) => <li key={index}><b>{action.actionId === '__move__' ? `Move to ${action.locationId}` : (action.label || action.actionId)}</b> · {date(action.at)} · {action.delta >= 0 ? '+' : ''}{action.delta} points{action.feedback && <p>{action.feedback}</p>}</li>)}</ol><h4>Objective timestamps</h4><ul>{(selected.simulationState?.objectiveEvents || []).map(row => <li key={row.id}>{row.label || row.id} · started {date(row.startedAt)} · completed {date(row.completedAt)}</li>)}</ul><h4>Hazard events</h4><ul>{(selected.simulationState?.hazards || []).map(row => <li key={row.id}>{row.name || row.id} · triggered {date(row.triggeredAt)} · resolved {date(row.resolvedAt)}</li>)}</ul></section>}
    <section className='sim-card'><h3>Personal bests</h3><ul>{data.personalBests.map(row => <li key={row._id}>{row.trainee?.firstName} {row.trainee?.lastName} · {games.find(game => game.id === String(row.challenge))?.name || 'Mission'} · {row.score} points · {row.durationSeconds}s · achieved {date(row.achievedAt)}</li>)}</ul></section>
    <section className='sim-card'><h3>Common unsafe actions</h3><ul>{Object.entries(data.summary.commonMistakes).map(([id, count]) => <li key={id}>{id}: {count}</li>)}</ul>{!Object.keys(data.summary.commonMistakes).length && <p>No unsafe actions recorded.</p>}</section></>}
  </div></DashboardLayout>;
}
