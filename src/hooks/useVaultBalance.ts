import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getVaulted, getVaultPoolContract } from '../bao/utils'
import useBao from './useBao'
import useBlock from './useBlock'
import { ethers } from 'ethers'

const useVaultBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const bao = useBao()
  const poolContract = getVaultPoolContract(bao)
  const block = useBlock()
  let vaultBalance

  const fetchBalance = useCallback(async () => {
    BigNumber.config({ DECIMAL_PLACES: 18 })
    const balance = await getVaulted(poolContract)
    vaultBalance = new BigNumber(balance)
    setBalance(vaultBalance.decimalPlaces(18))
  }, [account, bao])

  useEffect(() => {
    if (account && bao) {
      fetchBalance()
    }
  }, [account, setBalance, block, bao])

  return balance.decimalPlaces(18)
}

export default useVaultBalance
