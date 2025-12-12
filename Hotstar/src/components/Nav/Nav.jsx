import React from 'react'
// import pop from '../../assets/popcorn.svg'
import './Nav.css'
import { Link } from 'react-router-dom'

const Nav = () => {
    return (
        <div className='nav'>
            <div className="logos">
                <div className="img">CINE<span style={{ color: 'red' }}>FLIX</span></div>
                <Link to='/' className='l'>
                    <div className="la">
                        <button><i className="fa-solid fa-house"></i></button><p>HOME</p>
                    </div>
                </Link>

                <Link to='/search' className='l'>
                    <div className="la">
                        <button><i className="fa-solid fa-magnifying-glass"></i></button><p>SEARCH</p>
                    </div>
                </Link>

                <Link to='/tv' className='l'>
                    <div className="la">
                        <button><i className="fa-solid fa-tv"></i></button><p>TV</p>
                    </div>
                </Link>
                <Link to='/movies' className='l'>
                    <div className="la">
                        <button><i className="fa-solid fa-clapperboard"></i></button><p>MOVIE</p>
                    </div>
                </Link>
                <Link to='/profile' className='l'>
                    <div className="la">
                        <button><i className="fa-brands fa-product-hunt"></i></button><p>Profile</p>
                    </div>
                </Link>

            </div>

        </div>
    )
}

export default Nav
