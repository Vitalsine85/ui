import BigNumber from 'bignumber.js'
import React, { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import { Contract } from 'web3-eth-contract'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import IconButton from '../../../components/IconButton'
import { AddIcon } from '../../../components/icons'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import Modal, { ModalProps } from '../../../components/Modal'
import useModal from '../../../hooks/useModal'
import useDepositVault from '../../../hooks/useDepositVault'
import useVaultBalance from '../../../hooks/useVaultBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useWitdrawVault from '../../../hooks/useWithdrawVault'
import { getBalanceNumber } from '../../../utils/formatBalance'
import TokenInput from '../../../components/TokenInput'
import { getVaultContract, getVaultPoolContract } from '../../../bao/utils'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import useBao from '../../../hooks/useBao'
import baoIcon from '../../../assets/img/bao.png'
import Spacer from '../../../components/Spacer'
import WithdrawModal from './WithdrawModal'

interface VaultWithdrawProps {
	vaultContract: Contract
	poolContract: Contract
	max: BigNumber
}

const VaultWithdraw: React.FC<VaultWithdrawProps> = ({ 
	max
 }) => {
	const bao = useBao()
	const tokenAAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
	const tokenBAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
	const tokenAName = 'USDC'
	const tokenADecimals = 6
	const tokenBName = 'WETH'
	const tokenBDecimals = 18
	const tokenABalance = useVaultBalance()
	const tokenBBalance = useVaultBalance()
	const [val, setVal] = useState('')
	const [pendingTx, setPendingTx] = useState(false)

	const vaultAddress = useMemo(() => getVaultContract(bao)?.options.address, [
		bao,
	])
	const poolAddress = useMemo(() => getVaultPoolContract(bao)?.options.address, [
		bao,
	])

	const vaultContract = useMemo(() => getVaultContract(bao), [bao])
	const poolContract = useMemo(() => getVaultPoolContract(bao), [bao])
	
	const vaultSharesName = 'Vault Shares'
	const vaultShares = useTokenBalance(vaultAddress)

	const [requestedApproval, setRequestedApproval] = useState(false)

	const allowance = useAllowance(vaultContract)
	const { onApprove } = useApprove(vaultContract)

	const { onDeposit } = useDepositVault(vaultAddress)
	const { onWithdraw } = useWitdrawVault(vaultAddress)

	const handleApprove = useCallback(async () => {
		try {
			setRequestedApproval(true)
			const txHash = await onApprove()
			// user rejected tx or didn't go thru
			if (!txHash) {
				setRequestedApproval(false)
			}
		} catch (e) {
			console.log(e)
		}
	}, [onApprove, setRequestedApproval])

	const tokenBalance = useTokenBalance(vaultContract.options.address)
	const vaultBalance = useVaultBalance()

	const handleChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			setVal(e.currentTarget.value)
		},
		[setVal],
	)

	const fullBalance = useMemo(() => {
		return getFullDisplayBalance(max)
	}, [max])

	const handleSelectMax = useCallback(() => {
		setVal(fullBalance)
	}, [fullBalance, setVal])

	return (
		<Card>
			<CardContent>
				<StyledCardContentInner>
					<StyledCardHeader>
						<CardIcon>
							<img src={baoIcon} height={50} />
						</CardIcon>
						<Label text={`Withdraw ${tokenAName}/${tokenBName}`} />
						<Value value={val} />
						<Label text={vaultSharesName} />
					</StyledCardHeader>
					<Spacer />
					<WithdrawModal 
						max={vaultBalance}
						onConfirm={onWithdraw}
					/>
				</StyledCardContentInner>
			</CardContent>
		</Card>
	)
}

const StyledCardHeader = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
`

const StyledActionSpacer = styled.div`
	height: ${(props) => props.theme.spacing[4]}px;
	width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
	align-items: center;
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
`



export default VaultWithdraw
