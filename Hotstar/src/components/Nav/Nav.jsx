import React from 'react'
import pop from '../../assets/popcorn.svg'
import './Nav.css'

const Nav = () => {
    return (
        <div className='nav'>
            <div className="img"></div>
            <div className="logos">
                <button><i className="fa-solid fa-house"></i></button>
                <button><i className="fa-solid fa-magnifying-glass"></i></button>
                <button><i className="fa-solid fa-tv"></i></button>
                <button style={{backgroundImage:`url(${pop})`,backgroundPosition:'center',backgroundSize:'cover'}}><i className="fa-solid fa-clapperboard"></i></button>
                <button><i className="fa-solid fa-person-running"></i></button>
                <button><i className="fa-solid fa-video"></i></button>
                <button><i className="fa-solid fa-table-list"></i></button>
                <button></button>
            </div>

        </div>
    )
}

export default Nav
