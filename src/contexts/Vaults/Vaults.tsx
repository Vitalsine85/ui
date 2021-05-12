import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import useBao from '../../hooks/useBao'

import { bnToDec } from '../../utils'
import { getMasterChefContract, getEarned } from '../../bao/utils'
import { getVaults } from '../../bao/utils'

import Context from './context'
import { Vault } from './types'

const Vaults: React.FC = ({ children }) => {
	const bao = useBao()
	const { account } = useWallet()

	const vaults = getVaults(bao)

	return (
		<Context.Provider
			value={{
				vaults,
			}}
		>
			{children}
		</Context.Provider>
	)
}

export default Vaults
