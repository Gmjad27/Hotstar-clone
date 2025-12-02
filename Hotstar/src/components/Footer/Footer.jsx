import React from 'react'
import './Footer.css'

const Footer = () => {
    return (
        <div className='footer'>
            <div className="sec">
                <h3>Company</h3>

                <p>About Us</p>
                <p>Careers</p><br /><br />
                <p>&copy; 2025 STAR. All Rights Reserved.</p>
                <p>Terms Of Use Privacy Policy FAQ</p>
            </div>
            <div className="sec">
                <h3>View Website in</h3>
                <p>✔ English</p>
            </div>
            <div className="sec">
                <h3>Need Helps?</h3>
                <p>Visit help Center</p>
                <p>Share Feedback</p>
            </div>
            <div className="sec">
                <h3>Connect with Us</h3>

                <div className="f1">
                    <h1><i class="fa-brands fa-facebook-f"></i></h1>
                    <h1><i class="fa-brands fa-x-twitter"></i></h1>
                </div>

                <div className="f1">

                    <div className="l" style={{ backgroundImage: "url('https://img10.hotstar.com/image/upload/f_auto,q_90,w_256/v1661346101/google-playstore')" }}></div>
                    <div className="l" style={{ backgroundImage: "url('https://img10.hotstar.com/image/upload/f_auto,q_90,w_256/v1661346071/ios-appstore')" }}></div>
                </div>
            </div>
        </div>
    )
}

export default Footer
