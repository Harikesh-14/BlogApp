import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './CreatePost.css'

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
]

function CreatePost() {
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')
    const [redirect, setRedirect] = useState(false)

    const createNewPost = async (e) => {
        e.preventDefault()

        const data = new FormData()
        data.set('title', title)
        data.set('summary', summary)
        data.set('content', content)
        data.set('file', files[0])

        const response = await fetch('http://localhost:3000/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
        })

        if (response.ok) {
            setRedirect(true)
        }

        console.log(await response.json())
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <form className='createPost' onSubmit={createNewPost} enctype="multipart/form-data">
            <div className="intro">
                <h1>Craft Your Story: Share Your Wisdom!</h1>
            </div>
            <div className="inputFields">
                <div className="inputField">
                    <label>Enter the Title (Max: 20 Words)</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className="inputField">
                    <label>Enter the summary (Max: 70 Words)</label>
                    <input
                        type='summary'
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                    />
                </div>
                <div className="inputField">
                    <label>Upload the thumbnail</label>
                    <input
                        type='file'
                        onChange={e => setFiles(e.target.files)}
                    />
                </div>
                <ReactQuill
                    value={content}
                    modules={modules}
                    formats={formats}
                    onChange={newValue => setContent(newValue)}
                />
                <div className="buttonField">
                    <button type='submit' className='createPostBtn'>Create Post</button>
                </div>
            </div>
        </form>
    )
}

export default CreatePost