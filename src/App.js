import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Chats from './chats'
import Login from './login'
import Signup from './signup'
import Chat from './chat'
import Navbar from './components/Navbar'

function App() {

  return (
    <Router>
        <Navbar />

        <Route path="/" exact component={Chats} />
        <Route path="/create/" component={Signup} />
        <Route path="/login/" component={Login} />
        <Route path="/chats/:id" component={Chat} />
    </Router>
  );
}

export default App;
