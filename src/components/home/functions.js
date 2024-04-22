export const getBalances=()=>{
    
}

export const getCountryCount=(txs)=>{
    // console.log("the txs ", txs)
    let cm=0, ci=0, sn=0
    if(txs.length) {
        // console.log("find count")
        txs.forEach(tx => {
            if(tx.phone.startsWith('+237')) cm++
            if(tx.phone.startsWith('+221')) sn++
            if(tx.phone.startsWith('+225')) ci++
        })
    }
    return {cm, ci, sn}
}
// [].length
