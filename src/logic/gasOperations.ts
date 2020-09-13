import { mainnetConfig } from '../config'

interface GasInfo {
  lastUpdate: string
  lowest: string
  safeLow: string
  standard: string
  fast: string
  fastest: string
}

export const getGasPrice = async (): Promise<GasInfo | undefined> => {
  const response = await fetch(mainnetConfig.safeRelayApiUrl)
  if (!response.ok) {
    return
  }
  return response.json()
}
