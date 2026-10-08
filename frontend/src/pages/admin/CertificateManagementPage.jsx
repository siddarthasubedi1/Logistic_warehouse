import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import FeedbackAlert from '../../components/ui/FeedbackAlert';
import LoadingCard from '../../components/ui/LoadingCard';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/training';

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
  const [requiredModuleKeys, setRequiredModuleKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [view, setView] = useState('pending');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/admin/certificates');
      setRows(Array.isArray(data.certificates) ? data.certificates : []);
      setRequiredModuleKeys(Array.isArray(data.requiredModuleKeys) ? data.requiredModuleKeys : []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load certificate requests.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Keep one current cumulative certificate per trainee; older issued versions remain in the database.
  const shown = useMemo(() => rows.filter(row => row.isLatest && (view === 'history' ? row.status === 'sent' : row.status !== 'sent')), [rows, view]);
  const pendingCount = rows.filter(row => row.isLatest && row.status !== 'sent').length;
  const sentCount = rows.filter(row => row.isLatest && row.status === 'sent').length;

  const savePdf = async row => {
    const response = await api.get(`/admin/certificates/${row._id}/download`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${row.certificateNumber || 'training-certificate'}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 2000);
  };

  const download = async row => {
    try { setBusyKey(`${row._id}:download`); setError(''); await savePdf(row); }
    catch (e) { setError(getApiErrorMessage(e, 'Could not download certificate.')); }
    finally { setBusyKey(''); }
  };

  const confirmSent = async row => {
    try {
      setBusyKey(`${row._id}:confirm`); setError('');
      await api.post(`/admin/certificates/${row._id}/confirm-notification`);
      setMessage('Certificate notification recorded with the date and Admin account.');
      await load();
    } catch (e) { setError(getApiErrorMessage(e, 'Unable to record certificate notification.')); }
    finally { setBusyKey(''); }
  };

  // Local assignment workflow: Gmail notifies the trainee to log in and retrieve their own PDF.
  const send = async row => {
    const recipient = row.trainee?.email || row.recipientEmail;
    if (!recipient) { setError('The trainee does not have a registered email address.'); return; }
    const modules = Array.isArray(row.modules) ? row.modules : [];
    const name = [row.trainee?.firstName, row.trainee?.lastName].filter(Boolean).join(' ') || row.trainee?.username || 'Trainee';
    const subject = `UK LogiWare Training Certificate - ${modules.length} Module${modules.length === 1 ? '' : 's'} Completed`;
    const moduleList = modules.map(m => `- ${m.name || pretty(m.key)}: ${m.rating?.stars ?? 'N/A'}/5 stars`).join('\n');
    const body = `Hello ${name},\n\nCongratulations on completing your training!\n\nYour certificate PDF is available inside your UK LogiWare trainee account.\n\nSign in to UK LogiWare, open My Progress, and select View / Download Certificate PDF.\n\nCertificate number: ${row.certificateNumber}\nCompleted modules:\n${moduleList}\n\nKind regards,\nUK LogiWare Safety Training`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const opened = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    if (!opened) { setError('Please allow pop-ups to open Gmail.'); return; }
    setMessage('Gmail compose opened. After actually clicking Send in Gmail, return here and click Confirm Sent to save the record.');
  };

  return <DashboardLayout role='admin' title='Certificates' subtitle='Notify trainees when their certificate is available in My Progress.'>
    <div className='app-page certificate-admin-page'>
      <FeedbackAlert type='error' message={error} onClose={() => setError('')} />
      <FeedbackAlert type='success' message={message} onClose={() => setMessage('')} />

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
          <div><span className='certificate-eyebrow'>Certificate management</span><h2>Certificate notifications</h2><p>Pending certificates are listed until you confirm sending the Gmail notification. Confirmed notifications are saved in History as evidence of Admin confirmation (not proof of Gmail delivery).</p></div>
        </header>

        <div className='certificate-history-tabs'><button className={view === 'pending' ? 'active' : ''} onClick={() => setView('pending')}>Pending ({pendingCount})</button><button className={view === 'history' ? 'active' : ''} onClick={() => setView('history')}>Notification history ({sentCount})</button></div>
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
                  {row.status === 'sent' && <span className='certificate-status certificate-status--sent'>Admin confirmed sent</span>}
                  <small>{row.sentAt ? `Confirmed ${date(row.sentAt)}` : `Eligible ${date(row.eligibleAt)}`}</small>
                </div>
              </header>

              <div className='certificate-record__summary'>
                <div><span>Certificate includes</span><strong>{row.completionCount || modules.length} completed module{Number(row.completionCount || modules.length) === 1 ? '' : 's'}</strong></div>
                <div><span>Certificate number</span><strong>{row.certificateNumber}</strong></div>
                <div><span>Confirmed by</span><strong>{row.sentBy ? `${row.sentBy.firstName || ''} ${row.sentBy.lastName || row.sentBy.username || ''}`.trim() : 'Awaiting confirmation'}</strong></div>
              </div>

              <div className='certificate-module-list'>
                {modules.map(module => <ModulePerformance key={module.key} module={module} />)}
              </div>


              <footer className='certificate-record__actions'>
                {row.status !== 'sent' && <><button type='button' className='certificate-send-button' disabled={!!busyKey} onClick={() => send(row)}>Send Certificate</button><button type='button' className='certificate-send-button' disabled={!!busyKey} onClick={() => confirmSent(row)}>{busyKey === `${row._id}:confirm` ? 'Saving…' : 'Confirm Sent'}</button></>}
                <button type='button' className='certificate-download-button' disabled={!!busyKey} onClick={() => download(row)}>{downloadBusy ? 'Preparing PDF…' : 'Download PDF'}</button>
                <span className='certificate-sent-note'>{row.status === 'sent' ? `Recorded ${date(row.sentAt)}. This is Admin confirmation, not verified Gmail delivery.` : 'Open Gmail, send the message, then select Confirm Sent. The trainee accesses the PDF from My Progress.'}</span>
              </footer>
            </article>;
          })}
        </div> : <div className='certificate-empty'><strong>{view === 'pending' ? 'No pending certifications' : 'No confirmed notifications yet'}</strong><p>{view === 'pending' ? 'All current eligible certificate notifications are confirmed. Check Notification history for saved records.' : 'After sending a Gmail notification, confirm it from the Pending tab to save the record.'}</p></div>}
      </section>
    </div>
  </DashboardLayout>;
}

function Summary({ label, value, note }) {
  return <article className='certificate-summary-card'><span>{label}</span><strong>{value}</strong><p>{note}</p></article>;
}
