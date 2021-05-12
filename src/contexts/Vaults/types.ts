import BigNumber from 'bignumber.js';
import { Contract } from 'web3-eth-contract'

export interface Vault {
  vaultAddress: string
  poolAddress: string
  token0: string
  token1: string
  vaultName: string
  vaultToken: string
  icon: string
}

export interface VaultsContext {
  vaults: Vault[]
}
