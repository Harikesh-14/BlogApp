import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

import './Post.css'

function Post({ _id, title, summary, cover, createdAt, author }) {
    return (
        <div className="posts">
            <div className="post">
                <div className="images">
                    <Link to={`/post/${_id}`} className='link'>
                        <img src={`http://localhost:3000/${cover} `} />
                    </Link>
                </div>
                <div className="texts">
                    <Link to={`/post/${_id}`} className='link'>
                        <h2> {title} </h2>
                    </Link>
                    <div className="info">
                        <a className='author'> {author.firstName} </a>
                        <time> {format(createdAt, 'd MMM, yyyy HH:mm')} </time>
                    </div>
                    <p className='summary'> {summary} </p>
                </div>
            </div>
        </div>
    )
}

export default Post