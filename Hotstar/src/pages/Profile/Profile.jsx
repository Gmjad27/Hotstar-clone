import React from 'react'
import styles from './profile.module.css'
import { Data } from '../../content/movie'
import Card from '../../components/Card/Card'

const Profile = () => {
    return (
        <div className={styles.con}>
            <h1>Profile</h1>
            <div className={styles.wraper}>

                <div className={styles.info}>

                    <div className={styles.p_img}></div>
                    <h3>Jadav Girish</h3>
                </div>
                <div className={styles.log}>
                    <button>LOGOUT</button>
                </div>
            </div><br /><br /><br /><br /><br /><br /><br /><br />
            <h1>Watch List</h1>
<br /><br /><br /><br />
            <div className={styles.wList}>

                {
                    Data.map((keys) => {
                        if (keys.id > 50 && keys.id < 55) {
                            return <Card id={keys.id} img={keys.name} ry={keys.releaseYear} ua={keys.ua} lan={keys.language.length} desc={keys.desc} s={keys.season} />
                        }
                    })
                }
            </div>

        </div>
    )
}

export default Profile
