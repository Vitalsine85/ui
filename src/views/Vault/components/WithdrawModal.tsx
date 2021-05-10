import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import styled, { keyframes } from 'styled-components'
import useBao from '../../../hooks/useBao'


interface WithdrawModalProps extends ModalProps {
	max: BigNumber
	onConfirm: (amount: string) => void
	tokenName?: string
	tokenDecimals?: number
}

const mobileKeyframes = keyframes`
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100%);
  }
`

const WithdrawModal: React.FC<WithdrawModalProps> = ({
	max,
	onConfirm,
	onDismiss,
	tokenName = '',
	tokenDecimals = 18,
}) => {
	const [val, setVal] = useState('')
	const [pendingTx, setPendingTx] = useState(false)
	const bao = useBao()

	const fullBalance = useMemo(() => {
		return getFullDisplayBalance(max, tokenDecimals)
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
		<VaultModal>
			<InnerVault>
			<ModalTitle text={`Withdraw Vault Shares`} />
			<TokenInput
				value={val}
				onSelectMax={handleSelectMax}
				onChange={handleChange}
				max={fullBalance}
				symbol='Shares'
			/>
			<ModalActions>
				<Button text="Cancel" variant="secondary" onClick={onDismiss} />
				<Button
					disabled={pendingTx}
					text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
					onClick={async () => {
						setPendingTx(true)
						await onConfirm(val)
						setPendingTx(false)
						onDismiss()
					}}
				/>
			</ModalActions>
			</InnerVault>
		</VaultModal>
	)
}

export default WithdrawModal

const VaultModal = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	position: relative;
	width: 100%;
	max-width: 512px;
	@media (max-width: ${(props) => props.theme.breakpoints.mobile}px) {
		flex: 1;
		position: absolute;
		top: 100%;
		right: 0;
		left: 0;
		max-height: calc(100% - ${(props) => props.theme.spacing[4]}px);
		animation: ${mobileKeyframes} 0.3s forwards ease-out;
	}
`

const InnerVault = styled.div`
	padding: 0 20px;
	background: ${(props) => props.theme.color.grey[200]};
	border: 1px solid ${(props) => props.theme.color.grey[300]}ff;
	border-radius: 12px;
	box-shadow: inset 1px 1px 0px ${(props) => props.theme.color.grey[100]};
	display: flex;
	flex-direction: column;
	position: relative;
	width: 100%;
	min-height: 0;
`
