import React, { useState, useEffect, useRef } from 'react'
import { BiSearchAlt, BiChevronRight } from 'react-icons/bi'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'

import { getToApi, postToApi } from '../../functions/utilsFunctions'
import { toastify } from '../shared/toast/Toast'

import './sponsor.css'
import Skel from '../shared/skeleton/Skel';
import AddSponsor from './AddSponsor'


function Sponsor({ history }) {
    const [sponsors, setSponsors] = useState([])
    const [users, setUsers] = useState([])
    // const [sCode, setSCode] = useState({})
    const [loading, setLoading] = useState(true)
    const [modals, setModals] = useState({ new: false, update: false })
    const myRef = useRef(null)
    // let history=useHistory()
    useEffect(() => {
        getSponsors()
    }, [])
    const getSponsors = async () => {
        setLoading(true)
        const sponsors = await getToApi('parrain/get', false)
        console.log("the sponsors ", sponsors)
        setSponsors(sponsors.parrains || [])
        getUsersSponsored()
        setLoading(false)
    }
    const getUsersSponsored = async () => {
        const users = await getToApi('parrain/usersparrained', false)
        console.log("the users sponsored ", users)
        setUsers(users.users)
    }
    const selectCode = (sponsor) => {
        let sponsored = users.filter(user => user.parrain_id === sponsor.parrain_id)
        history.push('/sponsor/details', { sponsor, users: sponsored })
        // setSCode(code)
        // setModals({ ...loading, update: true })
    }
    const addSponsor = async (parrain) => {
        console.log("the new parrain ", parrain)
        let result = await postToApi('parrain/create', { ...parrain, parrain_id: parrain.code }, false)
        // if (!result) return toastify('error', "Echec de la creation du nouveau parrain ")
        if (result.success) {
            let user = {
                name: parrain.owner,
                email: parrain.email,
                phone: parrain.phone,
                role: 'Partner_sponsor_' + parrain.code
            }
            user = await postToApi('create', user)
            if (user && user.success) toastify('success', "New parrain created")
            else
                toastify('info', "Nouveau code parrain ajouté mais impossible d'ajouter le parrain au dashboard, veuillez le contacter directement", 12000)
            setSponsors([...sponsors, { ...parrain, created_at: Date.now(), usage: 0 }])
            return true
            // end create user
        } else {
            toastify('error', "Failed to create new parrain")
            return false
        }
    }
    const txNumber = (cd) => {
        let n = 0
        cd.map(c => {
            if (!isNaN(c.usage)) n += c.usage
        })
        return n
    }

    return (
        <div className="promo" ref={myRef}>
            {
                loading ? <><Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /></>
                    : <div className="identity shadows">
                        <div className="">
                            <h2> {sponsors.length} Sponsors </h2>
                            <h2>{users.length} Utilisateurs</h2>
                            <button onClick={() => setModals({ ...modals, new: true })} >+ Ajouter un parrain </button>
                        </div>
                        <div className="">
                            <span className='tx-nber'>{txNumber(sponsors)}</span> <span>transactions effectuees</span>
                        </div>
                    </div>
            }
            <div className="codes">
                <div className="codes-head">
                    <div className="search-bar">
                        <BiSearchAlt color='#0f394d8c' size={30} />
                        <input type="text" placeholder='Faire une recherche' />
                    </div>
                    {/* <button onClick={() => setModals({ ...modals, new: true })} >Nouvel utilisateur</button> */}
                </div>
                <div className="codes-list">
                    {
                        loading ? <><Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /></>
                            : sponsors.length ? (sponsors.map((code, i) => <SponsorRow key={`code-${i}`} data={code} select={selectCode} />))
                                : <center><h2>No Sponsor yet</h2></center>
                    }
                </div>
            </div>
            <Modal open={modals.new} center onClose={() => setModals({ ...modals, new: false })} container={myRef.current} >
                <AddSponsor add={addSponsor} close={() => setModals({ ...modals, new: false })} />
            </Modal>
            {/* <Modal open={modals.update} onClose={() => setModals({ ...loading, update: false })}
                closeOnOverlayClick container={myRef.current} center
            >
                <CodeInfo data={sCode} del={deleteCode} sus={suspendCode} close={() => setModals({ ...loading, update: false })} />
            </Modal> */}
        </div>
    )
}

export default Sponsor


const SponsorRow = ({ data, select }) => {
    // console.log("the data ", data)
    return (
        <div className="user-row" onClick={() => select(data)}>
            <div className="s1">
                {/* <span className="abr">{data.name[0]}</span> */}
                <div className="">
                    <h3>{data.owner}</h3>
                    <span>{data.phone}</span>
                </div>
            </div>
            <div className="s2">
                <h3>{data.parrain_id}</h3>
                {/* <span>{dateFormat(data.created_at, "dddd, d mmmm, yyyy")}</span> */}
                <span>{` ${data.usage} Transactions${data.usage ? 's' : ''}`}</span>
            </div>
            <div className="s3">
                <BiChevronRight color='#0f394d81' size={25} />
            </div>
        </div>
    )
}