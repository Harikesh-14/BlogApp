import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

function EditPost() {
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')
    const [redirect, setRedirect] = useState(false)

    const { id } = useParams()

    useEffect(() => {
        fetch(`http://localhost:3000/post/${id}`).then(response => {
            response.json().then(postInfo => {
                setTitle(postInfo.title)
                setSummary(postInfo.summary)
                setContent(postInfo.content)
            })
        })
    }, [])

    const editPostFunc = async (e) => {
        e.preventDefault()

        const data = new FormData()
        data.set('title', title)
        data.set('summary', summary)
        data.set('content', content)
        data.set('id', id)
        if (files?.[0]) {
            data.set('file', files?.[0])
        }

        await fetch(`http://localhost:3000/post`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        })

        setRedirect(true)
    }

    if (redirect) {
        return <Navigate to={`/post/${id}`} />
    }

    return (
        <form className='createPost' onSubmit={editPostFunc} enctype="multipart/form-data">
            <div className="intro">
                <h1>Edit Your Post</h1>
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
                    <button type='submit' className='createPostBtn'>Edit Post</button>
                </div>
            </div>
        </form>
    )
}

export default EditPost