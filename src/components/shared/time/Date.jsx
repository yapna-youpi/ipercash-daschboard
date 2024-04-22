import React, { useState } from 'react'
import { periods } from '../../../functions/utilsFunctions'

import './date.css'


const Period = ({ change, start = "Mensuelle" }) => {
    const [state, setState] = useState(start)
    const ref = React.createRef()

    const toogleList = () => ref.current.classList.toggle('show')
    const selectTime = (label, period) => {
        setTimeout(() => setState(label), 500)
        change(period)
        toogleList()
    }
    // console.log("les props ", time)

    return (
        <div className="choose-time">
            <div className="dropdown" onClick={toogleList} > <h4>{state}</h4> <span /> </div>
            <div ref={ref} className="countries-list">
                <div className="time" onClick={() => selectTime("Journaliere", periods.day)}  >
                    <h4>Journaliere</h4>
                </div>
                <div className="time" onClick={() => selectTime("Hebdomaire", periods.week)} >
                    <h4>Hebdomaire</h4>
                </div>
                <div className="time" onClick={() => selectTime("Mensuelle", periods.month)} >
                    <h4>Mensuelle</h4>
                </div>
                <div className="time" onClick={() => selectTime("Toutes", periods.all)} >
                    <h4>Toutes</h4>
                </div>
            </div>
        </div>
    )
}


export default Period
