import React, { useState, useEffect, useRef } from 'react'
import { BiSearchAlt, BiChevronRight } from 'react-icons/bi'
import dateFormat from 'dateformat'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import ReactLoading from 'react-loading'

import './users.css'
import { getToApi, postToApi } from '../../functions/utilsFunctions'

import Skel from '../shared/skeleton/Skel';
import UsersGraph from './UsersGraph'
// import UserDetails from './UserDetails'
import { useHistory } from 'react-router-dom'

function Users() {
    const [Users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const myRef = useRef(null)
    const history = useHistory()
    useEffect(() => {
        getUsers()
    }, [])
    const getUsers = () => {
        setLoading(true)
        getToApi('getusers').then(users => {
            // console.log("the users ", users)
            setUsers(users)
            setLoading(false)
        })
    }
    const selectUser = (user) => {
        // console.log("s user ", user)
        // setUser(user)
        // setModal(true)
        history.push('/user/:' + user.id, user)
    }
    const showedUsers = () => Users.filter(item => item.name.toLowerCase().includes(filter))

    return (
        <div className="users" ref={myRef}>
            <div className="users-graph users-container mv">
                {Users.length && <UsersGraph users={Users} />}
            </div>
            <div className="users-container">
                <div className="users-head">
                    <div className="search-bar">
                        <BiSearchAlt color='#0f394d8c' size={30} />
                        <input type="text" placeholder='Chercher un utilisateur' onChange={e=>setFilter(e.target.value)} />
                    </div>
                    <h2>Liste des utilisateurs </h2>
                </div>
                <h3>{Users.length ? `${showedUsers().length} Utilisateurs` : ''}</h3>
                <div className="users-list">
                    {
                        loading ? <><Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /></>
                            : Users.length ? (showedUsers().map(user => <UserRow data={user} select={selectUser} />))
                                : <center><h2>Aucun utilisateur</h2></center>
                    }
                </div>
            </div>
        </div>
    )
}


const UserRow = ({ data, select }) => {
    // console.log("the data ", data)
    return (
        <div className="user-row" onClick={() => select(data)}>
            <div className="s1">
                <span className="abr">{data.name[0]}</span>
                <div className="">
                    <h3>{data.name}</h3>
                    <span>{data.email}</span>
                </div>
            </div>
            <div className="s2">
                <h3>{`${data.phone} (${data.country.split('_')[1]})`}</h3>
                <span>{dateFormat(data.created_at, "dddd, d mmmm, yyyy")}</span>
            </div>
            <div className="s3">
                <BiChevronRight color='#0f394d81' size={25} />
            </div>
        </div>
    )
}

export default Users