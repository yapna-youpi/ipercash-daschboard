import React from 'react'
import {useHistory} from 'react-router-dom';

import './error.css'

function Error() {
    let history=useHistory()

    return (
        <div id="notfound" className="notfound">
            <div id="error">
                <div className="error">
                    <div className="first">
                        <div className="image"></div>
                    </div>
                    <div className="second">
                        <h1>404</h1>
                        <h3>OOPS! SOMETHING WENT WRONG</h3>
                        <p>
                            Sorry but the page you are looking for don't exist
                        </p>
                        <span onClick={()=>history.push('/')} >Back to home page</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Error