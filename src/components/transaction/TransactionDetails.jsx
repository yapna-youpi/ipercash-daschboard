import React, { useState, useEffect, useRef } from 'react'
import dateFormat from "dateformat";
import { Modal } from 'react-responsive-modal'
import ReactLoading from 'react-loading'

import { cutString, detectOperation, getToApi, postToApi } from '../../functions/utilsFunctions'
import { toastify } from '../shared/toast/Toast'

import './transaction.css'
import Skel from '../shared/skeleton/Skel'
import { t, use } from 'i18next';
import { setBuyDescription, setSellDescription } from './setDescription';


function Transaction({ history }) {
    const [tx, setTx] = useState({});
    const [user, setUser] = useState({});
    const [result, setResult] = useState({});
    const [loading, setLoading] = useState('all');
    const [modal, setModal] = useState(false);
    const txId = history.location.pathname.split(':')[1];
    const myRef = useRef(null);
    useEffect(() => {
        getData();
        return () => {

        }
    }, [])

    const getData = async () => {
        setLoading('all');
        let data = await getToApi('gettransaction/' + txId)
            .then(response => {
                // console.log("the transaction ", response);
                if (response.success) return response.ts;
                else return false;
                // setLoading(false)
            }).catch(error => false)
        if (!data) {
            toastify('error', "impossible de recuperer les données");
            return setLoading(false);
        }
        let clt = await getToApi('getuser/' + data.userId)
            .then(response => {
                console.log("the user ", response);
                if (response.id) return response;
                else return false;
                // setLoading(false)
            }).catch(error => false)
        data && setTx(data);
        clt && setUser(clt);
        setLoading(false);
    }

    const checkTransaction = async () => {
        setLoading('modal');
        setModal(true);
        let response = await postToApi('checktransaction', { id: tx.transaction_id, number: tx.phone, txid: tx.txid, crypto: tx.cryptoCurency, provider: tx.provider });
        // console.log("the response ", response);
        if (!response.success) {
            toastify('error', "Une erreur est survenu veuillez reesayer", 8000);
            return setModal(false);
        }
        setResult(response);
        setLoading(false);
    }

    const setWallets = () => {
        switch (tx.transaction_id[2]) {
            case 'B':
                return <span>Wallet du client &ensp;:&ensp; &ensp; {tx.wallet ? cutString(tx.wallet, 6) : "VIDE"} </span>;
            case 'S':
                return <>
                    <span>Wallet du client &ensp;:&ensp; &ensp; {tx.clientWallet ? cutString(tx.clientWallet, 6) : "VIDE"} </span>
                    <span>Wallet emetteur &ensp;:&ensp; &ensp; {tx.senderWallet ? cutString(tx.senderWallet, 6) : "VIDE"} </span>
                </>
            default:
                return ""
        }
    }
    const setBlockchainUrl = (crypto, txid) => {
        switch (crypto) {
            case 'BTC':
                return process.env.REACT_APP_MEMPOOL_URL + 'tx/' + txid
            case 'ETH':

                return process.env.REACT_APP_ETHERSCAN_URL + 'tx/' + txid
            case 'USDT':
                return process.env.REACT_APP_ETHERSCAN_URL + 'tx/' + txid

            default:
                return '#'
        }
    }

    // console.log("route ", tx, user)
    return (
        <div className="tx-details">
            {txId[2] === 'C' ? <center><h2>Les operations de transferts ne sont pas encore prise en charge</h2></center>
                : <>
                    <div className='shadows'>
                        {
                            loading === 'all' ? <><Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /></>
                                : !tx.transaction_id ? <center>
                                    <h3>Une erreur est survenue</h3> <br />
                                    <button onClick={getData}>Ressayer</button>
                                </center> : <>
                                    <h1>Details de la transaction</h1>
                                    <div className="transaction" ref={myRef}>
                                        <div className="left">
                                            <span>Status &ensp;:&ensp; &ensp; <b>{tx.status}</b> </span>
                                            <span>Identifiant &ensp;:&ensp; &ensp; {tx.transaction_id} </span>
                                            <span>Service &ensp;:&ensp; &ensp; {detectOperation(tx.transaction_id)} </span>
                                            <span>Cryptomonnaie &ensp;:&ensp; &ensp; {tx.cryptoCurency} </span>
                                            <span>Montant de crypto &ensp;:&ensp; &ensp; {tx.amountCrypto} </span>
                                            {/* <span>Wallet du client &ensp;:&ensp; &ensp; {tx.wallet ? cutString(tx.wallet, 6) : "VIDE"} </span> */}
                                            {setWallets()}
                                            <span>Identifiant sur la blockchain &ensp;:&ensp; &ensp;
                                                <a href={setBlockchainUrl(tx.cryptoCurency, tx.txid)} target='_blank'>{tx.txid ? cutString(tx.txid, 6) : "VIDE"} </a>
                                            </span>
                                        </div>
                                        <div className="right">
                                            <span>Montant XAF &ensp;:&ensp; &ensp; <b>{tx.amountFiat}</b> </span>
                                            <span>Mobile money &ensp;:&ensp; &ensp; {tx.phone} </span>
                                            <span>Operateur mobile money &ensp;:&ensp; &ensp; {tx.provider} </span>
                                            <span>Date de debut &ensp;:&ensp; &ensp; {dateFormat(tx.created_at, "d mmmm yyyy, HH:MM:ss")} </span>
                                            <span>Date de fin &ensp;:&ensp; &ensp; {dateFormat(tx.updated_at, "d mmmm yyyy, HH:MM:ss")} </span>
                                        </div>
                                    </div>
                                    <div className="description">
                                        <h2>Description</h2>
                                        {tx.transaction_id[2] == 'B' ? setBuyDescription(tx.errorStep) : setSellDescription(tx.status)}
                                    </div>
                                    <div className="control">
                                        <button onClick={checkTransaction}>Verifier la transaction</button>
                                    </div>
                                </>
                        }
                    </div>
                    <div className="shadows">
                        {
                            loading === 'all' ? <><Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /></>
                                : tx.transaction_id && user.name && <div className="">
                                    <h1>Informations sur le client</h1>
                                    <div className="client">
                                        <span>Nom &ensp;:&ensp; &ensp; <b>{user.name}</b> </span>
                                        <span>Email &ensp;:&ensp; &ensp; {user.email} </span>
                                        <span>Telephone &ensp;:&ensp; &ensp; {user.phone} </span>
                                        <span>Pays &ensp;:&ensp; &ensp; {user.country.split('_')[0]} </span>
                                        <span>Date d'inscription &ensp;:&ensp; &ensp; {dateFormat(user.created_at, "d mmmm yyyy, HH:MM:ss")} </span>
                                    </div>
                                </div>
                        }
                    </div>
                </>
            }
            {modal && <Modal open={modal} center onClose={() => setModal(false)} container={myRef.current} closeOnOverlayClick={false} >
                {
                    loading === 'modal' ? <ReactLoading type="spin" color='#cc1616' height={30} width={30} />
                        : setResultMessage(tx.transaction_id, result)
                }
            </Modal>}
        </div>
    )
}

const setResultMessage = (id, result) => {
    return (
        <div className="results">
            <h2>Resultats de la verification</h2> <br />
            <h3>Paiement de crypto</h3>
            <p>
                {
                    result.tx ? <>
                        La transaction a été retrouvé sur la blockchain  <br />
                        {id[2] === 'B' ? "La crypto a bien été envoyé au client" : "Le client a envoyé la crypto"}
                    </> : <>
                        La transaction n'a pas été retrouvé sur la blockchain <br />
                        {id[2] === 'B' ? "La crypto n'a pas été envoyé au client" : "Le client n'a pas envoyé la crypto"}
                    </>
                }
            </p>
            <h3>Paiement mobile money</h3>
            <p>
                {
                    result.paymentStatus === "SUCCESSFUL" || result.paymentStatus === "ACCEPTED" ? <>
                        {id[2] === 'B' ? `Le client a eté prelevé de ${result.amount} XAF`
                            : `La somme de ${result.amount} XAF a été envoyé au client`}
                    </> : <>
                        La transaction n'a pas été effectuée <br />
                        {id[2] === 'B' ? "Le client n'a pas eté prelevé" : "Le client n'a pas reçu le mobile money "}
                    </>
                }
            </p>
        </div>
    )
}

export default Transaction