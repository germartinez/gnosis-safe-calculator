import React, { useState, useEffect } from 'react'
import { BigNumber } from 'bignumber.js'
import Footer from '../Footer'
import { estimateGasSafeCreation, getGasPrice } from '../../logic/gasOperations'
import { fromWeiToEther, fromWeiToGwei } from '../../utils'
import './styles.scss'

interface History {
  numOwners: number
  gasUsed: BigNumber
  costWei: BigNumber
}

const App = () => {
  const [currentNumOwners, setCurrentNumOwners] = useState<number>(0)
  const [gasPrice, setGasPrice] = useState<undefined | BigNumber>(undefined)
  const [history, setHistory] = useState<History[]>([])

  useEffect(() => {
    const initializeGasPrice = async () => {
      const gasInfo = await getGasPrice()
      if (!gasInfo) return
      setGasPrice(new BigNumber(gasInfo.fast.toString()))
    }
    initializeGasPrice()
  }, [])

  const handleNumOwnersChange = (event: any) => {
    setCurrentNumOwners(parseInt(event.target.value))
  }

  const getSafeCreationCosts = async () => {
    if (!gasPrice || currentNumOwners <= 0) return
    const currentCreationGas = await estimateGasSafeCreation(currentNumOwners)
    if (!currentCreationGas) return
    setHistory((prevHistory) => [
      {
        numOwners: currentNumOwners,
        gasUsed: currentCreationGas.gas,
        costWei: currentCreationGas.payment
      },
      ...prevHistory
    ])
  }

  return (
    <div className="container">
      <header>
        <h1>Gnosis Safe Calculator</h1>
        <h2>How much does it cost to create a Gnosis Safe?</h2>
      </header>
      <div className="calculatorContainer">
        <div className="calculator">
          <p>
            <b>Gas price:</b>{' '}
            {gasPrice && fromWeiToGwei(gasPrice).toString() + ' Gwei'}
          </p>
          <p>
            <b>Number of owners:</b>
          </p>
          <input
            autoFocus
            type="number"
            value={currentNumOwners || ''}
            onChange={handleNumOwnersChange}
          />
          <button onClick={getSafeCreationCosts}>Get result</button>
        </div>
        <div className="calcResults">
          {history &&
            history.map((h, index) => (
              <div key={index} className="calcResult">
                <div className="owners">
                  <div className="ownersValue">{h.numOwners}</div>
                  <div className="ownersLabel">
                    owner{h.numOwners > 1 && 's'}
                  </div>
                </div>
                <div className="cost">
                  <div className="costEth">
                    {fromWeiToEther(h.costWei).toString()} ETH
                  </div>
                  <div className="gasUsed">{h.gasUsed.toString()} gas used</div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
