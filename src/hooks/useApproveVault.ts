import { useCallback, useMemo } from 'react'
import { Contract } from 'web3-eth-contract'
import useBao from './useBao'
import { useWallet } from 'use-wallet'
import { approve, getVaultContract } from '../bao/utils'

const useApproveVault = (contract: Contract) => {
  const { account }: { account: string } = useWallet()
  const bao = useBao()
  const vaultContract = useMemo(() => getVaultContract(bao), [
    bao,
  ])

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(contract, vaultContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, contract, vaultContract])

  return { onApprove: handleApprove }
}

export default useApproveVault
