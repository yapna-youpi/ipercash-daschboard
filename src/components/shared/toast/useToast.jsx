import { useState } from 'react'

const useToast=()=>{
    const [show, setShow]=useState(false)
    const toogle=()=>{
        console.log("show toast")
        setShow(true)
    }
    return {show, toogle}
}