import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("chatapp")
    if (storedUser) {
      setAuthUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData) => {
    localStorage.setItem("chatapp", JSON.stringify(userData))
    setAuthUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("chatapp")
    setAuthUser(null)
  }

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
