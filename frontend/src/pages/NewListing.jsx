import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { listingsAPI } from '../api';
import { useAuth } from '../context/AuthContext';

export const NewListing = () => {
  const [formData, setFormData] = useState({ title: '', description: '', location: '', country: '', price: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { if (!user) navigate('/user/login'); }, [user, navigate]);

  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = 'Title is required.';
    if (!formData.description.trim()) e.description = 'Description is required.';
    if (!formData.location.trim()) e.location = 'Location is required.';
    if (!formData.country.trim()) e.country = 'Country is required.';
    if (!formData.price || formData.price <= 0) e.price = 'Valid price is required.';
    if (!image) e.image = 'Image is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
    if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('lististing[title]', formData.title);
      data.append('lististing[description]', formData.description);
      data.append('lististing[location]', formData.location);
      data.append('lististing[country]', formData.country);
      data.append('lististing[price]', formData.price);
      data.append('lististing[image]', image);
      await listingsAPI.createListing(data);
      navigate('/listing');
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to create listing' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (field) => `
    w-full px-4 py-3 rounded-xl text-sm outline-none transition-all box-border
    ${errors[field] ? 'border border-red-300 bg-red-50' : 'border border-gray-100 bg-gray-50'}
    text-gray-700 focus:border-red-500 focus:bg-white
  `;

  const labelStyle = 'block text-xs font-semibold text-gray-700 mb-1.5';

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-7">
          <Link to="/listing" className="inline-flex items-center gap-1.5 text-xs text-gray-400 no-underline mb-3 hover:text-gray-600">
            <i className="fa-solid fa-arrow-left text-xs"></i> Back to listings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-0 tracking-tight">Add New Listing</h1>
          <p className="text-sm text-gray-400 mt-1.5 mb-0">Share your space with travelers worldwide</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          {errors.submit && (
            <div className="px-4 py-3 bg-red-50 border border-red-300 rounded-xl text-red-500 text-xs mb-5">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Title */}
            <div className="mb-4.5">
              <label className={labelStyle}>Title <span className="text-red-500">*</span></label>
              <input name="title" type="text" value={formData.title} onChange={handleChange}
                placeholder="Give your listing a catchy title" className={inputStyle('title')}
                onFocus={e => e.target.style.borderColor = '#ff6b6b'}
                onBlur={e => { if (!errors.title) e.target.style.borderColor = '#f3f4f6'; }} />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="mb-4.5">
              <label className={labelStyle}>Description <span className="text-red-500">*</span></label>
              <textarea name="description" rows="4" value={formData.description} onChange={handleChange}
                placeholder="Describe what makes your place special..."
                className={inputStyle('description') + ' resize-none font-inherit leading-relaxed'}
                onFocus={e => e.target.style.borderColor = '#ff6b6b'}
                onBlur={e => { if (!errors.description) e.target.style.borderColor = '#f3f4f6'; }} />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* Image Upload */}
            <div className="mb-4.5">
              <label className={labelStyle}>Photo <span className="text-red-500">*</span></label>
              {preview ? (
                <div className="relative rounded-xl overflow-hidden h-52 mb-2">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setPreview(null); setImage(null); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border-0 cursor-pointer text-sm text-gray-500 shadow-md flex items-center justify-center hover:text-gray-700">
                    ✕
                  </button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center w-full rounded-xl border-2 cursor-pointer transition-all h-36 ${errors.image ? 'border-red-300 bg-red-50' : 'border-dashed border-gray-300 bg-gray-50 hover:border-red-500 hover:bg-red-50'}`}>
                  <i className="fa-solid fa-cloud-arrow-up text-2xl text-gray-300 mb-2"></i>
                  <span className="text-xs text-gray-400">Click to upload image</span>
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              )}
              {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
            </div>

            {/* Price + Location */}
            <div className="grid grid-cols-2 gap-4 mb-4.5">
              <div>
                <label className={labelStyle}>Price / night <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input name="price" type="number" value={formData.price} onChange={handleChange}
                    placeholder="1200" className={inputStyle('price') + ' pl-8'}
                    onFocus={e => e.target.style.borderColor = '#ff6b6b'}
                    onBlur={e => { if (!errors.price) e.target.style.borderColor = '#f3f4f6'; }} />
                </div>
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className={labelStyle}>Location <span className="text-red-500">*</span></label>
                <input name="location" type="text" value={formData.location} onChange={handleChange}
                  placeholder="City, State" className={inputStyle('location')}
                  onFocus={e => e.target.style.borderColor = '#ff6b6b'}
                  onBlur={e => { if (!errors.location) e.target.style.borderColor = '#f3f4f6'; }} />
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
              </div>
            </div>

            {/* Country */}
            <div className="mb-7">
              <label className={labelStyle}>Country <span className="text-red-500">*</span></label>
              <input name="country" type="text" value={formData.country} onChange={handleChange}
                placeholder="India" className={inputStyle('country')}
                onFocus={e => e.target.style.borderColor = '#ff6b6b'}
                onBlur={e => { if (!errors.country) e.target.style.borderColor = '#f3f4f6'; }} />
              {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all ${isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'}`}>
              {isSubmitting ? 'Creating listing...' : 'Create Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};