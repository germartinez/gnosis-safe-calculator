import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import Web3 from 'web3'
import Footer from '../Footer'
import { getGasPrice } from '../../logic/gasOperations'
import { estimateSafeSetupGas } from '../../logic/contractOperations'
import './styles.scss'

interface Costs {
  gasPriceGwei: number
  estimatedSetupGas: number
  costEth: number
}

const App = () => {
  const [showCalcResult, setShowCalcResult] = useState<boolean>(false)
  const [numOwners, setNumOwners] = useState<number>(0)
  const [costs, setCosts] = useState<undefined | Costs>(undefined)

  useEffect(() => {
    const web3 = new Web3()
    const getSafeCreationCosts = async () => {
      const gasInfo = await getGasPrice()
      if (gasInfo) {
        const gasPriceGwei = parseInt(
          web3.utils.fromWei(gasInfo.fast.toString(), 'Gwei')
        )
        const estimatedSetupGas = await estimateSafeSetupGas()
        const totalCostWei = (gasInfo.fast.toNumber() * estimatedSetupGas).toString()
        const costEth = parseInt(web3.utils.fromWei(totalCostWei, 'ether'))
        setCosts({ gasPriceGwei, estimatedSetupGas, costEth })
      }
    }
    getSafeCreationCosts()
  }, [])

  useEffect(() => {
    if (showCalcResult) {
      setShowCalcResult(false)
    }
  }, [numOwners])

  const toggleCalcResult = () => {
    if (!showCalcResult && numOwners && numOwners > 0) {
      setShowCalcResult(true)
    }
  }

  const handleNumOwnersChange = (event: any) => {
    setNumOwners(parseInt(event.target.value))
  }

  const calcResultClasses = classNames({
    calcResult: true,
    showCalcResult: showCalcResult
  })

  return (
    <div className="container">
      <header>
        <h1>Gnosis Safe Calculator</h1>
        <h2>How much does it cost to create a Gnosis Safe?</h2>
      </header>
      <div className="calculatorContainer">
        <div className="calculator">
          <p><b>Current gas price:</b> {costs && costs.gasPriceGwei + ' Gwei'}</p>
          <p><b>Number of owners:</b></p>
          <input
            autoFocus
            type="number"
            value={numOwners || ''}
            onChange={handleNumOwnersChange}
          />
          <button onClick={toggleCalcResult}>Get result</button>
        </div>
        <div className={calcResultClasses}>
          {costs ? (
            <>
              <p>
                <b>Estimated setup gas:</b> {costs.estimatedSetupGas} gas
              </p>
              <p>
                <b>Total cost:</b> {costs.costEth} ETH
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
