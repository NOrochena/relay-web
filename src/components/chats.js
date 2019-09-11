import React, {useState} from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useMutation } from '@apollo/react-hooks';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const GET_CHATS = gql`
    query Chats {
        chats {
            id
            name 
            user {
                username
            }
        }
    }
`

const NEW_CHATS = gql`
  subscription {
    newChat {
      id
      name
      user {
          username
      }
    }
  }
`

const CREATE_CHAT = gql`
  mutation CreateChat($name: String!) {
      createChat(name: $name) {
          id
          name 
          user {
              username
          }
      }
  }
`

const Users = () => {
    const [name, setName] = useState("")
    const {error, loading, data, subscribeToMore} = useQuery(GET_CHATS)
    const [createChat] = useMutation(CREATE_CHAT)

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    subscribeToMore({
        document: NEW_CHATS,
        updateQuery: (prev, {subscriptionData}) => {
            if (!subscriptionData.data) return prev;
            const newFeedItem = subscriptionData.data.newChat;
            if (prev.chats.length > 0 && prev.chats[prev.chats.length-1].id === newFeedItem.id) return prev
            return Object.assign({}, prev, {
                  chats: [ ...prev.chats, newFeedItem]
              });
        }
    })

    return (
        <div className="columns">
            <div className="column"></div>
            <div className="column">
                <h1 className="title">
                    Active Chats
                </h1>

                <div className="field is-grouped">
                    <p className="control is-expanded">
                        <input 
                            value={name} 
                            className="input" 
                            type="text" 
                            placeholder="Enter chat name"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </p>
                    <p className="control">
                        <button className="button is-info" onClick={() => {createChat({variables: {name}}); setName("")}}>
                        Create Chat
                        </button>
                    </p>
                </div>

                <hr/>

                <ul>
                    {data.chats.map(chat => (
                        <li key={chat.id}><Link to={`/chats/${chat.id}`}>{chat.name}</Link> | Created by: {chat.user.username}</li>
                    ))} 
                </ul>
            </div>
            <div className="column"></div>
        </div>
    )
}

export default Users