import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Chats from './components/chats'
import Login from './components/login'
import Signup from './components/signup'
import Chat from './components/chat'
import Navbar from './components/Navbar'

function App() {

  return (
    <Router>
        <Navbar />

        <Route path="/" exact component={Chats} />
        <Route path="/signup/" component={Signup} />
        <Route path="/login/" component={Login} />
        <Route path="/chats/:id" component={Chat} />
    </Router>
  );
}

export default App;
