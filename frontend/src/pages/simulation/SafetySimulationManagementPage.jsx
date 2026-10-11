import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import SafetySimulationForm, { Field } from '../../components/simulation/SafetySimulationForm';
import SafetySimulationGame from '../../components/simulation/SafetySimulationGame';
import SafetySimulationHelp from '../../components/simulation/SafetySimulationHelp';
import useInitialLoad from '../../hooks/useInitialLoad';
import api from '../../services/api';
import { getSessionUser, normalizeRole } from '../../utils/session';
import { simulationDraftForProgramme, simulationProgrammeLevel } from '../../../../shared/simulationTemplates.mjs';
import { validateSimulation } from '../../../../shared/simulationEngine.mjs';
import '../../components/simulation/SafetySimulation.css';
const date = value => value ? new Date(value).toLocaleString() : '—';
export default function SafetySimulationManagementPage() {
  const role = normalizeRole(getSessionUser()?.role);
  const [options, setOptions] = useState({ programmes: [], modules: [], locations: [], samples: [] });
  const [games, setGames] = useState([]);
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(null);
  const [model, setModel] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try { const [a, b] = await Promise.all([api.get('/safety-simulations/options'), api.get('/safety-simulations')]); setOptions(a.data); setGames(b.data.games || []); }
    catch (e) { setError(e.response?.data?.message || 'Unable to load safety simulations.'); }
    finally { setLoading(false); }
  }, []);
  useInitialLoad(load);
  const draftFor = (key, programmeId) => simulationDraftForProgramme(options.programmes.find(p => String(p._id) === String(programmeId)) || { _id: programmeId, programmeType: key });
  const create = () => {
    const programme = options.programmes.filter(p => p.status === 'active' && !p.deletedAt && (!model || p.programmeType === model) && options.modules.some(m => m.key === p.programmeType && m.status === 'active'))
      .sort((a, b) => Number(simulationProgrammeLevel(b.level) === 'beginner') - Number(simulationProgrammeLevel(a.level) === 'beginner') || new Date(a.createdAt) - new Date(b.createdAt))[0];
    if (!programme) { setError('Create or obtain access to an active programme for the selected module first.'); return; }
    setForm(draftFor(programme.programmeType, programme._id)); setError(''); setMessage('');
  };
  const sampleProgramme = sample => options.programmes.filter(p => p.programmeType === sample.moduleKey && p.status === 'active')
    .sort((a, b) => Number(simulationProgrammeLevel(b.level) === sample.difficulty) - Number(simulationProgrammeLevel(a.level) === sample.difficulty) || new Date(a.createdAt) - new Date(b.createdAt))[0];
  const chooseSample = sample => {
    const programme = sampleProgramme(sample);
    if (!programme) { setError('Create an active training programme for this model first.'); return; }
    setForm({ ...structuredClone(sample), programmeId: programme._id, difficulty: simulationProgrammeLevel(programme.level) }); setError(''); setMessage('');
  };
  const addSamples = async () => {
    setSaving(true); setError(''); setMessage('');
    try {
      const { data } = await api.post('/safety-simulations/samples', { includeLibrary: true, publishLibrary: role === 'admin' });
      await load();
      const skipped = data.skipped.length ? ` ${data.skipped.length} skipped: create active programmes for the missing module and difficulty levels first.` : '';
      setMessage(`${data.created.length} missions added (library missions ready to play, classic samples saved as drafts); ${data.existing.length} already present. Review and activate the drafts before trainees play.${skipped}`);
    } catch (e) { setError(e.response?.data?.message || 'Unable to add sample missions.'); }
    finally { setSaving(false); }
  };
  const edit = game => { setForm({ ...structuredClone(game), programmeId: String(game.programme) }); setError(''); setMessage(''); };
  const save = async nextStatus => {
    setSaving(true); setError(''); setMessage('');
    try {
      const body = { ...form, status: nextStatus, simulation: validateSimulation(form.simulation) };
      const { data } = form._id ? await api.put(`/safety-simulations/${form._id}`, body) : await api.post('/safety-simulations', body);
      setForm({ ...data.game, programmeId: String(data.game.programme) }); await load();
      setMessage(nextStatus === 'active' ? 'Mission activated.' : 'Draft saved.');
    } catch (e) { setError(e.response?.data?.message || e.message); }
    finally { setSaving(false); }
  };
  const showPreview = async game => {
    setSaving(true); setError('');
    try { const body = game || form; const { data } = await api.post('/safety-simulations/preview', { ...body, programmeId: body.programmeId || String(body.programme), simulation: validateSimulation(body.simulation) }); setPreview(data.game); }
    catch (e) { setError(e.response?.data?.message || e.message); }
    finally { setSaving(false); }
  };
  const manage = async (game, operation) => {
    setSaving(true); setError(''); setMessage('');
    try {
      if (operation === 'duplicate') await api.post(`/safety-simulations/${game._id}/duplicate`, {});
      else if (operation === 'archive') await api.delete(`/safety-simulations/${game._id}`);
      else await api.patch(`/safety-simulations/${game._id}/status`, { status: operation });
      await load(); setMessage(operation === 'duplicate' ? 'Mission duplicated as a draft.' : operation === 'archive' ? 'Mission archived. Attempt history is preserved.' : 'Mission status updated.');
    } catch (e) { setError(e.response?.data?.message || 'Unable to update mission.'); }
    finally { setSaving(false); }
  };
  const filtered = games.filter(game => (!model || game.moduleKey === model) && (!status || game.status === status));
  return <DashboardLayout role={role} title='Safety Simulations' subtitle={role === 'admin' ? 'Create, preview and manage training missions.' : 'Manage missions for your assigned training programmes.'}>
    <div className='sim-management'>
      {preview ? <SafetySimulationGame key='draft-preview' previewGame={preview} onExit={() => setPreview(null)} /> : <>
        <div className='sim-section-heading'><div><h2>Safety Simulation Missions</h2><p>Configure environments, objects and task actions.</p></div><div className='sim-actions'><Link className='sim-button sim-button--light' to='/safety-simulations/results'>Mission results</Link><button type='button' className='sim-button sim-button--light' disabled={loading || saving} onClick={addSamples}>Sync mission library</button><button type='button' className='sim-button' disabled={loading || saving} onClick={create}>Create game</button></div></div>
        {error && <p className='sim-alert' role='alert'>{error}</p>}{message && <p className='sim-feedback' role='status'>{message}</p>}
        {loading && <p role='status'>Loading missions…</p>}
        <SafetySimulationHelp />
        {form && <SafetySimulationForm form={form} setForm={setForm} programmes={options.programmes} modules={options.modules} warehouseLocations={options.locations} onSave={save} onPreview={() => showPreview()} onClose={() => setForm(null)} saving={saving} onTemplate={() => setForm(current => ({ ...draftFor(current.moduleKey, current.programmeId), ...(current._id ? { _id: current._id, createdAt: current.createdAt, updatedAt: current.updatedAt } : {}) }))} />}
        <section className='sim-card'><div className='sim-filters'><Field label='Training model' value={model} options={options.modules.map(m => ({ id: m.key, name: m.name }))} onChange={setModel} /><Field label='Status' value={status} options={['draft', 'active', 'inactive'].map(id => ({ id }))} onChange={setStatus} /></div>
        <div className='sim-game-grid'>{filtered.map(game => <article className='sim-game-card' key={game._id}><div className='sim-section-heading'><span className='sim-eyebrow'>{game.moduleKey.replace(/-/g, ' ')}</span><span className={`sim-status sim-status--${game.status}`}>{game.status}</span></div><h3>{game.title}</h3><p>{game.description}</p><small>{game.difficulty} · {game.timeLimitSeconds}s · max {game.maxScore} points</small><dl className='sim-dates'><dt>Created</dt><dd>{date(game.createdAt)}</dd><dt>Updated</dt><dd>{date(game.updatedAt)}</dd><dt>Activated</dt><dd>{date(game.activatedAt)}</dd>{game.deactivatedAt && <><dt>Deactivated</dt><dd>{date(game.deactivatedAt)}</dd></>}</dl>
          <div className='sim-actions'><button className='sim-button sim-button--light' disabled={saving} onClick={() => edit(game)}>View / edit</button><button className='sim-button sim-button--light' disabled={saving} onClick={() => showPreview(game)}>Preview</button><button className='sim-button sim-button--light' disabled={saving} onClick={() => manage(game, 'duplicate')}>Duplicate</button><button className='sim-button' disabled={saving} onClick={() => manage(game, game.status === 'active' ? 'inactive' : 'active')}>{game.status === 'active' ? 'Deactivate' : 'Activate'}</button>{role === 'admin' && <button className='sim-button sim-button--danger' disabled={saving} onClick={() => manage(game, 'archive')}>Archive</button>}</div>
        </article>)}</div>{!loading && !filtered.length && <p>No missions match this selection. Choose Sync mission library or Create game to begin.</p>}</section>
        {!loading && !!options.samples?.length && <section className='sim-card sim-sample-library'><h2>Sample mission library</h2><p>Choose a prepared game to edit, or add all available samples as drafts using Add sample missions.</p><div className='sim-game-grid'>{options.samples.map(sample => {
          const available = options.modules.some(m => m.key === sample.moduleKey && m.status === 'active') && sampleProgramme(sample);
          return <article className='sim-game-card' key={sample.key}><span className='sim-eyebrow'>{sample.moduleKey.replace(/-/g, ' ')}</span><h3>{sample.title}</h3><p>{sample.description}</p><small>{sample.simulation.objectives.length} objectives · {sample.timeLimitSeconds}s</small>{!available && <p>Create an active module and programme for this model first.</p>}<button type='button' className='sim-button sim-button--light' disabled={saving || !available} onClick={() => chooseSample(sample)}>Use sample</button></article>;
        })}</div></section>}
      </>}
    </div>
  </DashboardLayout>;
}
