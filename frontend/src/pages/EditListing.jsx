import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { listingsAPI } from '../api';

export const EditListing = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', description: '', location: '', country: '', price: '' });
  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchListing(); }, [id]);

  const fetchListing = async () => {
    try {
      const response = await listingsAPI.getEditPage(id);
      const l = response.data.listing;
      setFormData({ title: l.title, description: l.description, location: l.location, country: l.country, price: l.price });
      setCurrentImage(l.image);
    } catch { setErrors({ fetch: 'Failed to load listing' }); }
    finally { setIsLoading(false); }
  };

  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = 'Title is required.';
    if (!formData.description.trim()) e.description = 'Description is required.';
    if (!formData.location.trim()) e.location = 'Location is required.';
    if (!formData.country.trim()) e.country = 'Country is required.';
    if (!formData.price || formData.price <= 0) e.price = 'Valid price is required.';
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
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('lististing[title]', formData.title);
      data.append('lististing[description]', formData.description);
      data.append('lististing[location]', formData.location);
      data.append('lististing[country]', formData.country);
      data.append('lististing[price]', formData.price);
      if (newImage) data.append('lististing[image]', newImage);
      await listingsAPI.updateListing(id, data);
      navigate(`/listings/${id}`);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to update listing' });
    } finally { setIsSubmitting(false); }
  };

  const inputStyle = (field) => `
    w-full px-4 py-3 rounded-xl text-sm outline-none transition-all box-border
    ${errors[field] ? 'border border-red-300 bg-red-50' : 'border border-gray-100 bg-gray-50'}
    text-gray-700 focus:border-red-500 focus:bg-white
  `;

  const labelStyle = 'block text-xs font-semibold text-gray-700 mb-1.5';

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-9 h-9 border-3 border-gray-100 border-t-red-500 rounded-full animate-spin mx-auto mb-3"></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p className="text-gray-400 text-xs mb-0">Loading listing...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-7">
          <Link to={`/listings/${id}`} className="inline-flex items-center gap-1.5 text-xs text-gray-400 no-underline mb-3">
            <i className="fa-solid fa-arrow-left text-xs"></i> Back to listing
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-0 tracking-tight">Edit Listing</h1>
          <p className="text-sm text-gray-400 mt-1.5 mb-0">Update your listing details</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          {(errors.submit || errors.fetch) && (
            <div className="px-4 py-3 bg-red-50 border border-red-300 rounded-xl text-red-500 text-xs mb-5">
              {errors.submit || errors.fetch}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4.5">
              <label className={labelStyle}>Title <span className="text-red-500">*</span></label>
              <input name="title" type="text" value={formData.title} onChange={handleChange} className={inputStyle('title')}
                onFocus={e => e.target.style.borderColor = '#ff6b6b'}
                onBlur={e => { if (!errors.title) e.target.style.borderColor = '#f3f4f6'; }} />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div className="mb-4.5">
              <label className={labelStyle}>Description <span className="text-red-500">*</span></label>
              <textarea name="description" rows="4" value={formData.description} onChange={handleChange}
                className={inputStyle('description') + ' resize-none font-inherit leading-relaxed'}
                onFocus={e => e.target.style.borderColor = '#ff6b6b'}
                onBlur={e => { if (!errors.description) e.target.style.borderColor = '#f3f4f6'; }} />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* Current / New Image */}
            <div className="mb-4.5">
              <label className={labelStyle}>Photo</label>
              <div className="rounded-xl overflow-hidden h-48 mb-2.5">
                <img src={preview || currentImage} alt="listing" className="w-full h-full object-cover" />
              </div>
              <label className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 cursor-pointer text-xs text-gray-400 transition-all hover:border-red-500 hover:bg-red-50">
                <i className="fa-solid fa-arrow-up-from-bracket"></i>
                <span>{newImage ? newImage.name : 'Upload new photo (optional)'}</span>
                <input type="file" className="hidden" onChange={e => { const f = e.target.files[0]; setNewImage(f); if (f) setPreview(URL.createObjectURL(f)); }} accept="image/*" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4.5">
              <div>
                <label className={labelStyle}>Price / night <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input name="price" type="number" value={formData.price} onChange={handleChange}
                    className={inputStyle('price') + ' pl-8'}
                    onFocus={e => e.target.style.borderColor = '#ff6b6b'}
                    onBlur={e => { if (!errors.price) e.target.style.borderColor = '#f3f4f6'; }} />
                </div>
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className={labelStyle}>Location <span className="text-red-500">*</span></label>
                <input name="location" type="text" value={formData.location} onChange={handleChange} className={inputStyle('location')}
                  onFocus={e => e.target.style.borderColor = '#ff6b6b'}
                  onBlur={e => { if (!errors.location) e.target.style.borderColor = '#f3f4f6'; }} />
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
              </div>
            </div>

            <div className="mb-7">
              <label className={labelStyle}>Country <span className="text-red-500">*</span></label>
              <input name="country" type="text" value={formData.country} onChange={handleChange} className={inputStyle('country')}
                onFocus={e => e.target.style.borderColor = '#ff6b6b'}
                onBlur={e => { if (!errors.country) e.target.style.borderColor = '#f3f4f6'; }} />
              {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={isSubmitting}
                className={`flex-1 py-3.5 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all ${isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'}`}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              <Link to={`/listings/${id}`}
                className="py-3 px-6 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold no-underline bg-white transition-all hover:bg-gray-50">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};