import React, { useMemo } from 'react';
import './Banner.css';
import { mediaData } from '../../content/contect';
import { Link } from 'react-router-dom';

const Banner = (props) => {
    const previewImages = useMemo(
        () => mediaData.slice(0, 5).map((item) => item.name),
        []
    );

    const languageLabel = props.lan > 1 ? 'Languages' : 'Language';
    const streamId =
        props.type === 'movie'
            ? `${props.type}/${props.tid}`
            : `${props.type}/${props.tid}/1/1`;

    return (
        <>
            <div className="con">
                <div className="information">

                    <img src={props.name} className="name" alt={props.desc ? `${props.desc.slice(0, 32)}...` : 'Title'} />
                    <div className="info">
                        <span> {props.ry} </span>
                        <span> {props.ua} </span>
                        <span> {props.season} </span>
                        <span> {props.lan} {languageLabel} </span>
                    </div><br />
                    <div className="desc">{props.desc}</div>
                    <br />
                    <div className="info">
                        {props.cat?.map((key, index) => (
                            <span key={`${key}-${index}`}>{key}</span>
                        ))}
                    </div>
                    <br />
                    <div className="con2">
                        <div className="btn">
                            <Link to={'/stream'}>
                                <button className="watch" onClick={() => props.play(streamId)}>Watch Now</button>
                            </Link>
                            <button
                                className="add"
                                onClick={() => props.add(props.id)}
                                aria-label="Add to watch list"
                            >
                                +
                            </button>
                        </div>
                        <div className="sug">
                            {previewImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`imgs ${props.activePreviewIndex === index ? 'active-img' : ''}`}
                                    id={`img${index + 1}`}
                                    style={{ backgroundImage: `url(${image})` }}
                                ></div>
                            ))}
                            <div className='ex'></div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Banner;
