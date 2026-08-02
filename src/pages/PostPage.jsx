import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPost, upvotePost, deletePost } from '../services/postService'
import { getUserId } from '../utils/userId'
import { POST_FIELDS } from '../constants'
import { getComments, createComment, deleteComment } from '../services/commentService'
import { COMMENT_FIELDS } from '../constants'
import Spinner from '../components/Spinner'
import './PostPage.css'

export default function PostPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [upvoting, setUpvoting] = useState(false)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [commentError, setCommentError] = useState(null)
    const [repostedFrom, setRepostedFrom] = useState(null)


    useEffect(() => {
        async function load() {
            try {
                const data = await getPost(id)
                setPost(data)

                if (data[POST_FIELDS.REPOST_OF]) {
                    try {
                        const original = await getPost(data[POST_FIELDS.REPOST_OF])
                        setRepostedFrom(original)
                    } catch {
                        setRepostedFrom(null)
                    }
                }

                const commentData = await getComments(id)
                setComments(commentData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    async function handleUpvote() {
        setUpvoting(true)
        try {
            const updated = await upvotePost(post.id, post[POST_FIELDS.UPVOTES])
            setPost(updated)
        } catch (err) {
            setError(err.message)
        } finally {
            setUpvoting(false)
        }
    }

    async function handleDelete() {
        if (post[POST_FIELDS.AUTHOR_ID] !== getUserId()) {
            setError("You can only delete your own posts.")
            return
        }

        if (!window.confirm('Delete this post permanently?')) return
        try {
            await deletePost(post.id)
            navigate('/')
        } catch (err) {
            setError(err.message)
        }
    }

    async function handleAddComment(e) {
        e.preventDefault()
        if (!newComment.trim()) return

        try {
            const comment = await createComment({
                [COMMENT_FIELDS.POST_ID]: id,
                [COMMENT_FIELDS.BODY]: newComment,
                [COMMENT_FIELDS.AUTHOR_ID]: getUserId(),
            })
            setComments(prev => [...prev, comment])
            setNewComment('')
        } catch (err) {
            setCommentError(err.message)
        }
    }

    async function handleDeleteComment(comment) {
        if (comment[COMMENT_FIELDS.AUTHOR_ID] !== getUserId()) {
            setCommentError("You can only delete your own comments.")
            return
        }
        if (!window.confirm('Delete this comment?')) return

        try {
            await deleteComment(comment.id)
            setComments(prev => prev.filter(c => c.id !== comment.id))
        } catch (err) {
            setCommentError(err.message)
        }
    }

    if (loading) return <Spinner />
    if (error) return <p style={{ color: 'red' }}>{error}</p>
    if (!post) return <p>Post not found.</p>

    const isOwner = post[POST_FIELDS.AUTHOR_ID] === getUserId()

    return (
        <div className="post-container">
            <Link to="/">&larr; Back to feed</Link>
            <h1>{post[POST_FIELDS.TITLE]}</h1>
            <p className="post-meta">Flag: {post[POST_FIELDS.FLAG]}</p>

            {repostedFrom && (
                <div className="card post-repost-box">
                    <p>Reposted from:</p>
                    <Link to={`/post/${repostedFrom.id}`}>{repostedFrom[POST_FIELDS.TITLE]}</Link>
                </div>
            )}
            {post[POST_FIELDS.REPOST_OF] && !repostedFrom && (
                <p className="post-meta"><em>(original post was deleted)</em></p>
            )}

            {post[POST_FIELDS.SERIES_NAME] && <p>Series: {post[POST_FIELDS.SERIES_NAME]}</p>}
            {post[POST_FIELDS.BODY] && <p>{post[POST_FIELDS.BODY]}</p>}
            {post[POST_FIELDS.IMAGE_URL] && (
                <img className="post-image" src={post[POST_FIELDS.IMAGE_URL]} alt={post[POST_FIELDS.TITLE]} />
            )}
            {post[POST_FIELDS.VIDEO_URL] && (
                <p><a href={post[POST_FIELDS.VIDEO_URL]} target="_blank" rel="noreferrer">Watch video</a></p>
            )}

            <div className="post-actions">
                <button onClick={handleUpvote} disabled={upvoting}>▲ {post[POST_FIELDS.UPVOTES]}</button>
                {isOwner && (
                    <div className="post-owner-actions">
                        <Link to={`/post/${post.id}/edit`} className="btn-link">Edit</Link>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                )}
            </div>

            <div className="comments-section">
                <h2>Comments</h2>
                {commentError && <p className="create-error">{commentError}</p>}
                <ul className="comment-list">
                    {comments.map(comment => (
                        <li key={comment.id} className="comment-item gutter">
                            <p>{comment[COMMENT_FIELDS.BODY]}</p>
                            <small>{comment[COMMENT_FIELDS.AUTHOR_ID]}</small>
                            {comment[COMMENT_FIELDS.AUTHOR_ID] === getUserId() && (
                                <button onClick={() => handleDeleteComment(comment)}>Delete</button>
                            )}
                        </li>
                    ))}
                </ul>
                <form className="comment-form" onSubmit={handleAddComment}>
                    <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." />
                    <button type="submit">Post Comment</button>
                </form>
            </div>
        </div>
    )
}