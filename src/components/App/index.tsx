import React, { useState, useEffect } from 'react'
import { BigNumber } from 'bignumber.js'
import Footer from '../Footer'
import { getGasPrice } from '../../logic/gasOperations'
import { estimateSafeSetupGas } from '../../logic/contractOperations'
import './styles.scss'
import { fromWeiToEther, fromWeiToGwei } from '../../utils'

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
    if (!gasPrice ||  currentNumOwners <= 0) return
    const currentEstimatedSetupGas = await estimateSafeSetupGas(currentNumOwners)
    const currentCostWei = gasPrice.multipliedBy(currentEstimatedSetupGas)
    setHistory(prevHistory => [
      {
        numOwners: currentNumOwners,
        gasUsed: currentEstimatedSetupGas,
        costWei: currentCostWei
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
          <p><b>Gas price:</b> {gasPrice && fromWeiToGwei(gasPrice).toString() + ' Gwei'}</p>
          <p><b>Number of owners:</b></p>
          <input
            autoFocus
            type="number"
            value={currentNumOwners || ''}
            onChange={handleNumOwnersChange}
          />
          <button onClick={getSafeCreationCosts}>Get result</button>
        </div>
        <div className="calcResults">
          {history && history.map((h, index) => (
            <div
              key={index}
              className={index === 0 ? "currentCalcResult" : "calcResult"}
              style={{opacity: 1 / (index * 3)}}
            >
              <div className="owners">
              <div className="ownersValue">{h.numOwners}</div>
                <div className="ownersLabel">owner{h.numOwners > 1 && 's'}</div>
              </div>
              <div className="cost">
                <div className="costEth">
                  {fromWeiToEther(h.costWei).toString()} ETH
                </div>
                <div className="gasUsed">
                  {h.gasUsed.toString()} gas used
                </div>
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
