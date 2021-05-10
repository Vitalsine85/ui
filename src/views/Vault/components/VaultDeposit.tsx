import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
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
import useModal from '../../../hooks/useModal'
import useDepositVault from '../../../hooks/useDepositVault'
import useVaultBalance from '../../../hooks/useVaultBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useWitdrawVault from '../../../hooks/useWithdrawVault'
import { getBalanceNumber } from '../../../utils/formatBalance'
import TokenInput from '../../../components/TokenInput'

interface VaultDepositProps {
	vaultContract: Contract
	max: BigNumber
	onConfirm: (amount: string) => void
	tokenAName: string
	tokenBName: string
}


const VaultDeposit: React.FC<VaultDepositProps> = ({ vaultContract }) => {
	const tokenAName = 'TKNA'
	const tokenADecimals = 18
	const tokenBName = 'TKNB'
	const tokenBDecimals = 18
	const walletBalance = useTokenBalance(address)
	const [val, setVal] = useState('')
	const [pendingTx, setPendingTx] = useState(false)

	const [requestedApproval, setRequestedApproval] = useState(false)

	const allowance = useAllowance(vaultContract)
	const { onApprove } = useApprove(vaultContract)

	const { onDeposit } = useDepositVault()

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

	const fullBalance = useMemo(() => {
		return getFullDisplayBalance(max)
	}, [max])

	const handleChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			setVal(e.currentTarget.value)
		},
		[setVal],
	)

	const handleSelectMax = useCallback(() => {
		setVal(fullBalance)
	}, [fullBalance, setVal])

	return (
		<Card>
			<CardContent>
				<StyledCardContentInner>
					<StyledCardHeader>
						<CardIcon>👨🏻‍🍳</CardIcon>
						<Label text={`Deposit TokenA/TokenB`} />
					</StyledCardHeader>
					<TokenInput
						value={val}
						onSelectMax={handleSelectMax}
						onChange={handleChange}
						max={fullBalance}
						symbol={tokenAName}
					/>
					<TokenInput
						value={val}
						onSelectMax={handleSelectMax}
						onChange={handleChange}
						max={fullBalance}
						symbol={tokenBName}
					/>
					<StyledCardActions>
						{!allowance.toNumber() ? (
							<>
								<Button
									disabled={requestedApproval}
									onClick={handleApprove}
									text={`Approve ${tokenAName}`}
								/>
								<Button
									disabled={requestedApproval}
									onClick={handleApprove}
									text={`Approve ${tokenBName}`}
								/>
							</>
						) : (
							<>
				<Button text="Cancel" variant="secondary" onClick={onDismiss} />
				<Button
					disabled={pendingTx}
					text={pendingTx ? 'Pending Confirmation' : 'Deposit'}
					onClick={async () => {
						setPendingTx(true)
						await onConfirm(val)
						setPendingTx(false)
						onDismiss()
					}}
				/>

							</>
						)}
					</StyledCardActions>
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
const StyledCardActions = styled.div`
	display: flex;
	justify-content: center;
	margin-top: ${(props) => props.theme.spacing[6]}px;
	width: 100%;
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

export default VaultDeposit
