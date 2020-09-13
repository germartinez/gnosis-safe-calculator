import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import Footer from '../Footer'
import './styles.scss'

const App = () => {
  const [showCalcResult, setShowCalcResult] = useState<boolean>(false)
  const [numOwners, setNumOwners] = useState<number>(0)

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
          <h3>Safe configuration</h3>
          <p>Number of owners:</p>
          <input
            autoFocus
            type="number"
            value={numOwners || ''}
            onChange={handleNumOwnersChange}
          />
          <button onClick={toggleCalcResult}>Get result</button>
        </div>
        <div className={calcResultClasses}>
          <p>Loading...</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
