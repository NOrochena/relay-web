import React, {useState} from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
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

const Chat = props => {
    let chatId = props.match.params.id
    const [content, setContent] = useState("")
    const {error, loading, data} = useQuery(GET_CHAT, {variables: {id: chatId}})
    const [createMessage] = useMutation(CREATE_MESSAGE)

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <div>
            {data.chat.messages.map(message => (
                <div key={message.id}>{message.content} - {message.user.username}</div>
            ))}
            <input value={content} onChange={(e) => {console.log(content);setContent(e.target.value)}}/>
            <button onClick={() => createMessage({variables: {content, chatId}})}>Submit</button>
        </div>
    )
}

export default Chat