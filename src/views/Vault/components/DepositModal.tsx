import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import ModalContent from '../../../components/ModalContent'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useDepositVault from '../../../hooks/useDepositVault'
import { getVaultContract, getVaultPoolContract } from '../../../bao/utils'
import useBao from '../../../hooks/useBao'
import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'

interface DepositModalProps extends ModalProps {
    max: BigNumber
    onConfirm: (amount: string) => void
    tokenAName?: string
    tokenBName?: string
}

const DepositModal: React.FC<DepositModalProps> = ({
    onConfirm,
    onDismiss,
    max,
    tokenAName = 'USDC',
    tokenBName = 'WETH',
}) => {
    const [val, setVal] = useState('')
    const [pendingTx, setPendingTx] = useState(false)
	const bao = useBao()

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

    const vaultAddress = useMemo(() => getVaultContract(bao)?.options.address, [
		bao,
	])
	const poolAddress = useMemo(() => getVaultPoolContract(bao)?.options.address, [
		bao,
	])

	const vaultContract = useMemo(() => getVaultContract(bao), [bao])
	const poolContract = useMemo(() => getVaultPoolContract(bao), [bao])

    const { onDeposit } = useDepositVault(vaultAddress)

    const [requestedApproval, setRequestedApproval] = useState(false)

	const allowance = useAllowance(vaultContract)
	const { onApprove } = useApprove(vaultContract)

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



    return (
<>
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
</>
    )}

    const VaultStats = styled.div`
width: 200px;
text-align: center;
@media (max-width: 768px) {
	width: 100%;
	flex-flow: column nowrap;
	align-items: center;
}
`

const StyledValue = styled.div`
	font-family: 'Vaultto Mono', monospace;
	color: ${(props) => props.theme.color.grey[600]};
	font-size: 16px;
	font-weight: 700;
`

const StyledCardActions = styled.div`
	display: flex;
	justify-content: center;
	margin-top: ${(props) => props.theme.spacing[5]}px;
	width: 100%;
`

export default DepositModal