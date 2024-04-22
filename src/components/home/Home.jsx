import React from 'react'

import './home.css'
import Balances from './Balances'
import Transactions from './Transactions'
import RecentUsers from './RecentUsers'
import Bilan from './bilan/Bilan'

function Home() {
    return (
        <div className='home'>
            <Balances />
            <Transactions />
            <RecentUsers />
            <Bilan />
        </div>
    )
}

export default Home