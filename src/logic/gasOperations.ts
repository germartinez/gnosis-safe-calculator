import BigNumber from 'bignumber.js'
import { mainnetConfig } from '../config'

interface GasInfo {
  lastUpdate: BigNumber
  lowest: BigNumber
  safeLow: BigNumber
  standard: BigNumber
  fast: BigNumber
  fastest: BigNumber
}

export const getGasPrice = async (): Promise<GasInfo | undefined> => {
  const response = await fetch(mainnetConfig.safeRelayApiUrl)
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
