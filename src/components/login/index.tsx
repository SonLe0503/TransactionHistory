import { useState } from "react"

import "../../styles/login.css"

type LoginProps = {
  navigate: (page: string) => void
}

const Login = ({ navigate }: LoginProps) => {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setErrorMessage("Vui lòng nhập tên tài khoản và mật khẩu")
      return
    }
    try {
      const response = await fetch("http://localhost:2000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại")
      }
      localStorage.setItem("token", data.access_token)
      navigate("select-bank")
    } catch (error) {
      setErrorMessage(error.message || "Đăng nhập thất bại")
    }
  }
  return (
    <>
      <div className="login-container">
        <h2>Login</h2>
        <form id="loginForm" className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <button
              type="submit"
              className="primary-button"
              onClick={(e) => handleLogin(e)}>
              Đăng nhập
            </button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
        </form>
      </div>
    </>
  )
}
export default Login
