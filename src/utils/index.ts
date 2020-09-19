import BigNumber from 'bignumber.js'
import Web3 from 'web3'

export const zeroAddress = '0x0000000000000000000000000000000000000000'

let web3: any

const getInfuraUrl = () => {
  return `https://mainnet.infura.io:443/v3/${process.env.REACT_APP_INFURA_TOKEN}`
}

export const getWeb3 = () => web3 ? web3 : new Web3(getInfuraUrl())

export const generateAddresses = (numAddresses: number): string[] => {
  const web3 = getWeb3()
  const addresses: string[] = []
  for(let i = 0; i < numAddresses; i++) {
    const address = web3.eth.accounts.create().address
    addresses.push(address)
  }
  return addresses
}

export const fromWeiToGwei = (weiAmount: BigNumber): BigNumber => {
  const web3 = getWeb3()
  const gweiAmount: string = web3.utils.fromWei(weiAmount.toString(), 'Gwei')
  return new BigNumber(gweiAmount.toString()).decimalPlaces(5)
}

export const fromWeiToEther = (weiAmount: BigNumber): BigNumber => {
  const web3 = getWeb3()
  const ethAmount: string = web3.utils.fromWei(weiAmount.toString(), 'ether')
  return new BigNumber(ethAmount.toString()).decimalPlaces(5)
}
