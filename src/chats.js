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

const Users = () => {
    const {error, loading, data} = useQuery(GET_CHATS)

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <ul>
            {data.chats.map(chat => (
                <li key={chat.id}><Link to={`/chats/${chat.id}`}>{chat.user.username}'s Chat</Link></li>
            ))} 
        </ul>
    )
}

export default Users