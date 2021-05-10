import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getVaulted, getVaultContract } from '../bao/utils'
import useBao from './useBao'
import useBlock from './useBlock'
import { ethers } from 'ethers'

const useVaultBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const bao = useBao()
  const vaultContract = getVaultContract(bao)
  const block = useBlock()
  let userBalance

  const fetchBalance = useCallback(async () => {
    BigNumber.config({ DECIMAL_PLACES: 18 })
    const balance = await getVaulted(vaultContract, account)
    userBalance = new BigNumber(balance)
    setBalance(userBalance.decimalPlaces(18))
  }, [account, pid, bao])

  useEffect(() => {
    if (account && bao) {
      fetchBalance()
    }
  }, [account, pid, setBalance, block, bao])

  return balance.decimalPlaces(18)
}

export default useVaultBalance
