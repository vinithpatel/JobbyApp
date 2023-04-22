import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    isUserValid: true,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSuccesfullLogin = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onFailureLogin = errorMsg => {
    this.setState({isUserValid: false, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const userDetails = {
      username,
      password,
    }

    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onSuccesfullLogin(data.jwt_token)
    } else {
      this.onFailureLogin(data.error_msg)
    }
  }

  render() {
    const {username, password, isUserValid, errorMsg} = this.state
    if (Cookies.get('jwt_token') !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-page-bg-container">
        <form className="jobby-login-form" onSubmit={this.onSubmitForm}>
          <img
            className="login-form-website-log"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <div className="input-container">
            <label htmlFor="username" className="input-label">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              value={username}
              className="user-input"
              placeholder="Username"
              onChange={this.onChangeUsername}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password" className="input-label">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              className="user-input"
              placeholder="Password"
              onChange={this.onChangePassword}
            />
          </div>
          {!isUserValid && <p className="error-msg">{errorMsg}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default LoginForm
