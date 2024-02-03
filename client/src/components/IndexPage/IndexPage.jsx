import React, { useEffect, useState } from 'react'
import Post from '../Post/Post'

function IndexPage() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch('http://localhost:3000/post').then(response => {
            response.json().then(posts => {
                setPosts(posts)
            })
        })
    }, [])

    return (
        <>
            {posts.length > 0 && posts.map(post => (
                <Post {...post} />
            ))}
        </>
    )
}

export default IndexPage