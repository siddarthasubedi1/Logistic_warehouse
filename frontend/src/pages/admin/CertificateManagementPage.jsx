import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import FeedbackAlert from '../../components/ui/FeedbackAlert';
import LoadingCard from '../../components/ui/LoadingCard';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/training';

const statusLabel = value => ({ pending: 'Ready to send', sent: 'Sent', failed: 'Send failed' }[value] || value);
const date = value => value ? new Date(value).toLocaleString() : '—';
const pretty = value => String(value || '').replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
const duration = seconds => {
  const total = Math.max(0, Math.round(Number(seconds || 0)));
  if (!total) return 'Not available';
  const mins = Math.floor(total / 60), secs = total % 60;
  return mins ? `${mins}m${secs ? ` ${secs}s` : ''}` : `${secs}s`;
};

function StarRating({ value = 0 }) {
  const rating = Math.max(0, Math.min(5, Number(value || 0)));
  return <div className='certificate-rating' aria-label={`${rating} out of 5 stars`}>
    <span className='certificate-stars' aria-hidden='true'>
      {[0, 1, 2, 3, 4].map(index => {
        const amount = Math.max(0, Math.min(1, rating - index));
        return <span key={index} className={`certificate-star ${amount >= 1 ? 'full' : amount >= .5 ? 'half' : 'empty'}`}>★</span>;
      })}
    </span>
    <strong>{rating.toFixed(rating % 1 ? 1 : 0)}/5</strong>
  </div>;
}

function ModulePerformance({ module }) {
  const rating = module?.rating || {};
  return <article className='certificate-module-performance'>
    <div className='certificate-module-performance__top'>
      <div>
        <span className='certificate-module-name'>{module?.name || pretty(module?.key)}</span>
        <small>Learning complete · Assessment passed</small>
      </div>
      <StarRating value={rating.stars} />
    </div>
    <div className='certificate-module-performance__evidence'>
      <span><b>{rating.assessmentAttempts || 1}</b><small>Assessment attempt{Number(rating.assessmentAttempts || 1) === 1 ? '' : 's'}</small></span>
      <span><b>{duration(rating.totalAssessmentSeconds)}</b><small>Recorded assessment time</small></span>
    </div>
  </article>;
}

