import React, { useState, useEffect, useRef } from 'react'
import { BiSearchAlt, BiChevronRight } from 'react-icons/bi'
import dateFormat from 'dateformat'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import ReactLoading from 'react-loading'

import { useAuth } from '../context/auth'
import { getToApi, postToApi } from '../../functions/utilsFunctions'
import { toastify } from '../shared/toast/Toast'

import './admin.css'
import AddManager from './AddManager'
import Skel from '../shared/skeleton/Skel';

function Admin() {
    let { user } = useAuth()
    const [dUsers, setDUsers] = useState([])
    const [sUser, setSUser] = useState({})
    const [loading, setLoading] = useState(true)
    const [modals, setModals] = useState({ new: false, update: false })
    const [button, setButton] = useState(false)
    const [filter, setFilter] = useState('')
    const myRef = useRef(null)
    useEffect(() => {
        getUsers()
    }, [])
    const getUsers = () => {
        setLoading(true)
        getToApi('getdusers').then(users => {
            setDUsers(users)
            setLoading(false)
        })
    }
    const selectUser = (user) => {
        // console.log("s user ", user)
        setSUser(user)
        setModals({ ...loading, update: true })
    }
    const deleteUser = (id) => {
        setButton(true)
        getToApi('deluser/' + id).then(res => {
            if (res) {
                if (res.success) toastify('success', "utilisateur supprime")
                else toastify('error', "echec de la suppression")
            }
            else toastify('error', "echec de la suppression")
            setButton(false)
            setModals({ ...modals, update: false })
            getUsers()
        })
    }
    const showedUsers = () => dUsers.filter(item => item.name.toLowerCase().includes(filter))

    // console.log("the duser ", user)
    return (
        <div className="admin" ref={myRef}>
            <div className="identity shadows">
                <h2>{user.userName}
                    <span>({user.role})</span> </h2>
                <span>{user.userEmail}</span>
                <span>{dateFormat(user.created_at, "dddd, d mmmm, yyyy")}</span>
            </div>
            <div className="users">
                <div className="users-head">
                    <div className="search-bar">
                        <BiSearchAlt color='#0f394d8c' size={30} />
                        <input type="text" placeholder='Chercher un utilisateur' onChange={e=>setFilter(e.target.value)} />
                    </div>
                    <button onClick={() => setModals({ ...modals, new: true })} >Nouvel utilisateur</button>
                </div>
                <div className="users-list">
                    {
                        loading ? <><Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /></>
                            : showedUsers().length ? (showedUsers().map(user => <UserRow data={user} select={selectUser} />))
                                : <center><h2>Aucun utilisateur</h2></center>
                    }
                </div>
            </div>
            <Modal open={modals.new} center onClose={() => setModals({ ...modals, new: false })} container={myRef.current} >
                <AddManager get={getUsers} />
            </Modal>
            <Modal open={modals.update} onClose={() => setModals({ ...loading, update: false })}
                closeOnOverlayClick container={myRef.current} center
            >
                <UpdateUser data={sUser} supp={deleteUser} load={button} />
            </Modal>
        </div>
    )
}

export default Admin

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
                <h3>{data.role}</h3>
                <span>{dateFormat(data.created_at, "dddd, d mmmm, yyyy")}</span>
            </div>
            <div className="s3">
                <BiChevronRight color='#0f394d81' size={25} />
            </div>
        </div>
    )
}

const UpdateUser = ({ data, supp, load }) => {
    console.log("data to remove ", data)
    return (
        <div className="update-user">
            <h2>Update user</h2>
            <div className="">
                <span>Name &ensp;:&ensp; &ensp; {data.name} </span>
                <span>Email &ensp;:&ensp; &ensp; {data.email} </span>
                <span>Role &ensp;:&ensp; &ensp; {data.role} </span>
            </div>
            <div className="button">
                <button onClick={() => supp(data.id)}>
                    {load ? <ReactLoading type="spin" color='#FFF' height={15} width={15} /> : "Supprimer"}
                </button>
            </div>
        </div>
    )
}