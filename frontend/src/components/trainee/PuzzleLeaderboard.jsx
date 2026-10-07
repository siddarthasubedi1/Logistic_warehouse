import { useEffect, useState } from 'react';
import api, { API_BASE_URL } from '../../services/api';

const count = value => Number(value || 0).toLocaleString();
function ProfileImage({ image, name }) {
  const [failedImage, setFailedImage] = useState('');
  const base = API_BASE_URL.replace(/\/api\/?$/, '');
  const source = image?.startsWith('/uploads/profiles/') ? `${base}${image}` : /^https?:\/\//i.test(image || '') ? image : '';
  return source && failedImage !== source
    ? <img className="scoreboard-avatar" src={source} alt={`${name}'s profile`} loading="lazy" onError={() => setFailedImage(source)} />
    : <span className="scoreboard-avatar scoreboard-avatar--initials" aria-label={`${name}'s profile`}>{name.split(/\s+/).filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase()}</span>;
}

export default function PuzzleLeaderboard({ refreshKey, onSummary }) {
  const [entries, setEntries] = useState([]);
  const [myScore, setMyScore] = useState({ highScore: 0, puzzlesCompleted: 0 });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let live = true;
    async function load() {
      setLoading(true);
      try {
        const { data } = await api.get('/trainee/puzzle-scores', { params: { page } });
        if (!live) return;
        setEntries(data.entries || []);
        setMyScore(data.myScore || { highScore: 0, puzzlesCompleted: 0 });
        onSummary?.(data.myScore || { highScore: 0, puzzlesCompleted: 0 });
        setTotal(data.total || 0);
        setStatus('');
      } catch (error) {
        if (live) setStatus(error.response?.data?.message || 'Unable to load scores. Try refreshing.');
      } finally {
        if (live) setLoading(false);
      }
    }
    load();
    const timer = window.setInterval(load, 30000);
    const focus = () => load();
    window.addEventListener('focus', focus);
    return () => { live = false; window.clearInterval(timer); window.removeEventListener('focus', focus); };
  }, [page, refresh, refreshKey, onSummary]);

  const pages = Math.max(1, Math.ceil(total / 20));
  return <section className="puzzle-scoreboard" aria-labelledby="total-score-title">
    <div className="scoreboard-heading">
      <div><span className="studio-eyebrow">TRAINEE SCOREBOARD</span><h2 id="total-score-title">Every puzzle counts. Your best stays.</h2><p>Highest total first, across all modules and levels. Each puzzle contributes its best saved score once.</p></div>
      <button className="studio-button studio-button--secondary" type="button" disabled={loading} onClick={() => setRefresh(v => v + 1)}>{loading ? 'Updating…' : 'Refresh scores'}</button>
    </div>
    <div className="scoreboard-personal"><div><span>Your total best</span><strong>{count(myScore.highScore)} <small>points</small></strong></div><div><span>Puzzles with a saved best</span><strong>{count(myScore.puzzlesCompleted)}</strong></div></div>
    <div className="scoreboard-rule"><span aria-hidden="true">↗</span><p>A higher replay score improves your total. Equal or lower scores keep your saved best.</p></div>
    {status && <p className="studio-notice" role="alert">{status}</p>}
    {loading && !entries.length && <p className="scoreboard-empty" role="status">Loading trainee scores…</p>}
    {!loading && !entries.length && !status && <p className="scoreboard-empty">The first correct puzzle earns a place here. Start a challenge to set your best.</p>}
    {entries.length > 0 && <div className="scoreboard-table-scroll"><table className="scoreboard-table" aria-label="Trainee total high scores, descending order"><thead><tr><th scope="col">Trainee profile</th><th scope="col">Name</th><th scope="col">High score</th></tr></thead><tbody>{entries.map((row, index) => <tr key={`${page}-${index}`}><td><ProfileImage image={row.profileImage} name={row.name} /></td><td>{row.name}</td><td>{count(row.highScore)} <small>pts</small></td></tr>)}</tbody></table></div>}
    {pages > 1 && <div className="scoreboard-pagination"><button type="button" className="studio-button studio-button--secondary" disabled={page <= 1 || loading} onClick={() => setPage(v => v - 1)}>Previous</button><span>Page {page} of {pages}</span><button type="button" className="studio-button studio-button--secondary" disabled={page >= pages || loading} onClick={() => setPage(v => v + 1)}>Next</button></div>}
    <p className="scoreboard-footnote">Refreshes every 30 seconds and when you return to this tab. Only profile image, name and total high score are shared.</p>
  </section>;
}
