import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import IndexPage from './components/IndexPage/IndexPage'
import LoginPage from './components/LoginPage/LoginPage'
import SignUpPage from './components/SignUpPage/SignUpPage'
import CreatePost from './components/CreatePost/CreatePost'
import { UserContextProvider } from './userContext'
import PostPage from './components/PostPage/PostPage'
import EditPost from './components/EditPost/EditPost'

function App() {
    return (
        <UserContextProvider>
            <Routes>
                <Route path='/' element={<Layout />} >
                    <Route index element={<IndexPage />} />

                    <Route path='/login' element={<LoginPage />} />

                    <Route path='/register-user' element={<SignUpPage />} />

                    <Route path='/create-post' element={<CreatePost />} />

                    <Route path='/post/:id' element={<PostPage />} />

                    <Route path='/edit/:id' element={<EditPost />} />
                </Route>
            </Routes>
        </UserContextProvider>
    )
}

export default App
