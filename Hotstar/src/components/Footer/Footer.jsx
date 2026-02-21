import React from 'react';
import './Footer.css';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className='footer'>
            <div className="sec">
                <h3>Company</h3>
                <p>About Us</p>
                <p>Careers</p><br /><br />
                <p>&copy; {year} GIRISH JADAV M. All Rights Reserved.</p>
                <p>Just a college project. Not promoting piracy.</p>
                <p>Terms of Use Privacy Policy FAQ</p>
            </div>

            <div className="sec">
                <h3>View Website In</h3>
                <p>English</p>
            </div>

            <div className="sec">
                <h3>Need Help?</h3>
                <p>Visit Help Center</p>
                <p>Share Feedback</p>
            </div>

            <div className="sec">
                <h3>Connect With Us</h3>
                <div className="sec1">
                    <div className="f1">
                        <a
                            href="https://www.instagram.com/jadav_girish_27_18/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Instagram"
                        >
                            <h1><i className="fa-brands fa-instagram"></i></h1>
                        </a>
                        <a
                            href="https://x.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="X"
                        >
                            <h1><i className="fa-brands fa-x-twitter"></i></h1>
                        </a>
                    </div>

                    <div className="f1">
                        <a
                            href="https://play.google.com/store"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Google Play"
                        >
                            <div
                                className="l"
                                style={{ backgroundImage: "url('https://img10.hotstar.com/image/upload/f_auto,q_90,w_256/v1661346101/google-playstore')" }}
                            ></div>
                        </a>
                        <a
                            href="https://www.apple.com/app-store/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="App Store"
                        >
                            <div
                                className="l"
                                style={{ backgroundImage: "url('https://img10.hotstar.com/image/upload/f_auto,q_90,w_256/v1661346071/ios-appstore')" }}
                            ></div>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
