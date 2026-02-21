import React from 'react';
// import pop from '../../assets/popcorn.svg'
import './Nav.css';
import { NavLink } from 'react-router-dom';

const Nav = () => {
    const rawUser = localStorage.getItem('user');
    let username = null;

    try {
        username = rawUser ? JSON.parse(rawUser) : null;
    } catch (error) {
        username = null;
    }

    const profilePath =
        username?.id && username?.name
            ? `/profile?user=${encodeURIComponent(username.name)}`
            : '/profile';

    const navItems = [
        { to: '/', icon: 'fa-solid fa-house', label: 'HOME' },
        { to: '/search', icon: 'fa-solid fa-magnifying-glass', label: 'SEARCH' },
        { to: '/tv', icon: 'fa-solid fa-tv', label: 'TV' },
        { to: '/movies', icon: 'fa-solid fa-clapperboard', label: 'MOVIE' },
        { to: profilePath, icon: 'fa-brands fa-product-hunt', label: 'Profile' },
    ];

    return (
        <div className='nav'>
            <div className="logos">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive }) => `l ${isActive ? 'active' : ''}`}
                        end={item.to === '/'}
                    >
                        <div className="la">
                            {/* <button type="button" tabIndex={-1}> */}
                            <p className='button'>
                                <i className={item.icon}></i>
                            </p>
                            {/* </button> */}
                            <p className='name button'>{item.label}</p>
                        </div>
                    </NavLink>
                ))}

            </div>

        </div>
    );
};

export default Nav;
