import GnosisSafeJson from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import GnosisSafeProxyFactoryJson from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafeProxyFactory.json'
import { mainnetConfig } from '../config'
import { generateAddresses, getWeb3, zeroAddress } from '../utils'
import { BigNumber } from 'bignumber.js'
const TruffleContract = require('@truffle/contract')

const initializeContracts = async () => {
  const web3 = getWeb3()

  const safeContract = TruffleContract(GnosisSafeJson)
  safeContract.setProvider(web3.currentProvider)
  const safeInstance = await safeContract.at(mainnetConfig.safeMasterCopy)

  const proxyFactoryContract = TruffleContract(GnosisSafeProxyFactoryJson)
  proxyFactoryContract.setProvider(web3.currentProvider)
  const proxyFactoryInstance = await proxyFactoryContract.at(
    mainnetConfig.safeMasterCopy
  )

  return { safeInstance, proxyFactoryInstance }
}

export const estimateSafeSetupGas = async (numOwners: number): Promise<BigNumber> => {
  const { safeInstance, proxyFactoryInstance } = await initializeContracts()
  const ownerList = generateAddresses(numOwners)
  const gnosisSafeData = safeInstance.contract.methods
    .setup(
      ownerList,
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

  return new BigNumber(estimatedGas)
}
