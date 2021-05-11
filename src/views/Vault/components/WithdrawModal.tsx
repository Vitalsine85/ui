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
import useWithdrawVault from '../../../hooks/useWithdrawVault'
import useBao from '../../../hooks/useBao'
import { getVaultContract, getVaultPoolContract } from '../../../bao/utils'

interface WithdrawModalProps extends ModalProps {
    max: BigNumber
    onConfirm: (amount: string) => void
    tokenAName?: string
    tokenBName?: string
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
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

    const { onWithdraw } = useWithdrawVault(vaultAddress)

    return (
<>
<TokenInput
value={val}
onSelectMax={handleSelectMax}
onChange={handleChange}
max={fullBalance}
symbol={'Vault Shares'}
/>
<h4>You will recieve</h4>
<Vault>
<VaultStats>
<StyledValue> {'tokenABalance'} </StyledValue>
<Label text={tokenAName} />
</VaultStats>
<VaultStats>
<StyledValue> {'tokenBBalance'} </StyledValue>
<Label text={tokenBName} />
</VaultStats>
</Vault>
<StyledCardActions>
<Button
    disabled={pendingTx}
    text={pendingTx ? 'Pending Confirmation' : 'Withdraw'}
    onClick={async () => {
        setPendingTx(true)
        await onWithdraw()
        setPendingTx(false)
    }}
/>
</StyledCardActions>
</>
    )}

const Vault = styled.div`
display: flex;
justify-content: space-between;
width: 100%;
`

const VaultStats = styled.div`
width: 150px;
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

export default WithdrawModal