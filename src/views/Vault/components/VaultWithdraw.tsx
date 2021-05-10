import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import { getBalanceNumber } from '../../../utils/formatBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { Contract } from 'web3-eth-contract'
import useModal from '../../../hooks/useModal'
import WithdrawModal from './WithdrawModal'
import BigNumber from 'bignumber.js'
import { getVaultContract } from '../../../bao/utils'
import useDeposit from '../../../hooks/useDepositVault'
import useBao from '../../../hooks/useBao'
import DepositModal from './DepositModal'
import useWithdraw from '../../../hooks/useWithdrawVault'
import useAllowanceVault from '../../../hooks/useAllowanceVault'
import useApproveVault from '../../../hooks/useApproveVault'
import TokenInput from '../../../components/TokenInput'
import Spacer from '../../../components/Spacer'
import StyledValue from '../../../components/Value'


interface VaultWithdraw {
	withdrawableBalance: BigNumber
}

const VaultWithdraw: React.FC<VaultWithdraw> = ({ withdrawableBalance }) => {
	const bao = useBao()

	const address = useMemo(() => getVaultContract(bao)?.options.address, [
		bao,
	])
	const tokenAName = 'TOKENA'
	const tokenBName = 'TOKENB'
	const shareName = 'SHARE'
	const tokenADecimals = 18
	const tokenBDecimals = 18

	const walletBalance = useTokenBalance(address)

	const [requestedApproval, setRequestedApproval] = useState(false)
	const contract = useMemo(() => getVaultContract(bao), [bao])
	const allowance = useAllowanceVault(contract)
	const { onApprove } = useApproveVault(contract)

	const { onDeposit } = useDeposit(address, tokenADecimals, tokenBDecimals)
	const { onWithdraw } = useWithdraw(address)

	const tokenBalance = useTokenBalance(vaultContract.options.address)
	const vaultBalance = useVaultBalance()

	const fullBalance = useMemo(() => {
		return getFullDisplayBalance(max)
	}, [max])

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
						<CardIcon>
							<img src={baoIcon} height={50} />
							<Label text={`Withdraw TokenA/TokenB`} />
						</CardIcon>
						<Value value={getVaultShares()} />
						<Label text="Vault Shares" />
					</StyledCardHeader>
					<Spacer />
					<TokenInput
						value={val}
						onSelectMax={handleSelectMax}
						onChange={handleChange}
						max={fullBalance}
						symbol={'Vault Shares'}
					/>
					<Spacer />
					<VaultStats>
						<h4>You will recieve</h4>
						<StyledValue> {'tokenAVaultBalance'} </StyledValue>
						<Label text={`TKNA`} />

						<StyledValue> {'tokenBVaultBalance'} </StyledValue>
						<Label text={`TKNB`} />
					</VaultStats>
					<StyledCardActions>
						<Button
							disabled={pendingTx}
							text={pendingTx ? 'Pending Confirmation' : 'Deposit'}
							onClick={async () => {
								setPendingTx(true)
								await onWithdraw()
								setPendingTx(false)
							}}
						/>
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
	margin-top: ${(props) => props.theme.spacing[5]}px;
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

const VaultStats = styled.div`
width: 200px;
text-align: center;
@media (max-width: 768px) {
	width: 100%;
	flex-flow: column nowrap;
	align-items: center;
}
`

export default VaultWithdraw
