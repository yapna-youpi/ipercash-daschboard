import React, { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal'
import ReactLoading from 'react-loading'

import { getToApi, postToApi } from '../../functions/utilsFunctions'
import Skel from '../shared/skeleton/Skel'
import { toastify } from '../shared/toast/Toast'

import './addmanager.css'
import { BiSearchAlt } from 'react-icons/bi'

function AddManager({ get }) {
    const [users, setUsers] = useState([])
    const [user, setUser] = useState({ name: "", email: "", role: "", modal: false })
    const [loading, setLoading] = useState({ get: true, set: false })
    const [filter, setFilter] = useState('')
    const myRef = React.useRef(null);
    useEffect(() => {
        getToApi('getusers').then(users => {
            setUsers(users)
            setLoading(false)
        })

        return () => {

        }
    }, [])

    const selectUser = (sUser) => {
        setUser({ ...user, id: sUser.id, name: sUser.name, email: sUser.email, modal: true })
    }
    const chooseRole = (role) => setUser({ ...user, role: role })
    const createUser = () => {
        console.log("the user ", user)
        setLoading({ ...loading, set: true })
        postToApi('create', user).then(res => {
            setLoading({ ...loading, set: false })
            console.log("the response ", res)
            if (res && res.success) {
                if (res.user && res.mail) toastify('success', `Un e-mail a ete envoye a ${user.name}`)
                else toastify('warning', `${user.name} a ete promu mais le mail n'a pas pu lui etre envoye`, 10 * 1000)
            }
            else toastify('error', `echec de l'operation`)
            closeModal()
            get()
        })
    }
    const closeModal = () => setUser({ role: "", modal: false })
    const showedUsers = () => users.filter(item => item.name.toLowerCase().includes(filter))

    // console.log("hello from add manager ", user)
    return (
        <div className="addmanager" ref={myRef}>
            <h2>Invitez un utilisateur</h2>
            <div className="users-head">
                <div className="search-bar">
                    <BiSearchAlt color='#0f394d8c' size={30} />
                    <input type="text" placeholder='Chercher un utilisateur' onChange={e => setFilter(e.target.value)} />
                </div>
            </div>
            <div className="users-list">
                {
                    loading.get ? (<><Skel heigth={70} /><Skel heigth={70} /><Skel heigth={70} /><Skel heigth={70} /><Skel heigth={60} /></>)
                        : showedUsers().map(user => <UserRow data={user} select={selectUser} />)
                }
            </div>
            <Modal open={user.modal} container={myRef.current} onClose={closeModal} closeOnOverlayClick={false} >
                <div className="roles">
                    <div className="">
                        <span><b>{user.name}</b></span>  <span>{user.email}</span>
                    </div> <br />
                    <h3>Selectionnez le role</h3>
                    <div className="radio">
                        <input type="radio" name='role' id='radio-admin' value="Administrateur" onClick={() => chooseRole("Aministrateur")} />
                        <label htmlFor="radio-admin">Administrateur</label>
                    </div>
                    <div className="radio">
                        <input type="radio" name='role' id='radio-man' value="Manageur" onClick={() => chooseRole("Manageur")} />
                        <label htmlFor="radio-man">Manageur</label>
                    </div>
                    <div className="man-buttons">
                        <button className=' btn-cancel' onClick={closeModal}>Annuler</button>
                        <button disabled={!user.role} onClick={createUser}>
                            {loading.set ? <ReactLoading type="spin" color='#FFF' height={15} width={15} /> : "Inviter"}
                        </button>
                    </div>
                </div>
            </Modal>
            <div className="man-buttons">
                {/* <button className=' btn-cancel'>Annuler</button> */}
            </div>
        </div>
    )
}

const UserRow = ({ data, select }) => {

    return (
        <div className="user-row" >
            <div className="s1">
                <span className="abr">{data.name[0]}</span>
                <div className="">
                    <h3>{data.name}</h3>
                </div>
            </div>
            <div className="s2">
                <h3>{data.email}</h3>
            </div>
            <div className="s3">
                <button onClick={() => select({ name: data.name, email: data.email, id: data.id })}>Inviter</button>
            </div>
        </div>
    )
}

export default AddManager