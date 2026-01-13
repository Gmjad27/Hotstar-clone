// import React from 'react'
import styles from './profile.module.css'
import { Data } from '../../content/movie'
import Card from '../../components/Card/Card'
import { useState } from 'react'

const Profile = (props) => {
    // const [username, setusername] = useState(()=>{
    //     return localStorage.getItem("user")
    // });

    // setusername(username.name)

    const username = JSON.parse(localStorage.getItem('user'));

    return (
        <div className={styles.con}>
            {/* <h1>Profile</h1> */}
            <div className={styles.wraper}>

                <div className={styles.info}>

                    <div className={styles.p_img}></div>
                    <h3>{username.name.toUpperCase()}</h3>
                </div>
                <div className={styles.log}>
                    <button onClick={() => {

                        localStorage.clear();
                        window.location.href = "/login";


                    }}>LOGOUT</button>
                </div>
            </div><br /><br /><br /><br /><br /><br /><br /><br />
            <h1>Watch List</h1>
            <br /><br /><br /><br />
            <div className={styles.wList}>

                {
                    Data.map((keys) => {
                        // console.log(props.E);

                        if (props.E.includes(keys.id)) {
                            return (<Card sow={(i) => {
                                sow(i);
                            }} id={keys.id} name={keys.name2} img={keys.name} ry={keys.releaseYear}
                                ua={keys.ua} lan={keys.language.length} desc={keys.desc}
                                s={keys.season} type={keys.type} tid={keys.tmdbId} add={(e) => { props.add(e) }}
                                e={props.e} play={(tid) => { props.play(tid) }}
                            />)
                        }
                    })
                }
            </div>

        </div>
    )
}

export default Profile
