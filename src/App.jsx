import { useState, useEffect } from 'react';
import IntroView from './components/IntroView';
import FormView from './components/FormView';
import EmailGate from './components/EmailGate';
import ReportView from './components/ReportView';
import LoadingView from './components/LoadingView';
import { evaluateStartup } from './api';

export default function App() {
  const [view, setView] = useState('intro');
  const [formData, setFormData] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('r');
    if (encoded) {
      try {
        const decoded = JSON.parse(atob(encoded));
        setReport(decoded);
        setView('report');
      } catch {
        // Invalid data, stay on intro
      }
    }
  }, []);

  const handleFormSubmit = (data) => {
    setFormData(data);
    setView('email-gate');
  };

  const handleEmailSubmit = async (email) => {
    const fullData = { ...formData, email };
    setView('loading');
    setError(null);
    try {
      const result = await evaluateStartup(fullData);
      const reportData = { ...result, submittedData: fullData };
      setReport(reportData);
      const encoded = btoa(JSON.stringify(reportData));
      window.history.replaceState({}, '', '?r=' + encoded);
      setView('report');
    } catch (err) {
      setError(err.message);
      setView('form');
    }
  };

  const handleReset = () => {
    setView('intro');
    setFormData(null);
    setReport(null);
    setError(null);
    window.history.replaceState({}, '', '/');
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {view === 'intro' && <IntroView onStart={() => setView('form')} />}
      {view === 'form' && <FormView onSubmit={handleFormSubmit} error={error} />}
      {view === 'email-gate' && <EmailGate onSubmit={handleEmailSubmit} />}
      {view === 'loading' && <LoadingView />}
      {view === 'report' && <ReportView report={report} onReset={handleReset} />}
    </div>
  );
}
