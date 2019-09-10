import React, {useState} from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useMutation } from '@apollo/react-hooks';

const GET_CHAT = gql`
    query Chat($id: ID!) {
        chat(id: $id) {
            id
            name
            messages {
                id
                content
                createdAt
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
            createdAt
            user {
                username
            }
        }
    }
`
const NEW_MESSAGE = gql`
  subscription newMessage($chat: String!) {
    newMessage(chat: $chat) {
        id
        content
        createdAt
        __typename
        user {
            username
        }
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
        variables: {chat: chatId},
        updateQuery: (prev, {subscriptionData}) => {
            if (!subscriptionData) return prev;
            const newFeedItem = subscriptionData.data.newMessage
            if (prev.chat.messages.length > 0 && prev.chat.messages[prev.chat.messages.length-1].id === newFeedItem.id) return prev
            return Object.assign({}, prev, {
                chat: {
                    ...prev.chat,
                    messages: [...prev.chat.messages, newFeedItem]
                }
            }) 
        }
    })

    return (
        <div className="columns">
            <div className="column"></div>
            <div className="column">
                <section class="hero">
                    <div class="hero-body">
                        <div class="container">
                            <h1 class="title">
                                {data.chat.name}
                            </h1>
                        </div>
                    </div>
                </section>

                <ul>
                {data.chat.messages.map(message => (
                    <li key={message.id}>
                        <p className="is-medium content">{message.user.username}: {message.content} | {message.createdAt}</p>
                    </li>
                ))}
                </ul>

                <hr/>
                <div className="field is-grouped">
                    <p className="control is-expanded">
                        <input 
                            value={content} 
                            className="input" 
                            type="text" 
                            placeholder="Enter Message"
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </p>
                    <p className="control">
                        <button className="button is-info" onClick={() => {createMessage({variables: {content, chatId}}); setContent("")}}>
                        Add Message
                        </button>
                    </p>
                </div>
            </div>
            <div className="column"></div>
        </div>
    )
}

export default Chat