import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { listingsAPI, reviewsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import mapboxgl from 'mapbox-gl';

export const ShowListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  const [reviewErrors, setReviewErrors] = useState({});
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchListing(); }, [id]);

  useEffect(() => {
    if (listing?.geometry && !mapInitialized) {
      // Small delay to ensure DOM element is rendered
      const t = setTimeout(() => initializeMap(), 100);
      return () => clearTimeout(t);
    }
  }, [listing, mapInitialized]);

  const fetchListing = async () => {
    try {
      setIsLoading(true);
      const response = await listingsAPI.getListingById(id);
      setListing(response.data.listing);
    } catch (err) {
      setError('Failed to load listing');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeMap = () => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      console.warn('Mapbox token not found in environment variables');
      return;
    }
    const el = document.getElementById('map');
    if (!el) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: el,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: listing.geometry.coordinates,
      zoom: 12
    });
    new mapboxgl.Marker({ color: '#ff6b6b' })
      .setLngLat(listing.geometry.coordinates)
      .addTo(map);
    setMapInitialized(true);
  };

  const validateReview = () => {
    const e = {};
    if (!reviewData.rating || reviewData.rating === '0') e.rating = 'Please select a rating.';
    if (!reviewData.comment.trim()) e.comment = 'Please provide a comment.';
    setReviewErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({ ...prev, [name]: value }));
    if (reviewErrors[name]) setReviewErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!validateReview()) return;
    setIsSubmittingReview(true);
    try {
      await reviewsAPI.addReview(id, { review: { rating: reviewData.rating, comment: reviewData.comment } });
      setReviewData({ rating: 0, comment: '' });
      fetchListing();
    } catch (err) {
      setReviewErrors({ submit: err.response?.data?.message || 'Failed to add review' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try { await reviewsAPI.deleteReview(id, reviewId); fetchListing(); } catch (err) {}
  };

  const handleDeleteListing = async () => {
    if (!window.confirm('Delete this listing?')) return;
    try { await listingsAPI.deleteListing(id); navigate('/listing'); } catch (err) {}
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <svg className="animate-spin h-8 w-8 text-red-400" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  );

  if (error || !listing) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-gray-600">{error || 'Listing not found'}</p>
        <Link to="/listing" className="mt-4 inline-block text-sm text-red-500 hover:underline">Back to listings</Link>
      </div>
    </div>
  );

  const isOwner = user && user._id === listing.owner?._id;
  const canReview = user && !isOwner;
  const avgRating = listing.reviews?.length
    ? (listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative w-full bg-gray-200" style={{ height: '480px' }}>
        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}></div>
        <Link to="/listing" className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-sm text-gray-700 hover:bg-white transition-all shadow-sm">
          <i className="fa-solid fa-arrow-left text-xs"></i> Back
        </Link>
        {isOwner && (
          <div className="absolute top-6 right-6 flex gap-2">
            <Link to={`/listings/${listing._id}/edit`}
              className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-sm font-medium text-gray-700 hover:bg-white transition-all shadow-sm">
              <i className="fa-solid fa-pen text-xs mr-1.5"></i> Edit
            </Link>
            <button onClick={handleDeleteListing}
              className="px-4 py-2 bg-red-500/90 backdrop-blur-sm rounded-xl text-sm font-medium text-white hover:bg-red-500 transition-all shadow-sm">
              <i className="fa-solid fa-trash text-xs mr-1.5"></i> Delete
            </button>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{listing.title}</h1>
              {avgRating && (
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl shrink-0">
                  <i className="fa-solid fa-star text-amber-400 text-sm"></i>
                  <span className="font-semibold text-gray-800 text-sm">{avgRating}</span>
                  <span className="text-gray-400 text-xs">({listing.reviews.length})</span>
                </div>
              )}
            </div>
            <p className="text-gray-500 flex items-center gap-1.5 mb-6">
              <i className="fa-solid fa-location-dot text-red-400 text-sm"></i>
              {listing.location}, {listing.country}
            </p>

            {/* Host */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' }}>
                {listing.owner?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-xs text-gray-400">Hosted by</p>
                <p className="text-sm font-semibold text-gray-700">{listing.owner?.username || 'Anonymous'}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h2 className="font-semibold text-gray-800 mb-3">About this place</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
            </div>

            {/* Map */}
            {listing.geometry && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <h2 className="font-semibold text-gray-800 mb-4">Where you'll be</h2>
                {!import.meta.env.VITE_MAPBOX_TOKEN ? (
                  <div className="rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm" style={{ height: '320px' }}>
                    <span>Map unavailable — Mapbox token not configured</span>
                  </div>
                ) : (
                  <div id="map" className="rounded-xl overflow-hidden" style={{ height: '320px' }}></div>
                )}
              </div>
            )}

            {/* Review Form */}
            {canReview && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <h2 className="font-semibold text-gray-800 mb-5">Leave a Review</h2>
                {reviewErrors.submit && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm">{reviewErrors.submit}</div>
                )}
                <form onSubmit={handleReviewSubmit} noValidate>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Your rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button"
                          onClick={() => setReviewData(prev => ({ ...prev, rating: star.toString() }))}
                          className={`text-3xl transition-transform hover:scale-110 ${
                            parseInt(reviewData.rating) >= star ? 'text-amber-400' : 'text-gray-200'
                          }`}>
                          ★
                        </button>
                      ))}
                    </div>
                    {reviewErrors.rating && <p className="text-red-500 text-xs mt-1.5">{reviewErrors.rating}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Comment</label>
                    <textarea name="comment" rows="4" value={reviewData.comment} onChange={handleReviewChange}
                      placeholder="Share your experience..."
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none
                        ${reviewErrors.comment ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-red-400 focus:bg-white'}`} />
                    {reviewErrors.comment && <p className="text-red-500 text-xs mt-1.5">{reviewErrors.comment}</p>}
                  </div>

                  <button type="submit" disabled={isSubmittingReview}
                    className="px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' }}>
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div>
              <h2 className="font-semibold text-gray-800 mb-4">
                Reviews
                {listing.reviews?.length > 0 && (
                  <span className="ml-2 text-sm text-gray-400 font-normal">({listing.reviews.length})</span>
                )}
              </h2>
              {!listing.reviews?.length ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <p className="text-gray-500 text-sm">No reviews yet.{canReview && ' Be the first!'}</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {listing.reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                            style={{ background: 'linear-gradient(135deg, #4ecdc4, #2980b9)' }}>
                            {review.author?.username?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span className="font-medium text-sm text-gray-700">{review.author?.username}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      {user && user._id === review.author?._id && (
                        <button onClick={() => handleDeleteReview(review._id)}
                          className="mt-3 text-xs text-red-400 hover:text-red-600 transition-colors">
                          Delete review
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Price Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 shadow-sm">
              <div className="mb-1">
                <span className="text-3xl font-bold text-gray-800">₹{listing.price.toLocaleString('en-IN')}</span>
                <span className="text-gray-400 text-sm ml-1">/ night</span>
              </div>
              <p className="text-xs text-gray-400 mb-6">+ taxes & fees</p>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-location-dot text-red-400 text-xs"></i>
                  </div>
                  <span>{listing.location}, {listing.country}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-user text-blue-400 text-xs"></i>
                  </div>
                  <span>{listing.owner?.username || 'Anonymous'}</span>
                </div>
                {avgRating && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-star text-amber-400 text-xs"></i>
                    </div>
                    <span>{avgRating} · {listing.reviews.length} review{listing.reviews.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {!user ? (
                <Link to="/user/login" className="block w-full py-3.5 text-center rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' }}>
                  Login to Book
                </Link>
              ) : isOwner ? (
                <Link to={`/listings/${listing._id}/edit`} className="block w-full py-3.5 text-center rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' }}>
                  Edit Listing
                </Link>
              ) : (
                <button className="w-full py-3.5 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' }}>
                  Reserve
                </button>
              )}
              <p className="text-center text-xs text-gray-400 mt-3">You won't be charged yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};