import React from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const GET_CHATS = gql`
    query Chats {
        chats {
            id 
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
      user {
          username
      }
    }
  }
`

const Users = () => {
    const {error, loading, data, subscribeToMore} = useQuery(GET_CHATS)

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
        <ul>
            {data.chats.map(chat => (
                <li key={chat.id}><Link to={`/chats/${chat.id}`}>{chat.user.username}'s Chat</Link></li>
            ))} 
        </ul>
    )
}

export default Users