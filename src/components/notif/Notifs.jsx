import React, { useState, useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css';
import { FaThumbsUp, FaEyeSlash, FaEye } from 'react-icons/fa';
import { useHistory } from 'react-router-dom'

import { getToApi, postToApi, detectOperation } from '../../functions/utilsFunctions';

import './notifs.css'

function Notifs() {
    const [notifs, setNotifs] = useState({ alert: [], problem: [] })
    const [load, setLoad] = useState(true)
    useEffect(() => {
        getNotifs()
    }, [])

    const getNotifs = async () => {
        getToApi('getnotifs')
            .then(notifs=>{
                if(notifs) {
                    let alert = [], problem = []
                    notifs.forEach(notif => {
                        if (notif.type === 'warning') alert.push(notif)
                        else problem.push(notif)
                    })
                    setNotifs({ alert, problem })
                }
            })
    }

    // console.log("the notifs ", notifs)
    return (
        <div className="notifications">
            <h1>Notifications</h1>
            <div className="content">
                <Tabs>
                    <TabList>
                        <Tab>Alertes</Tab>
                        <Tab>Problemes</Tab>
                    </TabList>

                    <TabPanel>
                        <NotifContent notifs={notifs.alert} />
                    </TabPanel>
                    <TabPanel>
                        <NotifContent notifs={notifs.problem} />
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    )
}
const NotifContent=({notifs})=>{
    return (
        <div className="notifs">
            {
               notifs.length ? notifs.map(notif=><Notif data={notif} />) : <h2>Aucun elements ...</h2>
            }
        </div>
    )
}

const Notif = ({ data}) => {
    const [see, setSee]=useState(false)
    let history=useHistory()
    
    const toogleSeen=()=>{
        postToApi('updatenotif', {id: data.transaction_id, params: {see: true}})
        setSee(!see)
    }
    const solve=()=>{
        postToApi('updatenotif', {id: data.transaction_id, params: {solved: true}})
    }
    let op = detectOperation(data.transaction_id)
    return (
        <div className="notif" onClick={()=>history.push('/notification/'+data.transaction_id, data)}>
            <div className={`left ${data.type}`}></div>
            <div className="body">
                <div className="">
                    <h2>{data.transaction_id}</h2>
                    <h3>{op}</h3>
                    <p>{data.message}</p>
                </div>
                <div className="foot">
                    <button className='see' onClick={toogleSeen} >
                        { see ? <FaEyeSlash size={20} color="white" /> : <FaEye size={20} color="white" /> }
                    </button>
                    <button className='solve' onClick={solve}>
                        <FaThumbsUp size={20} color="white" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Notifs