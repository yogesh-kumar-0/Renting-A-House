import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { signup } = useAuth();

  const validate = () => {
    const e = {};
    if (!formData.username.trim()) e.username = 'Please provide a username.';
    if (!formData.email.trim() || !formData.email.includes('@')) e.email = 'Please provide a valid email.';
    if (!formData.password || formData.password.length < 6) e.password = 'Password must be at least 6 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await signup({ user: formData });
    if (success) navigate('/listing');
  };

  const getInputClasses = (field) => `
    w-full px-4 py-3 rounded-xl text-sm outline-none transition-all box-border
    ${errors[field] ? 'border border-red-300 bg-red-50' : 'border border-gray-100 bg-gray-50'}
    text-gray-700 focus:border-red-500 focus:bg-white
  `;

  const fields = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'Choose a username' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-10 shadow-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-compass text-red-500 text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1.5 tracking-tight">Create account</h1>
          <p className="text-xs text-gray-400">Join WanderLust and start exploring</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name} className="mb-4.5">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
              <input type={type} name={name} value={formData[name]} onChange={handleChange}
                placeholder={placeholder} className={getInputClasses(name)}
                onFocus={e => e.target.style.borderColor = '#ff6b6b'}
                onBlur={e => { if (!errors[name]) e.target.style.borderColor = '#f3f4f6'; }}
              />
              {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
            </div>
          ))}

          <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold border-0 cursor-pointer shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 mt-1.5">
            Create Account
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6 mb-0">
          Already have an account?{' '}
          <Link to="/user/login" className="text-red-500 font-bold no-underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};