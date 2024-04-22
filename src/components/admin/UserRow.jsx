import React from 'react'
import { BiSearchAlt, BiChevronRight } from 'react-icons/bi'
import dateFormat from 'dateformat'

import { toastify } from '../toast/Toast'

function UserRow({data}) {
    // console.log("the data ", data)
    return (
        <div className="user-row"  onClick={()=> toastify('error', "prevu pour la prochaine mise a jour", 10*1000) } >
            <div className="s1">
                <span className="abr">F</span>
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

export default UserRow