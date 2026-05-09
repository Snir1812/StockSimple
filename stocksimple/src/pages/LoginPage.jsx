import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit = () => {
    login()
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Rubik', sans-serif" }}>

      {/* ── Blue sidebar (right side in RTL — first child = rightmost) ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: '38%',
          flexShrink: 0,
          backgroundColor: '#1d4ed8',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 40px',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 96, opacity: 0.85, marginBottom: 24 }}>
          inventory_2
        </span>
        <h3 style={{ fontSize: 28, fontWeight: 900, marginBottom: 16 }}>ניהול מלאי חכם</h3>
        <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, maxWidth: 280 }}>
          עקוב אחרי רשרת האספקה שלך בזמן אמת ומנע חוסרים שיפגעו בעסק שלך.
        </p>
        <div
          style={{
            marginTop: 40,
            width: '100%',
            height: 180,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 72, opacity: 0.3 }}>warehouse</span>
        </div>
      </div>

      {/* ── Form area (left side in RTL — second child = leftmost) ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          padding: '32px 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#1d4ed8', marginBottom: 6 }}>
              StockSimple
            </div>
            <div style={{ fontSize: 14, color: '#64748b' }}>מערכת ניהול מלאי לעסקים קטנים</div>
          </div>

          {/* Card */}
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              padding: 32,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', marginBottom: 24, color: '#0f172a' }}>
              התחברות למערכת
            </h2>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="email"
                style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}
              >
                כתובת אימייל
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  className="material-symbols-outlined"
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: '#94a3b8' }}
                >
                  mail
                </span>
                <input
                  dir="ltr"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    height: 48,
                    paddingRight: 44,
                    paddingLeft: 16,
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    backgroundColor: '#f8fafc',
                    fontSize: 15,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label htmlFor="password" style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>סיסמה</label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: '#1d4ed8', textDecoration: 'none' }}>
                  שכחת סיסמה?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <span
                  className="material-symbols-outlined"
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: '#94a3b8' }}
                >
                  lock
                </span>
                <input
                  dir="ltr"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: 48,
                    paddingRight: 44,
                    paddingLeft: 16,
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    backgroundColor: '#f8fafc',
                    fontSize: 15,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Remember me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#1d4ed8' }}
              />
              <label htmlFor="remember" style={{ fontSize: 13, color: '#64748b' }}>זכור אותי בדפדפן זה</label>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              style={{
                width: '100%',
                height: 48,
                backgroundColor: '#1d4ed8',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontFamily: "'Rubik', sans-serif",
              }}
            >
              <span>התחבר</span>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>login</span>
            </button>

            {/* Divider */}
            <div style={{ position: 'relative', margin: '24px 0' }}>
              <div style={{ borderTop: '1px solid #e2e8f0' }} />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#fff',
                  padding: '0 12px',
                  fontSize: 12,
                  color: '#94a3b8',
                }}
              >
                או המשך עם
              </div>
            </div>

            {/* Social */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[
                { icon: 'G', label: 'Google' },
                { label: 'SSO ארגוני', matIcon: 'corporate_fare' },
              ].map(({ icon, label, matIcon }) => (
                <button
                  key={label}
                  style={{
                    height: 48,
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontSize: 14,
                    fontFamily: "'Rubik', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {icon && <span style={{ fontWeight: 900, color: '#1d4ed8' }}>{icon}</span>}
                  {matIcon && (
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#1d4ed8' }}>{matIcon}</span>
                  )}
                  {label}
                </button>
              ))}
            </div>

            {/* Register link */}
            <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
              אין לך חשבון?{' '}
              <Link to="/register" style={{ color: '#1d4ed8', fontWeight: 700, textDecoration: 'none' }}>
                הירשם עכשיו
              </Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 24 }}>
            © 2024 StockSimple. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </div>
  )
}
