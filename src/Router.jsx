import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const AppRouter = () => (
  <Router>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/tasks' component={Tasks} />
      <Route path='/projects' component={Projects} />
      <Route path='/team' component={Team} />
      <Route path='/profile' component={Profile} />
      <Route path='/settings' component={Settings} />
    </Switch>
  </Router>
);

export default AppRouter;