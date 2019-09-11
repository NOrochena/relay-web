import React, {useState, useEffect, useRef} from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useMutation } from '@apollo/react-hooks';
import moment from 'moment'


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

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
      if (!messagesEndRef.current) return
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom)

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
                <section className="hero">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title">
                                {data.chat.name}
                            </h1>
                        </div>
                    </div>
                </section>

                {data.chat.messages.map(message => (
                        <div key={message.id}>
                            <nav className="level">
                                <div className="level-left">
                                    <div className="level-item">
                                        <div className="is-medium content"><strong>{message.user.username}</strong></div>
                                    </div>
                                </div>
                                <div className="level-right">
                                    <div className="level-item">
                                        <div className="is-small content"> {timeDisplay(new Date(message.createdAt))}</div>
                                    </div>
                                </div>
                            </nav>
                            <blockquote>
                                {message.content}
                            </blockquote>
                            <hr />
                        </div>
                ))}

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
                        <button 
                            className="button is-info" 
                            onClick={() => {createMessage({
                                variables: {content, chatId}}); 
                                setContent("");
                                scrollToBottom() 
                            }}>
                        Add Message
                        </button>
                    </p>
                </div>
                <div ref={messagesEndRef} />
            </div>
            <div className="column"></div>
        </div>
    )
}

function timeDisplay(date) {
    return moment(date).format("MM/DD/YY [at] h:mm:ss a")
}

export default Chat