import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="header-container">
      <ul className="h-container">
        <Link to="/">
          <li>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="websiteLogo"
            />
          </li>
        </Link>
        <div className="menu-container">
          <Link to="/">
            <li className="menu-item">Home</li>
          </Link>
          <Link to="/jobs">
            <li className="menu-item">Jobs</li>
          </Link>
        </div>
        <button type="button" className="h-button" onClick={onLogout}>
          Logout
        </button>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
