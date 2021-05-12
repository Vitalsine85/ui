import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import type { CountdownRenderProps } from 'react-countdown'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Loader from '../../../components/Loader'
import Spacer from '../../../components/Spacer'
import { Vault } from '../../../contexts/Vaults'
import useAllStakedValue, {
	StakedValue,
} from '../../../hooks/useAllStakedValue'
import useVaults from '../../../hooks/useVaults'
import useBao from '../../../hooks/useBao'
import { bnToDec } from '../../../utils'
import { Tabs, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './tab-styles.css';

const cardsPerRow = 3;

const VaultCards: React.FC = () => {
	const [vaults] = useVaults()
	const { account } = useWallet()

	return (
		<Tabs>
			<TabPanel>
				<StyledCards>
							<React.Fragment key={i}>
								<FarmCard vault={vault} />
								{((i + 1) % (cardsPerRow) !== 0) && <StyledSpacer />}
							</React.Fragment>
						))
				 } : (
								<StyledLoadingWrapper>
									<Loader text="Cooking the rice ..." />
								</StyledLoadingWrapper>
							)
				</StyledCards>
			</TabPanel>
		</Tabs>
	);
}

interface VaultCardProps {
	vault: Vault
}

const FarmCard: React.FC<VaultCardProps> = ({ vault }) => {
	const [startTime, setStartTime] = useState(0)
	const [harvestable, setHarvestable] = useState(0)

	const { account } = useWallet()
	const { vaultAddress } = vault
	const bao = useBao()

	const vaultActive = true // startTime * 1000 - Date.now() <= 0

	return (
		<StyledCardWrapper>
			<Card>
				<CardContent>
					<StyledContent>
						<CardIcon>
							<img src={vault.icon} alt="" height="50" />
						</CardIcon>
						<StyledTitle>{vault.vaultName}</StyledTitle>
						<StyledDetails>
							<StyledDetail>Deposit {vault.vaultName.toUpperCase()}</StyledDetail>
							<StyledDetail>Get {vault.vaultToken.toUpperCase()}</StyledDetail>
						</StyledDetails>
						<Spacer />
						<Button
							disabled={!vaultActive}
							text={vaultActive ? 'Select' : undefined}
							to={`/vaults/${vault.vaultAddress}`}
						>
						</Button>
						<Spacer />
						<StyledInsight>
							<span>APY</span>
							<span>APY</span>
							<span>APY</span>
							<span>APY</span>
						</StyledInsight>
					</StyledContent>
				</CardContent>
			</Card>
		</StyledCardWrapper>
	)
}

const RainbowLight = keyframes`
  
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccent = styled.div`
	background: linear-gradient(
		45deg,
		rgba(255, 0, 0, 1) 0%,
		rgba(255, 154, 0, 1) 10%,
		rgba(208, 222, 33, 1) 20%,
		rgba(79, 220, 74, 1) 30%,
		rgba(63, 218, 216, 1) 40%,
		rgba(47, 201, 226, 1) 50%,
		rgba(28, 127, 238, 1) 60%,
		rgba(95, 21, 242, 1) 70%,
		rgba(186, 12, 248, 1) 80%,
		rgba(251, 7, 217, 1) 90%,
		rgba(255, 0, 0, 1) 100%
	);
	background-size: 300% 300%;
	animation: ${RainbowLight} 2s linear infinite;
	border-radius: 12px;
	filter: blur(6px);
	position: absolute;
	top: -2px;
	right: -2px;
	bottom: -2px;
	left: -2px;
	z-index: -1;
`

const StyledCards = styled.div`
	width: 900px;
	display: flex;
	flex-flow: row wrap;
	justify-content: space-evenly;
	@media (max-width: 768px) {
		width: 100%;
		flex-flow: column nowrap;
		align-items: center;
	}
`

const StyledLoadingWrapper = styled.div`
	align-items: center;
	display: flex;
	flex: 1;
	justify-content: center;
`

const StyledCardWrapper = styled.div`
	display: flex;
	margin-top: ${(props) => props.theme.spacing[4]}px;
	width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
	position: relative;
`

const StyledTitle = styled.h4`
	color: ${(props) => props.theme.color.grey[600]};
	font-size: 19px;
	font-weight: 700;
	margin: ${(props) => props.theme.spacing[2]}px 0 0;
	padding: 0;
`

const StyledContent = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
`

const StyledSpacer = styled.div`
	height: ${(props) => props.theme.spacing[4]}px;
	width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
	margin-top: ${(props) => props.theme.spacing[2]}px;
	text-align: center;
`

const StyledDetail = styled.div`
	color: ${(props) => props.theme.color.grey[500]};
`

const StyledInsight = styled.div`
	display: flex;
	justify-content: space-between;
	box-sizing: border-box;
	border-radius: 8px;
	background: #fffdfa;
	color: #aa9584;
	width: 100%;
	margin-top: 12px;
	line-height: 32px;
	font-size: 13px;
	border: 1px solid #e6dcd5;
	text-align: center;
	padding: 0 12px;
`

export default VaultCards
