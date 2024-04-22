import React, { useState, useEffect, useRef } from 'react'
import Skeleton from '@mui/material/Skeleton'
import { Modal } from 'react-responsive-modal'
import ReactLoading from 'react-loading'

import { getToApi, postToApi } from '../../functions/utilsFunctions'
import { useAuth } from '../context/auth'
import crypt from '../../functions/crypt'
import { toastify } from '../shared/toast/Toast'

function Balances() {
    const [balances, setBalances] = useState({ crypto: null, fiat: null })
    const [loading, setLoading] = useState('all')
    const [modal, setModal] = useState({ open: false, crypto: '' })
    let { user } = useAuth()
    const ref = useRef(null)
    useEffect(() => {
        getBalances()
    }, [])

    const getBalances = async () => {
        let crypto = await getToApi('getcryptobalances')
        let fiat = await getToApi('getfiatbalances')
        setBalances({ crypto: crypto, fiat: fiat })
        setLoading('')
        return
    }
    const move = async () => {
        setLoading('move')
        const message = crypt(JSON.stringify({ role: user.role, crypto: modal.crypto }))
        const response = await postToApi('moveall', message)
        console.log("the response of move ", response)
        if (response.success) await getBalances()
        setLoading('')
        response.success ? toastify('success', "la crypto a été deplacé") : toastify('error', "la crypto n'a pas été deplacée")
        setModal(false)
    }
    const showModal = (crypto) => {
        setModal({ open: true, crypto })
    }

    return (
        <div className="balances" ref={ref}>
            <BalanceBloc label="Wallet de distribution" data={loading === 'all' ? null : balances.crypto.wallet1} />
            <BalanceBloc label="Wallet de reception" data={loading === 'all' ? null : balances.crypto.wallet2}
                click={user.role === 'Administrateur' ? showModal : null}
            />
            <BalanceBlocX label="Comptes Mobile Money" data={loading === 'all' ? null : balances.fiat} />
            <Modal open={modal.open} center onClose={() => setModal({ open: false, crypto: '' })} container={ref.current} >
                <div className="move">
                    <h1>Confirmer le transfert des {modal.crypto}</h1>
                    <button onClick={move}>
                        {loading === 'move' ? <ReactLoading type="spin" color='#FFF' height={40} width={40} /> : "Transferer"}
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default Balances

const Skel = ({ variant, width = null, heigth = 30 }) => <Skeleton animation="wave" variant={variant} height={heigth} width={width} />

function BalanceBloc({ data, label, click }) {
    return (
        <div className="balance-bloc">
            {data ? (<>
                <span>{label}</span>
                <div className="crypto-balance">
                    <div className="crypto-bloc" onClick={() => click('BTC')}>
                        <h4>BTC</h4>
                        <h3>{Math.floor(data.btcEur)} &euro;</h3>
                        <span>{Math.floor(data.btcXaf)} XAF</span>
                    </div>
                    <div className="divider"></div>
                    <div className="crypto-bloc" onClick={() => click('ETH')}>
                        <h4>ETH</h4>
                        <h3>{Math.floor(data.ethEur)} &euro;</h3>
                        <span>{Math.floor(data.ethXaf)} XAF</span>
                    </div>
                    <div className="divider"></div>
                    <div className="crypto-bloc" onClick={() => click('USDT')}>
                        <h4>USDT</h4>
                        <h3>{Math.floor(data.usdtEur)} &euro;</h3>
                        <span>{Math.floor(data.usdtXaf)} XAF</span>
                    </div>
                </div>
                <h4> {Math.floor(data.xaf)} XAF </h4>
                <div className="bars">
                    <div className="b1"></div>
                </div>
            </>) : (<Skel variant="rectangular" heigth={100} />)}
        </div>
    )
}

function BalanceBlocX({ data, label, click }) {
    return (
        <div className="balance-bloc">
            {data ? (<>
                <span>{label}</span>
                <div className="fiat-balance">
                    <h3>{Math.round(data.intouch.total / 656)} &euro;</h3>
                    <h4> Intouch &emsp; {Math.round(data.intouch.total)} XAF </h4>
                    <div className="bars">
                        <div className="b1"></div>
                    </div>
                </div>
                <div className="fiat-balance">
                    <h3>{Math.round(data.cinet.total / 656)} &euro;</h3>
                    <h4> Cinetpay &emsp; {Math.round(data.cinet.total)} XAF </h4>
                    <div className="bars">
                        <div className="b1"></div>
                    </div>
                </div>
            </>) : (<Skel variant="rectangular" heigth={100} />)}
        </div>
    )
}