import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

// --- CSS Styles ---
const pageStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
};
const formStyles = {
  width: '400px',
  padding: '2rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};
const inputGroupStyles = {
  marginBottom: '1rem',
};
const labelStyles = {
  display: 'block',
  marginBottom: '0.5rem',
};
const inputStyles = {
  width: '100%',
  padding: '0.5rem',
  fontSize: '1rem',
};
const buttonStyles = {
  width: '100%',
  padding: '0.75rem',
  fontSize: '1rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
// --- End CSS Styles ---

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div style={pageStyles}>
      <form style={formStyles} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center' }}>Đăng Nhập</h2>
        <div style={inputGroupStyles}>
          <label style={labelStyles}>Tên đăng nhập:</label>
          <input
            style={inputStyles}
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div style={inputGroupStyles}>
          <label style={labelStyles}>Mật khẩu:</label>
          <input 
            style={inputStyles}
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <button style={buttonStyles} type="submit">Đăng Nhập</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;