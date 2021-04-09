import './App.css';
import MainPage from "./components/mainPage.js"
import { Route, Switch } from 'react-router-dom';
import RecipePage from './components/recipePage';

function App() {
  return (
    <main>
      <Switch>
        <Route path="/" component={MainPage} exact />
        <Route path="/recipe" component={RecipePage} />
        <Route component={Error} />
      </Switch>
    </main>
  );
}

const Error = () => (
  <h1>Oops! Page not found!</h1>
)

export default App;
