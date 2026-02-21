import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const e = {};
    if (!credentials.username.trim()) e.username = 'Please provide a username.';
    if (!credentials.password.trim()) e.password = 'Please provide a password.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await login(credentials);
    if (success) navigate('/listing');
  };

  const getInputClasses = (field) => `
    w-full px-4 py-3 rounded-xl text-sm outline-none transition-all box-border
    ${errors[field] ? 'border border-red-300 bg-red-50' : 'border border-gray-100 bg-gray-50'}
    text-gray-700 focus:border-red-500 focus:bg-white
  `;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-10 shadow-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-compass text-red-500 text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1.5 tracking-tight">Welcome back</h1>
          <p className="text-xs text-gray-400">Sign in to your WanderLust account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4.5">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Username</label>
            <input type="text" name="username" value={credentials.username} onChange={handleChange}
              placeholder="Enter your username" className={getInputClasses('username')}
              onFocus={e => e.target.style.borderColor = '#ff6b6b'}
              onBlur={e => { if (!errors.username) e.target.style.borderColor = '#f3f4f6'; }}
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
            <input type="password" name="password" value={credentials.password} onChange={handleChange}
              placeholder="Enter your password" className={getInputClasses('password')}
              onFocus={e => e.target.style.borderColor = '#ff6b6b'}
              onBlur={e => { if (!errors.password) e.target.style.borderColor = '#f3f4f6'; }}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold border-0 cursor-pointer shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6 mb-0">
          Don't have an account?{' '}
          <Link to="/user/signup" className="text-red-500 font-bold no-underline">Sign up free</Link>
        </p>
      </div>
    </div>
  );
};