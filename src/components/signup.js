import React, {useState} from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      body
    }
  }
`

const Signup = () => {
    const [username, setUsername] = useState("")
    const [password, setpassword] = useState("")
  
    const [createUser] = useMutation(CREATE_USER, {onCompleted(data){
      localStorage.setItem('token', data.createUser.body)
      window.location.assign("/")
    }})
  
    return (
        <div className="columns">
          <div className="column"></div>

          <div className="column">
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
              <button onClick={() => createUser({variables: {username, password}})} className="button is-primary">Submit</button>
            </div>
          </div>

          <div className="column"></div>
      </div>
    );
}

export default Signup