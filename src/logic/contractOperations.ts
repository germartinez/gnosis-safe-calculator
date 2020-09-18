import Web3 from 'web3'
import GnosisSafeJson from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import GnosisSafeProxyFactoryJson from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafeProxyFactory.json'
import { mainnetConfig } from '../config'
const TruffleContract = require('@truffle/contract')

const zeroAddress = '0x0000000000000000000000000000000000000000'

const initializeContracts = async () => {
  const provider = new Web3.providers.HttpProvider(
    `https://mainnet.infura.io:443/v3/${process.env.REACT_APP_INFURA_TOKEN}`
  )

  const safeContract = TruffleContract(GnosisSafeJson)
  safeContract.setProvider(provider)
  const safeInstance = await safeContract.at(mainnetConfig.safeMasterCopy)

  const proxyFactoryContract = TruffleContract(GnosisSafeProxyFactoryJson)
  proxyFactoryContract.setProvider(provider)
  const proxyFactoryInstance = await proxyFactoryContract.at(
    mainnetConfig.safeMasterCopy
  )

  return { safeInstance, proxyFactoryInstance }
}

export const estimateSafeSetupGas = async (): Promise<number> => {
  const { safeInstance, proxyFactoryInstance } = await initializeContracts()
  const gnosisSafeData = safeInstance.contract.methods
    .setup(
      [
        '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
        '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'
      ],
      1,
      zeroAddress,
      '0x',
      mainnetConfig.fallbackHandler,
      zeroAddress,
      0,
      zeroAddress
    )
    .encodeABI()
  const creationNonce = new Date().getTime()
  const estimatedGas =
    (await proxyFactoryInstance.createProxyWithNonce.estimateGas(
      safeInstance.address,
      gnosisSafeData,
      creationNonce
    )) + 14000

  return estimatedGas
}
