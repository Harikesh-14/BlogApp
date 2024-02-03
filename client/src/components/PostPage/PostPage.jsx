import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'

import './PostPage.css'
import { userContext } from '../../userContext'

function PostPage() {
    const [postInfo, setPostInfo] = useState(null)
    const { userInfo } = useContext(userContext)

    const { id } = useParams()

    useEffect(() => {
        fetch(`http://localhost:3000/post/${id}`, {
            method: 'GET',
        }).then(response => {
            response.json().then(postInfo => {
                setPostInfo(postInfo)
            })
        })
    }, [])

    const editPost = () => {
        location.href = `/edit/${postInfo._id}`
    }

    if (!postInfo) {
        return ''
    }

    return (
        <div className='postPage'>
            <div className="titleOfPost">
                <h1 className='heading'>{postInfo.title}</h1>
            </div>

            <div className="authorInfo">
                <p><span className='blue'>Author:</span> {postInfo.author.firstName} </p>
                <p><span className='blue'>Updated at: </span> {format(postInfo.updatedAt, 'd MMM yyyy HH:mm')} </p>
            </div>

            {userInfo.id === postInfo.author._id && (
                <div className="editBtn">
                    <button type="button" onClick={editPost}>Edit Post</button>
                </div>
            )}

            <div className="postImage">
                <img src={`http://localhost:3000/${postInfo.cover}`} alt="" />
            </div>

            <div className="postDetails">
                <div dangerouslySetInnerHTML={{ __html: postInfo.content }} className='mainContent' />
                <div className="summary">
                    <h1>Summary of the post</h1>
                    <p>{postInfo.summary}</p>
                </div>
            </div>
        </div>
    )
}

export default PostPage