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

    console.log(props)
  
    return (
        <div>
          <input value={username} onChange={(e) => setUsername(e.target.value)}/>
          <input value={password} onChange={(e) => setpassword(e.target.value)}/>
          <button onClick={() => login({variables: {username, password}})}>
            Login
          </button>
        </div>
    );
}

export default Login