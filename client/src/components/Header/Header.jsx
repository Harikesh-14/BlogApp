import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../userContext'
import './Header.css'

function Header() {
    const {setUserInfo, userInfo} = useContext(userContext)

    const loginFunc = () => {
        location.href = '/login'
    }

    const signUpFunc = () => {
        location.href = '/register-user'
    }

    const createPost = () => {
        location.href = '/create-post'
    }

    useEffect(() => {
        fetch('http://localhost:3000/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo)
            })
        })
    }, [])

    const logoutFunc = async () => {
        try {
            await fetch('http://localhost:3000/logout', {
                credentials: 'include',
                method: 'POST',
            });
    
            setUserInfo(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
    

    const firstName = userInfo?.firstName

    return (
        <header>
            <a href="/" className='logo'>Code Chronicles</a>
            <nav>
                {firstName && (
                    <>
                        <p><span>Welcome!</span> {firstName}</p>
                        <button type="button" onClick={createPost}>New Post</button>
                        <button type="button" onClick={logoutFunc}>Logout</button>
                    </>
                )}

                {!firstName && (
                    <>
                        <button type='button' onClick={loginFunc}>Sign In</button>
                        <button type='button' onClick={signUpFunc}>Sign Up</button>
                    </>
                )}
            </nav>
        </header>
    )
}

export default Header