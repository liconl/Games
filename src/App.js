import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Snake from "./snake/Snake";
import Navbar from "./Navbar";
import TicTacToe from "./tictactoe/Tictactoe";
import Colorgame from "./colorgame/Colorgame";
import Body from "./Body";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/colorgame">
            <Navbar />
            <Colorgame />
          </Route>
          <Route path="/snake">
            <Navbar />
            <Snake />
          </Route>
          <Route path="/tictactoe">
            <Navbar />
            <TicTacToe />
          </Route>
          <Route path="/">
            <Navbar />
            <Body />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