export default function CertificateManagementPage() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ pending: 0, sent: 0, failed: 0 });
  const [emailConfigured, setEmailConfigured] = useState(false);
  const [requiredModuleKeys, setRequiredModuleKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/admin/certificates');
      setRows(Array.isArray(data.certificates) ? data.certificates : []);
      setSummary(data.summary || { pending: 0, sent: 0, failed: 0 });
      setEmailConfigured(Boolean(data.emailConfigured));
      setRequiredModuleKeys(Array.isArray(data.requiredModuleKeys) ? data.requiredModuleKeys : []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load certificate requests.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => filter === 'all' ? rows : rows.filter(row => row.status === filter), [rows, filter]);

  const send = async row => {
    if (!row?._id || busyKey) return;
    try {
      setBusyKey(`${row._id}:send`);
      setError('');
      setMessage('');
      const { data } = await api.post(`/admin/certificates/${row._id}/send`);
      setMessage(data.message || `Certificate emailed to ${row.trainee?.email || row.recipientEmail}.`);
      await load();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to send the certificate email.'));
    } finally {
      setBusyKey('');
    }
  };

  const download = async row => {
    if (!row?._id || row.status !== 'sent' || busyKey) return;
    try {
      setBusyKey(`${row._id}:download`);
      setError('');
      const response = await api.get(`/admin/certificates/${row._id}/download`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${row.certificateNumber || 'training-certificate'}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      setMessage('Certificate PDF downloaded successfully.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to download the certificate PDF.'));
    } finally {
      setBusyKey('');
    }
  };

  return <DashboardLayout role='admin' title='Certificates' subtitle='Send an updated cumulative certificate whenever a trainee completes another training module.'>
    <div className='app-page certificate-admin-page'>
      <FeedbackAlert type='error' message={error} onClose={() => setError('')} />
      <FeedbackAlert type='success' message={message} onClose={() => setMessage('')} />

      {!emailConfigured && <section className='certificate-config-warning' role='status'>
        <div><strong>Email delivery needs configuration</strong><p>Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and CERTIFICATE_FROM_EMAIL to <code>backend/.env</code>. Certificate requests still appear here, but email sending remains disabled until SMTP is configured.</p></div>
      </section>}

      <section className='certificate-summary-grid' aria-label='Certificate status summary'>
        <Summary label='Ready to send' value={summary.pending} note='Latest cumulative certificates waiting for Admin action.' />
        <Summary label='Sent' value={summary.sent} note='Certificates already emailed and available for PDF download.' />
        <Summary label='Send failed' value={summary.failed} note='Retry after checking the email configuration.' />
      </section>

      <section className='certificate-policy-card'>
        <div>
          <span className='certificate-eyebrow'>Cumulative certificate rule</span>
          <h2>The certificate grows as the trainee completes more modules</h2>
          <p>If Cyber Awareness is completed first, the first certificate contains Cyber Awareness and its performance rating. When the same trainee later completes Manual Handling, a new certificate becomes ready containing both Cyber Awareness and Manual Handling with a separate rating for each. After the third module is completed, the next certificate contains all three completed modules and all three ratings.</p>
          <p className='certificate-rating-policy'>Certification requires the module learning sections and passing assessment only. Scenarios, puzzles and safety simulations remain optional. Each module’s 5-star rating uses recorded assessment time and number of attempts.</p>
        </div>
        <div className='certificate-module-chips'>{requiredModuleKeys.map(key => <span key={key}>{pretty(key)}</span>)}</div>
      </section>

      <section className='certificate-list-card'>
        <header className='certificate-list-head'>
          <div><span className='certificate-eyebrow'>Certificate queue</span><h2>Completed training certificates</h2><p>Every row shows exactly which modules will appear on that PDF. The recipient is always the trainee’s registered email.</p></div>
          <div className='certificate-filter-row' aria-label='Certificate filters'>
            {[['all', 'All'], ['pending', 'Ready'], ['sent', 'Sent'], ['failed', 'Failed']].map(([value, label]) => <button key={value} type='button' className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}</button>)}
          </div>
        </header>

        {loading ? <LoadingCard message='Checking completed modules and certificate eligibility...' /> : shown.length ? <div className='certificate-cards'>
          {shown.map(row => {
            const modules = Array.isArray(row.modules) ? row.modules : [];
            const sendBusy = busyKey === `${row._id}:send`;
            const downloadBusy = busyKey === `${row._id}:download`;
            return <article className={`certificate-record ${row.isLatest ? 'certificate-record--latest' : ''}`} key={row._id}>
              <header className='certificate-record__header'>
                <div>
                  <div className='certificate-record__title-row'>
                    <h3>{row.trainee?.firstName} {row.trainee?.lastName}</h3>
                    {row.isLatest && <span className='certificate-latest-chip'>Latest certificate</span>}
                  </div>
                  <p>@{row.trainee?.username} · <span className='certificate-email'>{row.trainee?.email || row.recipientEmail}</span></p>
                </div>
                <div className='certificate-record__status'>
                  <span className={`certificate-status certificate-status--${row.status}`}>{statusLabel(row.status)}</span>
                  <small>{row.sentAt ? `Sent ${date(row.sentAt)}` : `Eligible ${date(row.eligibleAt)}`}</small>
                </div>
              </header>

              <div className='certificate-record__summary'>
                <div><span>Certificate includes</span><strong>{row.completionCount || modules.length} completed module{Number(row.completionCount || modules.length) === 1 ? '' : 's'}</strong></div>
                <div><span>Certificate number</span><strong>{row.certificateNumber}</strong></div>
                <div><span>Issued by</span><strong>{row.sentBy ? `${row.sentBy.firstName || ''} ${row.sentBy.lastName || row.sentBy.username || ''}`.trim() : 'Not issued yet'}</strong></div>
              </div>

              <div className='certificate-module-list'>
                {modules.map(module => <ModulePerformance key={module.key} module={module} />)}
              </div>

              {row.status === 'failed' && row.lastEmailError && <p className='certificate-error'>{row.lastEmailError}</p>}

              <footer className='certificate-record__actions'>
                {row.status !== 'sent' && <button type='button' className='certificate-send-button' disabled={!emailConfigured || !!busyKey} onClick={() => send(row)}>{sendBusy ? 'Sending…' : row.status === 'failed' ? 'Retry email' : 'Send certificate'}</button>}
                {row.status === 'sent' && <button type='button' className='certificate-download-button' disabled={!!busyKey} onClick={() => download(row)}>{downloadBusy ? 'Preparing PDF…' : 'Download PDF'}</button>}
                {row.status === 'sent' && <span className='certificate-sent-note'>The PDF is the same certificate version that was emailed to the trainee.</span>}
              </footer>
            </article>;
          })}
        </div> : <div className='certificate-empty'><strong>No certificate requests in this view</strong><p>When a trainee completes a module, the system creates or updates the cumulative certificate automatically.</p></div>}
      </section>
    </div>
  </DashboardLayout>;
}

function Summary({ label, value, note }) {
  return <article className='certificate-summary-card'><span>{label}</span><strong>{value}</strong><p>{note}</p></article>;
}
