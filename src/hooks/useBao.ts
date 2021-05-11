import { useContext } from 'react'
import { Context } from '../contexts/BaoProvider'
import { Bao } from '../bao'

const useBao = (): Bao => {
  const { bao } = useContext(Context)
  return bao
}

export default useBao
