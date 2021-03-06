import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import "./App.css";
import CalendarView from "./Calendar/CalendarView";
import NavBar from "./Components/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import Profile from "./Components/Profile";
import Admin from "./Admin";
import history from "./Utils/History";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="App">
      <Router history={history}>
        <header>
          <NavBar />
        </header>
        <Switch>
          <Route path="/" exact component={CalendarView} />
          {/* <Route path="/admin" exact component={Admin} /> */}
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
