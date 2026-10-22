import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css'; 
import logo from '../assets/logo.png'; 

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/admin-login`, {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/dashboard'); 
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Server error. Please try again.');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="desktop-container">
        
        <div className="form-section">
          
          <div className="animated-login-box">
            
            <div className="login-logo-container">
              <img src={logo} alt="FitNadu Logo" className="top-login-logo" />
            </div>

            <div className="login-content">
              <h1 className="main-heading">Welcome Admin</h1>
              <p className="sub-heading">Sign in to stay on track. Your next chapter of strength starts here.</p>

              {errorMsg && <div style={{color: '#DC2626', marginBottom: '15px', fontWeight: 'bold'}}>{errorMsg}</div>}

              <form onSubmit={handleLogin} className="login-form">
                <div className="input-box">
                  <label>Email address</label>
                  <div className="input-wrapper">
                    <i className="bi bi-envelope mail-icon"></i>
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="input-box">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <i className="bi bi-lock lock-icon"></i>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <i 
                      className={`bi bi-eye${showPassword ? '' : '-slash'} eye-icon`} 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer' }}
                    ></i>
                  </div>
                </div>

                <div className="options-row">
                  <label className="checkbox-container">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                    <span className="checkmark"></span> Remember me
                  </label>
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>

                <button type="submit" className="submit-btn">
                  Sign in <i className="bi bi-arrow-right arrow-icon"></i>
                </button>
              </form>
            </div>
            
          </div>

        </div>

      </div>
    </div>
  );
}