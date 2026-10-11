import { useCallback, useMemo, useState } from 'react';
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
  const [selectedLevel, setSelectedLevel] = useState('all');
  const load = useCallback(async () => {
    if (gameId) return;
    try {
      const { data } = await api.get('/safety-simulations', { params: { programmeId } });
      setGames(data.games || []);
      setError('');
    }
    catch (e) { setError(e.response?.data?.message || 'Unable to load available missions.'); }
    finally { setLoading(false); }
  }, [programmeId, gameId]);
  useInitialLoad(load);
  const back = () => navigate(`/my-training/${programmeId}/environment`);

  const stats = useMemo(() => {
    const available = games.filter(game => !game.locked).length;
    const locked = games.filter(game => game.locked).length;
    const attempted = games.filter(game => game.personalBest).length;
    return { total: games.length, available, locked, attempted };
  }, [games]);

  const moduleLabel = games[0]?.moduleKey?.replace(/-/g, ' ') || 'your training module';
  const counts = useMemo(() => Object.fromEntries(['all', 'beginner', 'intermediate', 'advanced'].map(level => [level, level === 'all' ? games.length : games.filter(game => game.difficulty === level).length])), [games]);
  const visibleGames = useMemo(() => games.filter(game => selectedLevel === 'all' || game.difficulty === selectedLevel).sort((a, b) => ['beginner', 'intermediate', 'advanced'].indexOf(a.difficulty) - ['beginner', 'intermediate', 'advanced'].indexOf(b.difficulty) || a.title.localeCompare(b.title)), [games, selectedLevel]);

  return <DashboardLayout role='trainee' title='Safety Simulation Missions'>
    {gameId ? <SafetySimulationGame key={gameId} gameId={gameId} onExit={() => navigate(`/my-training/${programmeId}/safety-simulations`)} /> : <div className='sim-management sim-management--missions'>
      <section className='sim-card sim-card--hero sim-mission-hero'>
        <div className='sim-mission-hero__copy'>
          <span className='sim-eyebrow'>Immersive 360° practice</span>
          <h2>Explore, inspect and respond inside the mission environment</h2>
          <p>Train your safety decisions in interactive 360° environments. Inspect hazards, choose safe actions, complete objectives and improve your personal best.</p>
        </div>
        <div className='sim-actions'>
          <button className='sim-button sim-button--light' onClick={back}>Back to training</button>
        </div>
      </section>

      <section className='sim-mission-stat-grid' aria-label='Mission overview'>
        <article className='sim-card sim-stat-card'><span className='sim-eyebrow'>Total missions</span><strong>{stats.total}</strong><p>All missions currently linked to this programme.</p></article>
        <article className='sim-card sim-stat-card'><span className='sim-eyebrow'>Ready to play</span><strong>{stats.available}</strong><p>Unlocked missions you can enter now.</p></article>
        <article className='sim-card sim-stat-card'><span className='sim-eyebrow'>Personal bests</span><strong>{stats.attempted}</strong><p>Missions where you already have a saved score.</p></article>
        <article className='sim-card sim-stat-card'><span className='sim-eyebrow'>Locked</span><strong>{stats.locked}</strong><p>Pass the required assessment to unlock these missions.</p></article>
      </section>

      <SafetySimulationHelp mode='play' />
      {error && <p className='sim-alert' role='alert'>{error}</p>}
      {loading && <section className='sim-card'><p role='status'>Loading missions…</p></section>}

      {!loading && !error && !!games.length && <section className='sim-card sim-mission-browser'>
        <div className='sim-section-heading'>
          <div>
            <span className='sim-eyebrow'>Mission library · {moduleLabel}</span>
            <h2>Select your difficulty level</h2>
            <p>Five structured training scenarios per level. Each mission offers inspectable hazards, safe and unsafe choices, a 360° environment and an individually recorded score.</p>
          </div>
        </div>
        <div className='sim-level-filter' role='group' aria-label='Filter safety missions by difficulty'>
          {['all', 'beginner', 'intermediate', 'advanced'].map(level => <button type='button' className={`sim-level-filter__button ${selectedLevel === level ? 'sim-level-filter__button--selected' : ''}`} aria-pressed={selectedLevel === level} onClick={() => setSelectedLevel(level)} key={level}>
            <span>{level === 'all' ? 'All levels' : level}</span><strong>{counts[level]}</strong>
          </button>)}
        </div>
        <p className='sim-result-count' role='status'>Showing {visibleGames.length} of {games.length} missions in {moduleLabel}.</p>
        <div className='sim-game-grid sim-game-grid--missions'>
          {visibleGames.map(game => {
            const stateLabel = game.locked ? 'Locked' : 'Ready';
            return <article className={`sim-game-card sim-mission-card ${game.locked ? 'sim-mission-card--locked' : ''}`} key={game._id}>
              <div className='sim-mission-cover-wrap'>
                <SimulationImage className='sim-mission-cover' src={missionCover(game)} fallback={missionCover({ moduleKey: game.moduleKey })} alt={`${game.moduleKey.replace(/-/g, ' ')} training environment`} loading='lazy' />
                <div className='sim-mission-cover__overlay'>
                  <span className='sim-status-chip'>{stateLabel}</span>
                  <span className='sim-status-chip sim-status-chip--glass'>360° interactive</span>
                </div>
              </div>
              <div className='sim-mission-card__body'>
                <span className={`sim-difficulty-chip sim-difficulty-chip--${game.difficulty}`}>{game.difficulty}</span>
                <h2>{game.title}</h2>
                <p>{game.mission}</p>
                <div className='sim-inline-metrics'>
                  <span><b>{game.timeLimitSeconds}s</b><small>Time limit</small></span>
                  <span><b>{game.maxScore}</b><small>Max points</small></span>
                </div>
                {game.personalBest
                  ? <div className='sim-personal-best'><strong>Best score {game.personalBest.score}</strong><small>Achieved {new Date(game.personalBest.achievedAt).toLocaleString()}</small></div>
                  : <div className='sim-personal-best sim-personal-best--empty'><strong>No attempt yet</strong><small>Open the briefing to begin your first run.</small></div>}
                {game.locked && <p className='sim-help'>Pass this level assessment first to unlock the mission.</p>}
              </div>
              <button className='sim-button' disabled={game.locked} onClick={() => navigate(`/my-training/${programmeId}/safety-simulations/${game._id}`)}>
                {game.locked ? 'Locked for now' : 'Open briefing'}
              </button>
            </article>;
          })}
        </div>
        {!visibleGames.length && <p className='sim-no-level-missions'>No {selectedLevel} missions are active for this training programme yet. Ask your trainer to check the mission library and level assignments.</p>}
      </section>}

      {!loading && !error && !games.length && <section className='sim-card'><p>No active safety missions are available for this programme yet.</p></section>}
    </div>}
  </DashboardLayout>;
}
