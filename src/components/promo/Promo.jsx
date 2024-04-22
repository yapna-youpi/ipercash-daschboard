import React, { useState, useEffect, useRef } from 'react'
import { BiSearchAlt, BiChevronRight } from 'react-icons/bi'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import ReactLoading from 'react-loading'

import { getToApi, postToApi } from '../../functions/utilsFunctions'
import { toastify } from '../shared/toast/Toast'

import './promo.css'
import Skel from '../shared/skeleton/Skel';
import AddCode from './AddCode'

function Promo() {
    const [codes, setCodes] = useState([])
    const [sCode, setSCode] = useState({})
    const [loading, setLoading] = useState(true)
    const [modals, setModals] = useState({ new: false, update: false })
    const myRef = useRef(null)
    useEffect(() => {
        getCodes()
    }, [])
    const getCodes = async () => {
        setLoading(true)
        let codes = await getToApi('promo/getcodes', false)
        console.log("the codes ", codes)
        setLoading(false)
        setCodes(codes.codes || [])
    }
    const selectCode = (code) => {
        setSCode(code)
        setModals({ ...loading, update: true })
    }
    const deleteCode = async (codeText) => {
        // console.log("code to delete ", codeText)
        let result = await postToApi('promo/delete', { code: codeText }, false)
        if (!result) return toastify('error', "Failed to delete code")
        if (result.success) {
            let newCodes = codes.filter(code => code.code != codeText)
            setCodes(newCodes)
            return true
        } else {
            toastify('error', "Failed to delete code")
            return false
        }
    }
    const suspendCode = async (code) => {
        console.log("code to suspend ", code)
        let result = await postToApi('promo/suspend', { code: code.code, active: !code.active }, false)
        if (!result) return toastify('error', "Failed to delete code")
        if (result.success) {
            let newCodes = codes.map(item => {
                if (item.code === code.code) return { ...item, active: !code.active }
                else return item
            })
            setCodes(newCodes)
            return true
        } else {
            toastify('error', "Failed to delete code")
            return false
        }
    }
    const addCode = async (code) => {
        console.log("the new code ", code)
        let result = await postToApi('promo/createcode', code, false)
        if (result.success) {
            let user = {
                name: code.owner,
                email: code.email,
                phone: code.phone,
                role: 'Partner_promo_' + code.code
            }
            user = await postToApi('create', user)
            if (user && user.success) toastify('success', "New code created")
            else
                toastify('info', "Nouveau code ajouté mais impossible d'ajouter l'influenceur au dashboard, veuillez le contacter directement", 12000)
            setCodes([...codes, { ...code, created_at: Date.now(), usage: 0 }])
            return true
            // end create user
        } else {
            toastify('error', "Failed to create new code")
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
                            <h2> {codes.length} Codes Promo </h2>
                            <h2>{codes.length} Influenceurs</h2>
                            <button onClick={() => setModals({ ...modals, new: true })} >+ Ajouter un code promo </button>
                        </div>
                        <div className="">
                            <span className='tx-nber'>{txNumber(codes)}</span> <span>transactions effectuees</span>
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
                            : codes.length ? (codes.map((code, i) => <CodeRow key={`code-${i}`} data={code} select={selectCode} />))
                                : <center><h2>No Codes yet</h2></center>
                    }
                </div>
            </div>
            <Modal open={modals.new} center onClose={() => setModals({ ...modals, new: false })} container={myRef.current} >
                <AddCode add={addCode} close={() => setModals({ ...modals, new: false })} />
            </Modal>
            <Modal open={modals.update} onClose={() => setModals({ ...loading, update: false })}
                closeOnOverlayClick container={myRef.current} center
            >
                <CodeInfo data={sCode} del={deleteCode} sus={suspendCode} close={() => setModals({ ...loading, update: false })} />
            </Modal>
        </div>
    )
}

export default Promo

const CodeRow = ({ data, select }) => {
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
                <h3>{data.code}</h3>
                {/* <span>{dateFormat(data.created_at, "dddd, d mmmm, yyyy")}</span> */}
                <span>{` ${data.usage} Utilisation${data.usage ? 's' : ''}`}</span>
            </div>
            <div className="s3">
                <BiChevronRight color='#0f394d81' size={25} />
            </div>
        </div>
    )
}

const CodeInfo = ({ data, del, sus, close }) => {
    const [loading, setLoading] = useState('')
    const [usages, setUsages] = useState([])
    useEffect(() => {
        getUsage()
    }, [])

    const getUsage = async () => {
        setLoading('usage')
        let usages = await postToApi('promo/getusages', { code: data.code }, false)
        if (!usages) {
            setUsages(null)
            setLoading('')
            return toastify('error', "Echec de l'obtention des transactions")
        }
        console.log("the usages ", usages)
        setUsages(usages.usages)
        setLoading('')
    }
    const delCode = async () => {
        setLoading('delete')
        let result = await del(data.code)
        if (result) {
            setLoading('')
            close()
        } else setLoading('')
    }
    const susCode = async () => {
        setLoading('suspend')
        let result = await sus(data)
        if (result) {
            setLoading('')
            close()
        } else setLoading('')
    }
    const calculGains = () => {
        let amount = 0
        usages.map(item => amount += item.amount)
        return (amount * data.percent / 100).toFixed(0)
    }

    return (
        <div className="update-code">
            <h2>Informations sur le code</h2>
            <div className="details">
                <div className="info">
                    <span>Code Promo &ensp;:&ensp; &ensp; <b>{data.code}</b> </span>
                    <span>Nom &ensp;:&ensp; &ensp; {data.owner} </span>
                    <span>Telephone &ensp;:&ensp; &ensp; {data.phone} </span>
                    <span>Email &ensp;:&ensp; &ensp; {data.email} </span>
                    <span>Pourcentage &ensp;:&ensp; &ensp; {data.percent}% </span>
                    <span>Utilisations &ensp;:&ensp; &ensp; {data.usage} fois </span>
                    <span>Actif &ensp;:&ensp; &ensp; {data.active ? "oui" : "non"}  </span>
                </div>
                <div className="gain">
                    {
                        loading === 'usage' ? <ReactLoading type="spin" color='#cc1616' height={30} width={30} />
                            : !usages ? <div className="">Error</div> : (<>
                                <div className="">{calculGains()} XAF</div>
                                <div>de redevances</div></>)
                    }
                </div>
            </div>
            <div className="button">
                <button onClick={susCode}>
                    {loading === 'suspend' ? <ReactLoading type="spin" color='#FFF' height={15} width={15} /> : data.active ? "Suspendre" : "Activer"}
                </button>
                <button onClick={delCode}>
                    {loading === 'delete' ? <ReactLoading type="spin" color='#FFF' height={15} width={15} /> : "Supprimer"}
                </button>
            </div>
        </div>
    )
}
