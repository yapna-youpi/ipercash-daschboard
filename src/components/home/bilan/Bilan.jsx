import React, { useState, useEffect } from 'react'

import SellBilan from './SellBilan'
import BuyBilan from './BuyBilan'
import SendBilan from './SendBilan'

function Bilan() {
  return (
      <div className="bilans">
          {/* <h1>Bilans des services</h1> */}
          <BuyBilan />
          <SellBilan />
          <SendBilan />
      </div>
  )
}

export default Bilan