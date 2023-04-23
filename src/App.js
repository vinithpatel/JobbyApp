import {Switch, Route, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import Jobs from './components/Jobs'

import './App.css'

const App = () => (
  <div className="jobby-bg-container">
    <Switch>
      <Route exact path="/login" component={LoginForm} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/jobs" component={Jobs} />
    </Switch>
  </div>
)

export default App
