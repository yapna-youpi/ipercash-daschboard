import React from 'react'
import Skeleton from '@mui/material/Skeleton'

function Skel({ variant, width = null, heigth = 30 }) {
    return ( <Skeleton animation="wave" variant={variant} height={heigth} width={width} />)
}

export default Skel