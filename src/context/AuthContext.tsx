// ** React Imports
import { createContext, ReactNode, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios Instance
import AxiosInstance from 'src/configs/axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, ErrCallbackType, LoginParams, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {

  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await AxiosInstance
          .post(authConfig.meEndpoint)
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data })

          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    AxiosInstance
      .post(authConfig.loginEndpoint, params)
      .then(async response => {

        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.token.access_token)
          : null

        const returnUrl = router.query.returnUrl

        setUser({ ...response.data.data })
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.data)) : null

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        console.log("🚀 ~ handleLogin ~ redirectURL:", { redirectURL })

        router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}



export { AuthContext, AuthProvider }
