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
      console.log(data)
    }})
  
    return (
        <div className="App">
          <input value={username} onChange={(e) => setUsername(e.target.value)}/>
          <input value={password} onChange={(e) => setpassword(e.target.value)}/>
          <button onClick={() => createUser({variables: {username, password}})}>
            Create
          </button>
        </div>
    );
}

export default Signup