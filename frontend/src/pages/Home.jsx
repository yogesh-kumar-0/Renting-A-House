import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const destinations = [
  { name: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80', country: 'Indonesia' },
  { name: 'Santorini', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80', country: 'Greece' },
  { name: 'Kyoto', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80', country: 'Japan' },
  { name: 'Maldives', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80', country: 'Maldives' },
  { name: 'Tuscany', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80', country: 'Italy' },
  { name: 'Swiss Alps', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', country: 'Switzerland' },
];

const features = [
  {
    icon: 'fa-solid fa-map-location-dot',
    color: '#ff6b6b',
    bg: '#fff5f5',
    title: 'Explore Anywhere',
    desc: 'Browse thousands of unique stays worldwide — from hidden cottages to overwater villas.',
    img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
  },
  {
    icon: 'fa-solid fa-star',
    color: '#f59e0b',
    bg: '#fffbeb',
    title: 'Real Reviews',
    desc: 'Honest ratings from real travelers. Make smart decisions with genuine feedback.',
    img: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=600&q=80',
  },
  {
    icon: 'fa-solid fa-house',
    color: '#4ecdc4',
    bg: '#f0fdf4',
    title: 'List Your Space',
    desc: 'Turn your property into income. List in minutes and reach millions of travelers.',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Listings', display: 'K+', divisor: 1000, animate: true },
  { value: 150, suffix: '+', label: 'Countries', display: null, divisor: null, animate: true },
  { value: null, static: '2M+', label: 'Travelers' },
  { value: null, static: '4.9★', label: 'Avg Rating' },
];

function useCountUp(target, duration = 1800, start = false) {
  const from = Math.floor(target * 0.75); // start at 75% of target
  const [count, setCount] = useState(from);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(from + ease * (target - from));
      setCount(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

const StatCard = ({ stat, started }) => {
  const raw = useCountUp(stat.animate ? stat.value : 0, 2200, started);
  let display;
  if (!stat.animate) {
    display = stat.static;
  } else if (stat.divisor) {
    display = (raw / stat.divisor).toFixed(0) + stat.display;
  } else {
    display = raw + stat.suffix;
  }
  return (
    <div className="stat-card bg-white border border-gray-100 rounded-2xl px-6 py-4 text-center shadow-sm min-w-[90px]">
      <div className="text-2xl font-black text-gray-900">{display}</div>
      <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
    </div>
  );
};

export const Home = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsStarted(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white font-sans">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .fade-up { opacity: 0; }
        .fade-up.show { animation: fadeUp 0.7s ease forwards; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.18s; }
        .d3 { animation-delay: 0.32s; }
        .d4 { animation-delay: 0.46s; }
        .d5 { animation-delay: 0.60s; }

        .dest-card { transition: transform 0.35s ease, box-shadow 0.35s ease; cursor: pointer; }
        .dest-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }

        .feature-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }

        .hero-badge {
          background: linear-gradient(90deg, #ff6b6b, #ee5a24, #ff6b6b);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-card { transition: transform 0.3s ease; }
        .stat-card:hover { transform: translateY(-4px); }

        .scroll-gallery { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; scroll-snap-type: x mandatory; }
        .scroll-gallery::-webkit-scrollbar { height: 4px; }
        .scroll-gallery::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .scroll-gallery::-webkit-scrollbar-thumb { background: #ff6b6b; border-radius: 4px; }
      `}</style>

      {/* ── HERO ── */}
      <section className=" py-20 px-6 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,107,107,0.12), transparent 70%)' }}></div>
        <div className="absolute bottom-[-40px] left-[-40px] w-60 h-60 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(78,205,196,0.1), transparent 70%)' }}></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`fade-up d1 ${visible ? 'show' : ''} inline-flex items-center gap-2 bg-white border border-red-200 rounded-full px-4 py-1.5 mb-7 shadow-sm`}>
            <span className="w-2 h-2 bg-red-500 rounded-full inline-block" style={{ animation: 'float 2s ease-in-out infinite' }}></span>
            <span className="text-xs text-gray-600 font-medium">10,000+ listings across 150+ countries</span>
          </div>

          <h1 className={`fade-up d2 ${visible ? 'show' : ''} text-5xl md:text-7xl font-black text-gray-900 mb-5 leading-tight tracking-tight`}>
            Welcome to{' '}
            <span className="hero-badge">WanderLust</span>
          </h1>

          <p className={`fade-up d3 ${visible ? 'show' : ''} text-lg text-gray-700 leading-relaxed mb-4 max-w-2xl mx-auto`}>
            Discover amazing places and create unforgettable memories
          </p>

          {user ? (
            <p className={`fade-up d3 ${visible ? 'show' : ''} text-base text-gray-600 mb-9`}>
              Welcome back, <strong className="text-gray-900">{user.username}</strong>! Ready for your next adventure?
            </p>
          ) : (
            <p className={`fade-up d3 ${visible ? 'show' : ''} text-base text-gray-600 mb-9`}>
              Start exploring or create your own listing
            </p>
          )}

          <div className={`fade-up d4 ${visible ? 'show' : ''} flex gap-3 justify-center flex-wrap mb-12`}>
            <Link to="/listing" className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-base no-underline shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Explore Listings
            </Link>
            {user ? (
              <Link to="/listing/new" className="px-8 py-3.5 rounded-2xl bg-white text-gray-700 font-semibold text-base no-underline border border-gray-300 transition-all hover:border-red-500 hover:text-red-500">
                + Add Your Place
              </Link>
            ) : (
              <>
                <Link to="/user/signup" className="px-8 py-3.5 rounded-2xl bg-white text-gray-700 font-semibold text-base no-underline border border-gray-300 transition-all hover:border-red-500 hover:text-red-500">
                  Sign Up Free
                </Link>
                <Link to="/user/login" className="px-8 py-3.5 rounded-2xl bg-gray-900 text-white font-semibold text-base no-underline transition-all">
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Stats row — counting animation */}
          <div ref={statsRef} className={`fade-up d5 ${visible ? 'show' : ''} flex justify-center gap-2 flex-wrap`}>
            {stats.map((s, i) => (
              <StatCard key={i} stat={s} started={statsStarted} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATION GALLERY ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-3">
            <div>
              <p className="text-xs tracking-wider uppercase text-red-500 font-bold mb-2">Explore</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-0 tracking-tight">
                Popular Destinations
              </h2>
            </div>
            <Link to="/listing" className="text-red-500 font-semibold text-sm no-underline flex items-center gap-1.5">
              View all <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>

          <div className="scroll-gallery">
            {destinations.map((d, i) => (
              <Link key={i} to={`/listing?search=${d.name}`} className="no-underline flex-shrink-0 snap-start">
                <div className="dest-card w-56 h-72 rounded-3xl overflow-hidden relative shadow-lg">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }}></div>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-base mb-0">{d.name}</p>
                    <p className="text-white/75 text-xs mb-0">{d.country}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-wider uppercase text-red-500 font-bold mb-2">Why WanderLust</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Everything you need to travel smarter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="feature-card bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="h-56 overflow-hidden">
                  <img src={f.img} alt={f.title} className="w-full h-full object-cover transition-transform hover:scale-108 duration-500"
                    onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                </div>
                <div className="p-6">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4`} style={{ background: f.bg }}>
                    <i className={f.icon} style={{ color: f.color, fontSize: '18px' }}></i>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!user && (
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 rounded-3xl px-10 py-16 text-center relative overflow-hidden">
              <div className="absolute top-[-40px] right-[-40px] w-56 h-56 bg-white/8 rounded-full"></div>
              <div className="absolute bottom-[-60px] left-[-30px] w-60 h-60 bg-white/5 rounded-full"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                  Ready to start your adventure?
                </h2>
                <p className="text-white/80 mb-9 text-base">
                  Join millions of travelers discovering the world differently.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link to="/user/signup" className="px-9 py-3.5 rounded-2xl bg-white text-orange-500 font-bold text-base no-underline shadow-lg hover:shadow-xl transition-all">
                    Get Started Free
                  </Link>
                  <Link to="/listing" className="px-9 py-3.5 rounded-2xl bg-transparent text-white font-semibold text-base no-underline border border-white/50 transition-all hover:bg-white/10">
                    Browse Listings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};