import './singlePost.css'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router'
import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Context } from '../../context/Context'


export default function SinglePost() {
    const location = useLocation()
    const path = (location.pathname.split("/")[2])
    const [post, setPost] = useState({})
    const { user } = useContext(Context)
    const PF = "http://localhost:5000/images/"
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [updateMode, setUpdateMode] = useState(false)


    useEffect(() => {
        const getPost = async () => {
            const res = await axios.get('api/posts/' + path)
            setPost(res.data)
            setTitle(res.data.title)
            setDesc(res.data.desc)
        }
        getPost()
    }, [path])
    const handleClick = async () => {
        try {
            await axios.delete(`api/posts/${post._id} `, {
                data: { username: user.username }
            })
            window.location.replace('/')
        }
        catch (err) {

        }
    }
    const handleUpdate = async () => {
        try {
            await axios.put(`api/posts/${post._id} `, { username: user.username, title, desc }
            )
            setUpdateMode(false)
        }
        catch (err) {

        }
    }
    return (
        <div className='singlePost'>
            <div className='singlePostWrapper'>
                {post.photo && <img className='singlePostImg'
                    src={PF + post.photo}
                    alt=''
                />}
                {
                    updateMode ? <input
                        type='text'
                        value={title}
                        className='singlePostTitleInput'
                        onChange={(e) => setTitle(e.target.value)} /> : (

                        <h1 className='singlePostTitle'>
                            {title}
                            {post.username === user?.username && (

                                <div className="singlePostEdit">
                                    <EditOutlined className='singlePostIcon' onClick={() => setUpdateMode(true)} />
                                    <DeleteOutlined className='singlePostIcon' onClick={handleClick} />
                                </div>
                            )}
                        </h1>
                    )
                }
                <div className='singlePostInfo'>
                    <span className='singlePostAuthor'>
                        Author: <Link to={`/?user=${post.username}`} className='link'>
                            <b> {post.username}</b>
                        </Link>
                    </span>
                    <span className='singlePostDate'>
                        {new Date(post.createdAt).toDateString()}
                    </span>
                </div>
                {updateMode ? (
                    <textarea className='singlePostDescInput'
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)} />
                ) : (

                    <p className='singlePostDesc'>
                        {desc}
                    </p>
                )}
                {updateMode && (
                    <button
                        className='singlePostButton'
                        onClick={handleUpdate}
                    >Update</button>
                )}
            </div>
        </div>
    )
}
