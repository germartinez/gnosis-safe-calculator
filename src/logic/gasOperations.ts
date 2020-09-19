import BigNumber from 'bignumber.js'
import { mainnetConfig } from '../config'

interface GasCreationInfo {
  gas: BigNumber
  payment: BigNumber
}

interface GasPriceInfo {
  lastUpdate: BigNumber
  lowest: BigNumber
  safeLow: BigNumber
  standard: BigNumber
  fast: BigNumber
  fastest: BigNumber
}

export const getGasPrice = async (): Promise<GasPriceInfo | undefined> => {
  const response = await fetch(
    mainnetConfig.safeRelayApiUrl + '/api/v1/gas-station/'
  )
  if (!response.ok) {
    return
  }
  const gasInfo = await response.json()
  return {
    lastUpdate: new BigNumber(gasInfo.lastUpdate),
    lowest: new BigNumber(gasInfo.lowest),
    safeLow: new BigNumber(gasInfo.safeLow),
    standard: new BigNumber(gasInfo.standard),
    fast: new BigNumber(gasInfo.fast),
    fastest: new BigNumber(gasInfo.fastest)
  }
}

export const estimateGasSafeCreation = async (
  numberOwners: number
): Promise<GasCreationInfo | undefined> => {
  const body = JSON.stringify({
    numberOwners
  })
  const response = await fetch(
    mainnetConfig.safeRelayApiUrl + '/api/v3/safes/estimates/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }
  )
  if (!response.ok) {
    return
  }
  const paymentInfo = await response.json()
  return {
    gas: new BigNumber(paymentInfo[0].gas),
    payment: new BigNumber(paymentInfo[0].payment)
  }
}
