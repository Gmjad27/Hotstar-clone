import React, { useState } from 'react'
import './Banner.css'
import { mediaData } from '../../content/contect'
import { Link } from 'react-router-dom';

// console.log(mediaData);

const arr = [];




const Banner = (props) => {

    return (
        <>
            <div className="con">
                <div className="information">

                    <img src={props.name} className="name" />
                    <div className="info">
                        <span> {props.ry} </span>
                        <span> {props.ua} </span>
                        <span> {props.season} </span>
                        <span> {(props.lan)} Language </span>
                    </div><br />
                    <div className="desc">{props.desc}</div>
                    <br />
                    <div className="info">
                        {props.cat?.map((key, index) => (
                            <span key={index}>{key}</span>
                        ))}
                    </div>
                    <br />
                    <div className="con2">
                        <div className="btn">
                            <Link to={'/stream'}>
                                <button className="watch" onClick={() => {
                                    props.play(props.type === 'movie' ? `${props.type}/${props.tid}` : `${props.type}/${props.tid}/1/1`)

                                    console.log(props.tid);

                                }}>Watch Now</button>
                            </Link>
                            <button className="add" onClick={() => {
                                // alert('hello')
                                props.add(props.id);
                            }}>+</button>
                        </div>
                        <div className="sug">
                            {
                                mediaData.map((key) => {
                                    arr.push(key.name)
                                })}
                            <div className="imgs" id='img1' style={{ backgroundImage: `url(${arr[0]})` }}></div>
                            <div className="imgs" id='img2' style={{ backgroundImage: `url(${arr[1]})` }}></div>
                            <div className="imgs" id='img3' style={{ backgroundImage: `url(${arr[2]})` }}></div>
                            <div className="imgs" id='img4' style={{ backgroundImage: `url(${arr[3]})` }}></div>
                            <div className="imgs" id='img5' style={{ backgroundImage: `url(${arr[4]})` }}></div>
                            <div className='ex'></div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Banner
