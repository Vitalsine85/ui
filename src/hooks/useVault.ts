import { useCallback, useEffect, useMemo, useState } from 'react'

import { useWallet } from 'use-wallet'

import {
  getWithdrawableBalance,
  getVaultContract,
  getBaoAddress,
} from '../bao/utils'
import BigNumber from 'bignumber.js'

import useBlock from './useBlock'
import { Bao } from '../bao'

export const useVaultWithdrawableBalance = (bao: Bao): BigNumber => {
  const { account } = useWallet()
  const [withdrawableBalance, setWithdrawableBalance] = useState(
    new BigNumber(0),
  )
  const block = useBlock()

  const VaultContract = useMemo(() => getVaultContract(bao), [
    bao,
  ])

  const fetchVaultWithdrawableBalance = useCallback(async () => {
    let balance = await getWithdrawableBalance(
      VaultContract,
      account,
      getVaultContract(bao)?.options.address,
    )
    if (balance.isGreaterThan(0)) {
      setWithdrawableBalance(new BigNumber(balance))
    } else {
      balance = await getWithdrawableBalance(
        VaultContract,
        account,
        getBaoAddress(bao),
      )
    }
    setWithdrawableBalance(new BigNumber(balance))
  }, [bao, account, VaultContract])

  useEffect(() => {
    if (account) {
      fetchVaultWithdrawableBalance()
    }
  }, [account, block])

  return withdrawableBalance
}
