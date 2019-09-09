import React, {useState} from 'react'
import gql from 'graphql-tag';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { useMutation } from '@apollo/react-hooks';

const GET_CHAT = gql`
    query Chat($id: ID!) {
        chat(id: $id) {
            messages {
                id
                content
                user {
                    username
                }
            }
        }
    }
`

const CREATE_MESSAGE = gql`
    mutation CreateMessage($chatId: String!, $content: String!) {
        createMessage(chatId: $chatId, content: $content) {
            id
            content
            user {
                username
            }
        }
    }
`
const NEW_MESSAGE = gql`
  subscription MessageWasPosted($chatId: ID!) {
    messageWasPosted(chatId: $chatId) {
        id
    }
  }
`

const Chat = props => {
    let chatId = props.match.params.id
    const [content, setContent] = useState("")
    const {subscribeToMore, error, loading, data} = useQuery(GET_CHAT, 
        {variables: {id: chatId}, 
    })
    const [createMessage] = useMutation(CREATE_MESSAGE)

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    subscribeToMore({
        document: NEW_MESSAGE,
        variables: {chatId},
        updateQuery: (prev, {subscriptionData}) => {
            console.log("trigger")
            if (!subscriptionData) return prev;
            const newFeedItem = subscriptionData.data.messageWasPosted
            console.log('trigger')
            return Object.assign({}, prev, {
                entry: {
                    messages: [newFeedItem, ...prev.entry.messages]
                }
            })
        }
    })

    return (
        <div>
            {data.chat.messages.map(message => (
                <div key={message.id}>{message.content} - {message.user.username}</div>
            ))}
            <input value={content} onChange={(e) => setContent(e.target.value)}/>
            <button onClick={() => createMessage({variables: {content, chatId}})}>Submit</button>
        </div>
    )
}

export default Chat