import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { listingsAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const FILTERS = [
  { icon: 'fa-solid fa-fire', label: 'Trending' },
  { icon: 'fa-solid fa-bed', label: 'Rooms' },
  { icon: 'fa-solid fa-mountain-city', label: 'Iconic City' },
  { icon: 'fa-solid fa-mountain', label: 'Mountains' },
  { icon: 'fa-brands fa-fort-awesome', label: 'Castles' },
  { icon: 'fa-solid fa-person-swimming', label: 'Amazing Pools' },
  { icon: 'fa-solid fa-campground', label: 'Camping' },
  { icon: 'fa-solid fa-cow', label: 'Farm' },
  { icon: 'fa-solid fa-snowflake', label: 'Arctic' },
];

export const ListingsIndex = () => {
  const [listings, setListings] = useState([]);
  const [liveQuery, setLiveQuery] = useState('');
  const [displayTax, setDisplayTax] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => { fetchListings(); }, []);
  useEffect(() => { setLiveQuery(searchQuery); }, [searchQuery]);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const response = await listingsAPI.getAllListings();
      setListings(response.data.allListings);
      setError('');
    } catch { setError('Failed to load listings'); }
    finally { setIsLoading(false); }
  };

  const filteredListings = liveQuery.trim()
    ? listings.filter(l => {
        const q = liveQuery.toLowerCase();
        return l.location?.toLowerCase().includes(q) || l.country?.toLowerCase().includes(q) || l.title?.toLowerCase().includes(q);
      })
    : listings;

  const formatPrice = (p) => p.toLocaleString('en-IN');
  const getTax = (p) => (p * 1.18).toFixed(0);
  const clearSearch = () => { setLiveQuery(''); setSearchParams({}); };

  const handleCardClick = (e) => {
    if (!user) { e.preventDefault(); navigate('/user/login'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filter bar */}
      <div className="sticky top-16 z-9 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-0.5 overflow-x-auto flex-1 scrollbar-hide">
            {FILTERS.map((filter, i) => (
              <button key={i} className="flex flex-col items-center gap-1 px-4 py-3 bg-transparent border-b-2 border-transparent text-gray-400 text-xs font-medium hover:text-gray-700 hover:border-gray-900 transition-all whitespace-nowrap flex-shrink-0">
                <i className={filter.icon} style={{ fontSize: '16px' }}></i>
                <span className="text-xs font-medium">{filter.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 pr-1">
            {/* Toggle */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setDisplayTax(!displayTax)}>
              <div className="relative w-9 h-5">
                <div className={`w-9 h-5 rounded-full transition-colors ${displayTax ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${displayTax ? 'left-4.5' : 'left-0.5'}`}></div>
              </div>
              <span className="text-xs text-gray-500 font-medium select-none">Taxes</span>
            </div>
            {user && (
              <Link to="/listing/new" className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold no-underline rounded-lg whitespace-nowrap shadow-sm hover:shadow-md transition-all">
                + Add
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search banner */}
        {liveQuery && (
          <div className="flex items-center gap-2.5 mb-6 px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <i className="fa-solid fa-magnifying-glass text-gray-300 text-xs"></i>
            <span className="text-xs text-gray-500">
              <strong className="text-gray-900">{filteredListings.length}</strong> result{filteredListings.length !== 1 ? 's' : ''} for "<strong className="text-gray-900">{liveQuery}</strong>"
            </span>
            <button onClick={clearSearch} className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 bg-transparent border-0 cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-all">
              Clear <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* Guest notice */}
        {!user && (
          <div className="flex items-center gap-2.5 mb-6 px-4 py-3 bg-amber-50 border border-amber-300 rounded-2xl">
            <i className="fa-solid fa-circle-info text-amber-500 text-sm flex-shrink-0"></i>
            <span className="text-xs text-amber-900">
              <Link to="/user/login" className="text-amber-700 font-bold no-underline">Sign in</Link> to view full listing details and make reservations.
            </span>
          </div>
        )}

        {error && <div className="px-4 py-3 bg-red-50 border border-red-300 rounded-2xl text-red-500 text-xs mb-6">{error}</div>}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden">
                <div className="h-56 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-3.5 bg-gray-200 rounded-full w-3/4 mb-2.5 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No listings found</h3>
            <p className="text-sm text-gray-400 mb-6">Try a different location or browse everything</p>
            <button onClick={clearSearch} className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold border-0 rounded-lg cursor-pointer">
              View all listings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredListings.map((listing) => (
              <Link key={listing._id} to={`/listings/${listing._id}`} onClick={handleCardClick}
                className="no-underline text-inherit block">
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-gray-200 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative overflow-hidden h-56">
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    {!user && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity hover:bg-black/5 hover:opacity-100">
                        <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 shadow-md">
                          <i className="fa-solid fa-lock text-red-500 text-xs"></i>
                          Sign in to view
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-3.5">
                    {/* Title */}
                    <p className="font-bold text-sm text-gray-900 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {listing.title}
                    </p>
                    <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                      <i className="fa-solid fa-location-dot text-red-500 text-xs"></i>
                      {listing.location}, {listing.country}
                    </p>
                    <div className="border-t border-gray-100 pt-2.5">
                      <span className="font-black text-base text-gray-900">₹{formatPrice(listing.price)}</span>
                      <span className="text-xs text-gray-400 ml-0.5">/ night</span>
                      {displayTax && (
                        <p className="text-xs text-gray-400 mt-0.5 mb-0">₹{getTax(listing.price)} with GST</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};