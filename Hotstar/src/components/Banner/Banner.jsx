import React from 'react'
import './Banner.css'
import { mediaData } from '../../content/contect'

// console.log(mediaData);

const arr = [];




const Banner = (props) => {


    return (
        <>
            <div className="con">
                <img src={props.name} className="name" />
                <div className="info">
                    <span> {props.ry} </span>
                    <span> {props.ua} </span>
                    <span> {props.season} </span>
                    <span> {(props.lan)} Language </span>
                </div><br />
                <div className="desc">{props.desc}</div>
                <br /><div className="info">
                    {props.cat}
                </div><br />
                <div className="con2">
                    <div className="btn">
                        <button className="watch">Watch Now</button>
                        <button className="add">+</button>
                    </div>
                    <div className="sug">
                        {
                            mediaData.map((key) => {
                                arr.push(key.img)
                            })}
                        <div className="imgs" id='img1' style={{ backgroundImage: `url(${arr[0]})` }}></div>
                        <div className="imgs" id='img2' style={{ backgroundImage: `url(${arr[1]})` }}></div>
                        <div className="imgs" id='img3' style={{ backgroundImage: `url(${arr[2]})` }}></div>
                        <div className="imgs" id='img4' style={{ backgroundImage: `url(${arr[3]})` }}></div>
                        <div className="imgs" id='img5' style={{ backgroundImage: `url(${arr[4]})` }}></div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default Banner
