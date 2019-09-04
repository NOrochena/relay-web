import React from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const GET_USERS = gql`
    query Users {
        users {
            username
        }
    }
`

const Users = () => {
    const {error, loading, data} = useQuery(GET_USERS)

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    console.log(data)
    return (
        <div>
            Users 
        </div>
    )
}

export default Users