import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import SafetySimulationGame from '../../components/simulation/SafetySimulationGame';
import SafetySimulationHelp from '../../components/simulation/SafetySimulationHelp';
import SimulationImage from '../../components/simulation/SimulationImage';
import { missionCover } from '../../components/simulation/simulationVisuals';
import useInitialLoad from '../../hooks/useInitialLoad';
import api from '../../services/api';
import '../../components/simulation/SafetySimulation.css';
export default function TraineeSafetySimulationPage() {
  const { programmeId, gameId } = useParams(), navigate = useNavigate();
  const [games, setGames] = useState([]), [error, setError] = useState(''), [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    if (gameId) return;
    try { const { data } = await api.get('/safety-simulations', { params: { programmeId } }); setGames(data.games || []); }
    catch (e) { setError(e.response?.data?.message || 'Unable to load available missions.'); }
    finally { setLoading(false); }
  }, [programmeId, gameId]);
  useInitialLoad(load);
  const back = () => navigate(`/my-training/${programmeId}/environment`);
  return <DashboardLayout role='trainee' title='Safety Simulation Missions'>
    {gameId ? <SafetySimulationGame key={gameId} gameId={gameId} onExit={() => navigate(`/my-training/${programmeId}/safety-simulations`)} /> : <div className='sim-management'>
      <div className='sim-section-heading'><h2>Available missions</h2><button className='sim-button sim-button--light' onClick={back}>Back to training</button></div>
      <SafetySimulationHelp mode='play' />
      {error && <p className='sim-alert' role='alert'>{error}</p>}{loading && <p role='status'>Loading missions…</p>}
      <div className='sim-game-grid'>{games.map(game => <article className='sim-game-card sim-mission-card' key={game._id}><SimulationImage className='sim-mission-cover' src={missionCover(game)} fallback={missionCover({ moduleKey: game.moduleKey })} alt={`${game.moduleKey.replace(/-/g, ' ')} training environment`} loading='lazy' /><span className='sim-eyebrow'>{game.moduleKey.replace(/-/g, ' ')} · {game.difficulty}</span><h2>{game.title}</h2><p>{game.mission}</p><p>{game.timeLimitSeconds}s · Maximum {game.maxScore} points</p>{game.personalBest && <p>Personal best: <strong>{game.personalBest.score}</strong> · {new Date(game.personalBest.achievedAt).toLocaleString()}</p>}{game.locked && <p>Pass this level assessment first.</p>}<button className='sim-button' disabled={game.locked} onClick={() => navigate(`/my-training/${programmeId}/safety-simulations/${game._id}`)}>Open briefing</button></article>)}</div>
      {!loading && !error && !games.length && <section className='sim-card'><p>No active safety missions are available for this programme yet.</p></section>}
    </div>}
  </DashboardLayout>;
}
