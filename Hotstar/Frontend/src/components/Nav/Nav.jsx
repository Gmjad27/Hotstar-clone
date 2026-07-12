import React, { useMemo, useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

const Nav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Read user from localStorage once
  const username = useMemo(() => {
    try {
      const rawUser = localStorage.getItem('user');
      return rawUser ? JSON.parse(rawUser) : null;
    } catch {
      return null;
    }
  }, []);

  const profilePath = useMemo(() => {
    return username?.id && username?.name
      ? `/profile?user=${encodeURIComponent(username.name)}`
      : '/profile';
  }, [username]);

  const navItems = useMemo(() => [
    { to: '/', label: 'Home' },
    { to: '/tv', label: 'TV Shows' },
    { to: '/movies', label: 'Movies' },
  ], []);

  // Close mobile menu on route change (by listening to location)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location?.pathname]); // if used inside router, but we can use useLocation() – we'll add that.

  // Actually, to detect route change we should use useLocation().
  // Since this is a standalone component, we'll rely on NavLink's isActive and the menu toggle,
  // but it's better to close on any link click. We'll just handle in JSX.

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-white' : 'text-gray-300 hover:text-gray-100'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block w-full px-4 py-3 text-center text-base font-medium rounded-lg transition ${
      isActive ? 'text-white bg-white/10' : 'text-gray-300 hover:bg-white/5'
    }`;

  return (
    <>
      {/* ---- DESKTOP TOP NAVIGATION ---- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-sm hidden md:block">
        <div className="max-w-[1920px] mx-auto flex items-center h-16 px-12">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 mr-10">
            <img src="cineflix.svg" alt="Cineflix" className="h-8 md:h-9" />
          </Link>

          {/* Primary Navigation Links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClass}
                end={item.to === '/'}
              >
                <span className="px-3 py-2 block">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="ml-auto flex items-center gap-4">
            <NavLink to="/search" className="text-gray-300 hover:text-white transition">
              <i className="fa-solid fa-magnifying-glass text-xl" />
            </NavLink>
            <NavLink to={profilePath} className="relative flex items-center">
              {username?.profilePic ? (
                <img
                  src={username.profilePic}
                  alt="Profile"
                  className="w-7 h-7 rounded-sm object-cover"
                />
              ) : (
                <div className="w-7 h-7 bg-red-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                  {(username?.name || 'G')[0].toUpperCase()}
                </div>
              )}
            </NavLink>
          </div>
        </div>
      </header>

      {/* ---- MOBILE TOP BAR ---- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-between h-14 px-4 md:hidden">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src="cineflix.svg" alt="Cineflix" className="h-7" />
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <NavLink to="/search" className="text-gray-300 hover:text-white transition">
            <i className="fa-solid fa-magnifying-glass text-lg" />
          </NavLink>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-white transition"
            aria-label="Menu"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`} />
          </button>
        </div>
      </header>

      {/* ---- MOBILE MENU DRAWER ---- */}
      {mobileMenuOpen && (
        <div className="fixed top-14 left-0 right-0 bottom-0 bg-black/95 backdrop-blur-md z-40 flex flex-col items-center pt-6 md:hidden">
          <nav className="flex flex-col items-center w-full max-w-xs gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={mobileLinkClass}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to={profilePath}
              className={mobileLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </NavLink>
          </nav>
        </div>
      )}

      {/* Spacer to offset fixed header */}
      <div className="h-16 hidden md:block" />
      <div className="h-14 md:hidden" />
    </>
  );
};

export default React.memo(Nav);