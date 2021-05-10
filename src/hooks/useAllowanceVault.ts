import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import useBao from './useBao'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { getAllowance } from '../utils/erc20'
import { getVaultContract } from '../bao/utils'

const useAllowance = (tokenContract: Contract) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account }: { account: string; ethereum: provider } = useWallet()
  const bao = useBao()
  const vaultContract = getVaultContract(bao)

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      tokenContract,
      vaultContract,
      account,
    )
    setAllowance(new BigNumber(allowance))
  }, [account, vaultContract, tokenContract])

  useEffect(() => {
    if (account && vaultContract && tokenContract) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, vaultContract, tokenContract])

  return allowance
}

export default useAllowance
