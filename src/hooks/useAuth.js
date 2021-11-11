import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useContext,
  createContext
} from 'react'
import jwt_decode from 'jwt-decode'
import useFetch from './useFetch'
import { getTokenFromLocalStorage, isTokenExpired } from '../utils'
import { BASE_URL } from '../constants/baseURL'

const useAuth = (suffixPath = '') => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const url = useMemo(() => `${BASE_URL}/${suffixPath}`, [suffixPath])
  const { fetchData } = useFetch(url, { method: 'POST' })

  const verifyAuth = useCallback(() => {
    try {
      setToken(() => getTokenFromLocalStorage())
      if (token && !isTokenExpired(token)) {
        const user = jwt_decode(token)
        setUser(() => user)
        setIsLoggedIn(true)
        return
      }
    } catch (e) {
      console.log(e)
    }
    setUser(() => null)
    setIsLoggedIn(false)
  }, [token])

  const signIn = useCallback(
    (username, password) => {
      fetchData('/login', { username, password }, (res) => setToken(res.token))
    },
    [fetchData]
  )

  const signUp = useCallback(
    (username, email, password) => {
      fetchData('', { username, email, password })
    },
    [fetchData]
  )

  const logout = useCallback(() => {
    localStorage.remove('token') // TODO ?
    verifyAuth()
  }, [verifyAuth])

  useEffect(() => verifyAuth(), [verifyAuth])

  return {
    user,
    token,
    isLoggedIn,
    verifyAuth,
    signIn,
    signUp,
    logout
  }
}

export default useAuth

const AuthContext = createContext()

export const ProvideAuth = ({ children }) => {
  const auth = useAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
