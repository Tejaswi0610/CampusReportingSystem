import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg('');
    try {
      const res = await api.post('/auth/seed');
      setSeedMsg('Demo data seeded successfully! Now login with the demo credentials below.');
    } catch {
      setSeedMsg('Seed failed. Make sure MongoDB is connected.');
    }
    setSeeding(false);
  };

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-logo">Campus Reporting System</div>
        <button className="btn btn-outline" onClick={() => navigate('/login')}>Login</button>
      </nav>

      <div className="landing-hero">
        <h1>Report. Track. Resolve.</h1>
        <p>A smart campus complaint management system for students, faculty, workers, and administrators.</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>Get Started</button>
          <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }} onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Seeding...' : 'Load Demo Data'}
          </button>
        </div>
        {seedMsg && (
          <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '1rem 1.5rem', color: 'white', fontSize: '0.9rem', maxWidth: '500px' }}>
            {seedMsg}
            {seedMsg.startsWith('Demo data seeded successfully!') && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', opacity: 0.85 }}>
                <strong>Admin:</strong> admin@campus.com / admin123<br />
                <strong>Faculty:</strong> faculty@campus.com / faculty123<br />
                <strong>Worker:</strong> worker@campus.com / worker123<br />
                <strong>Student:</strong> student@campus.com / student123
              </div>
            )}
          </div>
        )}

        <div className="hero-cards">
          {[
            { icon: '🎓', title: 'Students', desc: 'Submit and track complaints' },
            { icon: '👩‍🏫', title: 'Faculty', desc: 'Report campus issues' },
            { icon: '🛠️', title: 'Workers', desc: 'Resolve assigned issues' },
            { icon: '🛡️', title: 'Admin', desc: 'Oversee everything' },
          ].map(c => (
            <div className="hero-card" key={c.title} onClick={() => navigate('/login')}>
              <div className="icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
