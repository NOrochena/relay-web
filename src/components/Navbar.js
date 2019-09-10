import React, {useState} from 'react'
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';

const CURRENT_USER = gql`
    query CurrentUser {
        currentUser {
            id
            username
        }
    }
`
const Navbar = (props) => {
    const [initial, setInitial] = useState(true)
    const [getCurrentUser, { loading, data }] = useLazyQuery(CURRENT_USER);
    
    if (localStorage.getItem('token') && initial) {
        getCurrentUser()
        setInitial(false)
    }

    const logout = () => {
        localStorage.removeItem('token')
        window.location.assign("/login")
    }

    if (loading) return 'Loading...';

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">

            <div id="navbarBasicExample" className="navbar-menu">
                <div className="navbar-start">
                    <a className="navbar-item" href="/">
                        Home
                    </a>
                </div>

                {(data) ? 
                    <div className="navbar-end">

                        <div className="navbar-item">
                            Username: {data.currentUser.username}
                        </div>
                        <div className="navbar-item">
                            <div className="buttons">
                                <div className="button is-primary" href="/signup" onClick={logout}>
                                    <strong>Logout</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                : 
                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <a className="button is-primary" href="/signup">
                                <strong>Sign up</strong>
                             </a>
                            <a className="button is-light" href="/login">
                                Log in
                            </a>
                        </div>
                    </div>
                </div>
                }
            </div>
        </nav>
    )
}

export default Navbar