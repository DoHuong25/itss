import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// --- (Bạn có thể copy các style từ LoginPage.jsx vào đây) ---
const pageStyles = { /* ... */ };
const formStyles = { /* ... */ };
// ...

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    const result = await register(username, password);
    if (result.success) {
      setSuccess('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Chờ 2 giây rồi chuyển trang
    } else {
      setError(result.message || 'Đăng ký thất bại.');
    }
  };

  return (
    <div style={pageStyles}>
      <form style={formStyles} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center' }}>Đăng Ký</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label>Tên đăng nhập:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Mật khẩu:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nhập lại mật khẩu:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
        <button type="submit" style={{ width: '100%', padding: '0.75rem' }}>Đăng Ký</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;