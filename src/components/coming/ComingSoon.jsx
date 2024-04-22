import React from 'react'

import './comingsoon.css'
import image from './mechanical-gears.svg';

function ComingSoon() {
    return (
        <div id="coming" className="coming">
            <img src={image} alt=""/>
            <div className="">
                <br /> <br />
                <h1>THIS FEATURE IS COMING SOON</h1>
                {/* <h3> join waiting list </h3> */}
                {/* <div className="form">
                    <input type="email" placeholder="email"/>
                    <button> notify me </button>
                </div>
                <span> Back to home page </span> */}
                <br /> <br /><br /><br /><br /><br /><br /><br />
            </div>
        </div>
    )
}

export default ComingSoon
