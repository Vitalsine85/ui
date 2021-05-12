import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { useWallet } from 'use-wallet'

import roboa from '../../assets/svg/robo-a.svg'

import Button from '../../components/Button'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'

import Vault from '../Vault'

import VaultCards from './components/VaultCards'

const Vaults: React.FC = () => {
	const { path } = useRouteMatch()
	const { account } = useWallet()
	const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)
	return (
		<Switch>
			<Page>
				{account ? (
					<>
						<Route exact path={path}>
							<PageHeader
								icon={roboa}
								title="Robo Vaults"
								subtitle="Robo automatically manages your liquidity on Uniswap V3!"
							/>
							<VaultCards />
						</Route>
						<Route path={`${path}/:vaultId`}>
							<Vault />
						</Route>
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
		</Switch>
	)
}

export default Vaults
