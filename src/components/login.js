import React, {useState} from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const LOGIN = gql`
  mutation UserLogin($username: String!, $password: String!) {
    userLogin(username: $username, password: $password) {
      body
    }
  }
`

const Login = (props) => {
    const [username, setUsername] = useState("")
    const [password, setpassword] = useState("")
  
    const [login] = useMutation(LOGIN, {onCompleted(data){
      localStorage.setItem('token', data.userLogin.body)
      window.location.assign("/")
    }})
      
    return (
        <div className="columns">
          <div className="column"></div>

          <div className="column">
            <h1 className="title">Login</h1>
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                <input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="input" 
                  type="text" 
                  placeholder="Enter username"/>
              </div>
            </div>

            <div className="field">
              <label className="label">password</label>
              <div className="control">
                <input 
                  value={password} 
                  onChange={(e) => setpassword(e.target.value)} 
                  className="input" 
                  type="password" 
                  placeholder="Enter password"/>
              </div>
            </div>

            <div className="control">
              <button onClick={() => login({variables: {username, password}})} className="button is-primary">Login</button>
            </div>
          </div>

          <div className="column"></div>

        </div>
    );
}

export default Login