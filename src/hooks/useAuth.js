import { useState, useMemo, useCallback, useEffect, createContext } from 'react'
import jwt_decode from 'jwt-decode'
import useFetch from './useFetch'
import { getTokenFromLocalStorage, isTokenExpired } from '../utils'
import { BASE_URL } from '../constants/baseURL'


const useAuth = (suffixPath = '') => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const url = useMemo(() => `${BASE_URL}/${suffixPath}`, [suffixPath])
  const { fetchData } = useFetch(url, { method: 'POST'} )
  
  const verifyAuth = useCallback(() => {
    try {
      const _token = getTokenFromLocalStorage()
      if (_token && !isTokenExpired(_token)) {
        // fetchData({ suffixPath: '/check' })
        const user = jwt_decode(_token)
        setToken(_token)
        setUser(user)
        setIsLoggedIn(true)
        return
      }
    } catch(e) {
      console.log(e)
    }
    setUser(null)
    setIsLoggedIn(false)
  }, [])

  const signIn = useCallback((username, password) => {
    fetchData({
      suffixPath: '/login',
      bodyData: { username, password },
      handler: (res) => setToken(res.token)})
  }, [fetchData])

  const signUp = useCallback((username, email, password) => {
    fetchData({ bodyData: { username, email, password }})
  }, [fetchData])

  const logout = useCallback(() => {
    localStorage.remove('token') // TODO ?
    verifyAuth()
  }, [verifyAuth])

  useEffect(() => verifyAuth(), [verifyAuth])

  return {
    user,
    setUser,
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
