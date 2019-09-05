import React, {useState} from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

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

const Chat = props => {
    const [content, setContent] = useState("")
    const {error, loading, data} = useQuery(GET_CHAT, {variables: {id: props.match.params.id}})

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    console.log(data)
    return (
        <div>
            {data.chat.messages.map(message => (
                <div key={message.id}>{message.content} - {message.user.username}</div>
            ))}
            <input value={content} onChange={(e) => setContent(e.value)}/>
            <button onClick={() => console.log(content)}>Submit</button>
        </div>
    )
}

export default Chat