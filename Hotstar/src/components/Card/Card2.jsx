import React, { useState } from 'react';
import styles from './Card.module.css';
import { Link } from 'react-router-dom';
// import { show } from '../../pages/Studio/Studio'
// import { studio } from '../../content/contect'

const Card2 = (props) => {
    const [hover, setHover] = useState(false);

    const isHover = () => {
        setHover(true);
    };
    const notHover = () => {
        setHover(false);
    };

    const change = {
        backgroundImage: hover ? `url(${props.himg})` : `url(${props.bg})`
    };

    const path = `/studio?studio_name=${props.studio}`;


    return (

        <Link to={path} aria-label={props.studio} onClick={() => { if (typeof props.stu === 'function') props.stu(); }}>
            <div className={styles.card2} onMouseEnter={isHover}
                onMouseLeave={notHover} style={change}
            >



            </div>
        </Link>
    );
};

export default Card2;
