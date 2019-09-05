import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Chats from './chats'
import Login from './login'
import Signup from './signup'
import Chat from './chat'


function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login/">Login</Link>
            </li>
            <li>
              <Link to="/create/">Create User</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Chats} />
        <Route path="/create/" component={Signup} />
        <Route path="/login/" component={Login} />
        <Route path="/chats/:id" component={Chat} />
      </div>
    </Router>
  );
}

export default App;
