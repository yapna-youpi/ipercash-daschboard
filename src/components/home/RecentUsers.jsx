import React, { useState } from 'react'
import Skeleton from '@mui/material/Skeleton'
import { useHistory } from 'react-router-dom'
import dateFormat from 'dateformat'

import { getToApi } from '../../functions/utilsFunctions'

function RecentUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    let history=useHistory()
    React.useEffect(() => {
        getUser()
        setTimeout(() => {
            getUser()
        }, 1200*1000);
    }, [])
    

    const getUser = async () => {
        getToApi('getrecentusers')
            .then(users => {
                // console.log("the users ", users)
                setUsers(users)
                setLoading(false)
            })
            .catch(error => {
                // console.log("can't get user")
                setLoading(false)
            })
    }
    return (
        <div className="recent-users">
            <div className="recent-list">
                {loading ? (<Skel variant="rectangular" heigth={500} />) : (<>
                    <div className="title">
                    <h3 onClick={getUser}>Dernierers Inscriptions</h3>
                    <button onClick={()=>history.push('/users')}>Voir tout</button>
                    </div>
                    <div className="users-list">
                        {!users.length && (<h3>Encore aucune inscription effectuee aujourd'hui</h3>)}
                        {users.map((item, i) => <User data={item} key={`tx-${i}`} />)}
                    </div>
                </>)}
            </div>
        </div>
    )
}

export default RecentUsers

const Skel = ({ variant, width = null, heigth = 30 }) => <Skeleton animation="wave" variant={variant} height={heigth} width={width} />

const User = ({ data }) => {
    return (
        <div className="recent-user">
            <div><b>{dateFormat(data.created_at, "dddd dd yyyy, hh:MM")}</b></div>
            {/* <div>{data.id}</div> */}
            <div>{data.name}</div>
            <div>{data.email}</div>
            <div>{data.phone}</div>
            <div>{data.country.split('_')[0]}</div>
            <div>{data.active ? "Actif" : "Inactif"}</div>
        </div>
    )
}
