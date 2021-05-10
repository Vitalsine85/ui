import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { useWallet } from 'use-wallet'

import vaulta from '../../assets/svg/vault-a.svg'

import Button from '../../components/Button'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'
import styled from 'styled-components'
import Spacer from '../../components/Spacer'
import VaultWithdraw from './components/VaultWithdraw'
import VaultDeposit from './components/VaultDeposit'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'
import Card from '../../components/Card'
import CardContent from '../../components/CardContent'
import Label from '../../components/Label'
import useTokenBalance from '../../hooks/useTokenBalance'
import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useEffect, useState, } from 'react'
import CardIcon from '../../components/CardIcon'
import Value from '../../components/Value'
import { getBalanceNumber } from '../../utils/formatBalance'
import { getBaoAddress, getBaoContract } from '../../bao/utils'
import useBao from '../../hooks/useBao'
import { leftPad } from 'web3-utils'


const Vault: React.FC = () => {
	const { path } = useRouteMatch()
	const { account } = useWallet()
	const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)
	const bao = useBao()



	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	return (
		<Switch>
			<Page>
				{account ? (
					<>
						<Route exact path={path}>
							<PageHeader
								icon={roboa}
								title="Robo Vault"
								subtitle="Robo automatically manages your liquidity on Uniswap V3!"
							/>
						</Route>
						<StyledFarm>
							<StyledCardsWrapper>
								<StyledCardWrapper>
									<Card>
										<CardContent>
											<StyledCardContentInner>
												<p>This vault automatically manages liquidity on Uniswap V3. It concentrates its liquidity to
												earn higher yields and automatically adjusts its range orders as the underlying price moves so
												that it can continue to capture fees.</p>

												<p>By using a passive rebalancing strategy to rebalance its inventory, it avoids paying swap fees
												on Uniswap or suffering from price impact.</p>

												<Vault>
													<VaultStats>
														<h4>Vault Holdings</h4>
														<StyledValue> {'totalTokenABalance'} </StyledValue>
														<Label text={`Total {tokena} in Vault`} />

														<StyledValue> {'totalTokenBBalance'} </StyledValue>
														<Label text={`Total {tokenb} in Vault`} />
													</VaultStats>
													<VaultStats>
														<h4>Deposit cap</h4>
														<StyledValue> {'percentDepositCapUsed'} </StyledValue>
														<Label text={`% of Cap Used`} />

														<StyledValue> {'maxTokenA'} </StyledValue>
														<Label text={`Max {tokena} in Vault`} />

														<StyledValue> {'maxTokenB'} </StyledValue>
														<Label text={`Max {tokenb} in Vault`} />
													</VaultStats>
													<VaultStats>
														<h4>Vault positions</h4>
														<StyledValue> {'tokenPairPrice'} </StyledValue>
														<Label text={`{tokena}/{tokenb} Price`} />

														<StyledValue> {'baseOrderRange'} </StyledValue>
														<Label text={`Base Order`} />

														<StyledValue> {'limitOrderRange'} </StyledValue>
														<Label text={`Limit Order`} />
													</VaultStats>
												</Vault>
												<h4>Contracts</h4>
												Vault | Uniswap V3 Pool | WETH / USDC
											</StyledCardContentInner>
										</CardContent>
									</Card>
								</StyledCardWrapper>
							</StyledCardsWrapper>
							<Spacer size="lg" />
							<StyledCardsWrapper>
								<StyledCardWrapper>
									<VaultModal>
										<VaultWithdraw />
									</VaultModal>
								</StyledCardWrapper>
								<Spacer />
								<StyledCardWrapper>
									<VaultModal>
										<VaultDeposit />
									</VaultModal>
								</StyledCardWrapper>
							</StyledCardsWrapper>
							<Spacer size="lg" />
							<StyledInfo>
								<p>
									ℹ️️ Additional Info
													</p>

							</StyledInfo>
							<Spacer size="lg" />
						</StyledFarm>
					</>

				) : (
					<div
						style={{
							alignItems: 'center',
							display: 'flex',
							flex: 1,
							justifyContent: 'center',
						}}
					>
						<Button
							onClick={onPresentWalletProviderModal}
							text="🔓 Unlock Wallet"
						/>
					</div>
				)}
			</Page>
		</Switch >

	)
}

const StyledFarm = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	@media (max-width: 768px) {
		width: 100%;
	}
`

const StyledCardsWrapper = styled.div`
	display: flex;
	width: 900px;
	@media (max-width: 768px) {
		width: 100%;
		flex-flow: column nowrap;
		align-items: center;
	}
`
const StyledCardWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	@media (max-width: 768px) {
		width: 80%;
	}
`

const StyledCardContentInner = styled.div`
	align-items: center;
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
`

const StyledInfo = styled.h3`
	color: ${(props) => props.theme.color.grey[500]};
	font-size: 16px;
	font-weight: 400;
	margin: 0;
	padding: 0;
	text-align: center;
	@media (max-width: 900px) {
		width: 90%;
	}
	width: 900px;
`

const Vault = styled.div`
display: flex;
justify-content: space-between;
width: 900px;
@media (max-width: 768px) {
	width: 100%;
	flex-flow: column nowrap;
	align-items: center;
}
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
const VaultModal = styled.div`
width: 400px;
text-align: center;
@media (max-width: 768px) {
	width: 100%;
	flex-flow: column nowrap;
	align-items: center;
}
`

const StyledLink = styled.a`
	color: ${(props) => props.theme.color.grey[500]};
	text-decoration: none;
	font-weight: 600;
	&:hover {
		color: ${(props) => props.theme.color.grey[600]};
	}
`

const StyledValue = styled.div`
	font-family: 'Vaultto Mono', monospace;
	color: ${(props) => props.theme.color.grey[600]};
	font-size: 16px;
	font-weight: 700;
`

export default Vault
