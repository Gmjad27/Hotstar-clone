import React from 'react'
import pop from '../../assets/popcorn.svg'
import './Nav.css'
import { Link } from 'react-router-dom'

const Nav = () => {
    return (
        <div className='nav'>
            <div className="img"></div>
            <div className="logos">
                <Link to='/'>
                    <button><i className="fa-solid fa-house"></i></button>
                </Link>
                <Link>
                    <button><i className="fa-solid fa-magnifying-glass"></i></button>
                </Link>
                <Link to='/tv'>
                    <button><i className="fa-solid fa-tv"></i></button>
                </Link>
                <Link to='/movies'>
                    <button><i className="fa-solid fa-clapperboard"></i></button>
                </Link>
                <Link>
                    <button><i className="fa-solid fa-person-running"></i></button>
                </Link>
                <Link>
                    <button><i className="fa-solid fa-video"></i></button>
                </Link>
                <Link>
                    <button><i className="fa-solid fa-table-list"></i></button>
                </Link>

            </div>

        </div>
    )
}

export default Nav
