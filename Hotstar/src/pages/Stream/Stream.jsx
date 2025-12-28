import React from 'react'

const Stream = (props) => {
    const id = `https://www.vidking.net/embed/${props.tid}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`
    // const id = "https://stream.techinmind.space/embed/tv/66732/1/1?key=e11a7debaaa4f5d25b671706ffe4d2acb56efbd4"
    return (
        <div>
            {/* <h1 style={{ color: 'white' }}>hello</h1> */}
            <iframe
                src={id}
                width="100%"
                height="900"
                frameBorder="0"
                allow="fullscreen; autoplay"
                allowFullScreen
                title="Video Player"
            />

            {/* <iframe id="vidFreme" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-scripts allow-top-navigation-by-user-activation" allowfullscreen="">
            </iframe> */}



            {/* </iframe> */}
            {/* <iframe src="https://www.vidking.net/embed/movie/1078605" width="100%" height="800" frameborder="0" allowfullscreen='true'> </iframe> */}
        </div>
    )
}

export default Stream
