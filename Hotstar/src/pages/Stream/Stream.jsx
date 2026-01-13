import React from 'react'

const Stream = (props) => {
    // const id = `https://www.vidking.net/embed/${props.tid}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`
    // const id = `https://stream.techinmind.space/embed/${props.tid}?key=e11a7debaaa4f5d25b671706ffe4d2acb56efbd4`
    const id = `https://vidsrc.cc/v2/embed/${props.tid}`
    return (
        <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* <h1 style={{ color: 'white' }}>hello</h1> */}
            {/* <iframe
                src={id}
                width="100%"
                height="900"
                frameBorder="0"
                allow="fullscreen; autoplay"
                allowFullScreen
                title="Video Player"
            /> */}

            <iframe src={id} class="w-full h-full" width="100%"
                height="750"
                frameborder="0" allowfullscreen="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-top-navigation-by-user-activation"
                title="VidsrcCC">
            </iframe>

            {/* <iframe src="https://vidsrc.cc/v2/embed/movie/310307"
                className="w-full h-full" frameborder="0" allowfullscreen=""
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-top-navigation-by-user-activation" title="VidsrcCC"></iframe> */}

            {/* <iframe style={{ height: '100%', width: '100%', overflow: 'hidden', alignItems: 'center' }} src={id}
                frameborder="0" scrolling="no" allow="autoplay; encrypted-media" allowfullscreen="">
            </iframe> */}


            {/* <iframe id="vidFreme" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-scripts allow-top-navigation-by-user-activation" allowfullscreen="">
            </iframe> */}



            {/* </iframe> */}
            {/* <iframe src="https://www.vidking.net/embed/movie/1078605" width="100%" height="800" frameborder="0" allowfullscreen='true'> </iframe> */}
        </div>
    )
}

export default Stream
