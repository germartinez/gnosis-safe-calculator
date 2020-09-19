import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { BigNumber } from 'bignumber.js'
import Footer from '../Footer'
import { getGasPrice } from '../../logic/gasOperations'
import { estimateSafeSetupGas } from '../../logic/contractOperations'
import './styles.scss'
import { fromWeiToEther, fromWeiToGwei, getWeb3 } from '../../utils'

const App = () => {
  const [numOwners, setNumOwners] = useState<number>(0)
  const [gasPrice, setGasPrice] = useState<undefined | BigNumber>(undefined)
  const [estimatedSetupGas, setEstimatedSetupGas] = useState<undefined | BigNumber>(undefined)
  const [costWei, setCostWei] = useState<undefined | BigNumber>(undefined)

  useEffect(() => {
    const initializeGasPrice = async () => {
      const gasInfo = await getGasPrice()
      if (!gasInfo) return
      setGasPrice(new BigNumber(gasInfo.fast.toString()))
    }
    initializeGasPrice()
  }, [])

  useEffect(() => {
    if (!gasPrice) return
    if (!estimatedSetupGas) return
    const currentCostWei = gasPrice.multipliedBy(estimatedSetupGas)
    setCostWei(currentCostWei)
  }, [gasPrice, estimatedSetupGas])

  const handleNumOwnersChange = (event: any) => {
    setNumOwners(parseInt(event.target.value))
  }

  const getSafeCreationCosts = async () => {
    if (!gasPrice ||  numOwners <= 0) return
    const currentEstimatedSetupGas = await estimateSafeSetupGas(numOwners)
    setEstimatedSetupGas(currentEstimatedSetupGas)
  }

  return (
    <div className="container">
      <header>
        <h1>Gnosis Safe Calculator</h1>
        <h2>How much does it cost to create a Gnosis Safe?</h2>
      </header>
      <div className="calculatorContainer">
        <div className="calculator">
          <p><b>Current gas price:</b> {gasPrice && fromWeiToGwei(gasPrice).toString() + ' Gwei'}</p>
          <p><b>Number of owners:</b></p>
          <input
            autoFocus
            type="number"
            value={numOwners || ''}
            onChange={handleNumOwnersChange}
          />
          <button onClick={getSafeCreationCosts}>Get result</button>
        </div>
        <div className="calcResult">
          <p>
            <b>Estimated setup gas:</b> {estimatedSetupGas && estimatedSetupGas.toString()} gas
          </p>
          <p>
            <b>Total cost:</b> {costWei && fromWeiToEther(costWei).toString()} ETH
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
