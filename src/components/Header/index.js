import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-bar">
      <div className="website-log-card">
        <Link className="nav-link" to="/">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
            alt="website logo"
          />
        </Link>
      </div>
      <ul className="lg-nav-links">
        <li>
          <Link className="nav-link" to="/">
            <p className="nav-link-para">Home</p>
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/jobs">
            <p className="nav-link-para">Jobs</p>
          </Link>
        </li>
      </ul>
      <button
        type="button"
        className="lg-logout-button"
        onClick={onClickLogout}
      >
        Logout
      </button>
      <ul className="sm-nav-link-buttons">
        <li>
          <Link className="nav-link" to="/">
            <AiFillHome className="nav-link-icon" />
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/jobs">
            <BsFillBriefcaseFill className="nav-link-icon" />
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="logout-icon-button"
            onClick={onClickLogout}
          >
            <FiLogOut className="nav-link-icon" />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
