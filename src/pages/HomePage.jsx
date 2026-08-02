import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '../services/postService'
import { POST_FIELDS, FLAGS } from '../constants'
import Spinner from '../components/Spinner'
import './HomePage.css'

export default function HomePage() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [sortBy, setSortBy] = useState('created_at')
    const [flagFilter, setFlagFilter] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function load() {
            try {
                const data = await getPosts()
                setPosts(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) return <Spinner />
    if (error) return <p style={{ color: 'red' }}>{error}</p>

    const visiblePosts = posts
        .filter(post => !flagFilter || post[POST_FIELDS.FLAG] === flagFilter)
        .filter(post =>
            post[POST_FIELDS.TITLE].toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'upvotes') {
                return b[POST_FIELDS.UPVOTES] - a[POST_FIELDS.UPVOTES]
            }
            return new Date(b.created_at) - new Date(a.created_at)
        })

    const trending = [...posts].sort((a, b) => b[POST_FIELDS.UPVOTES] - a[POST_FIELDS.UPVOTES]).slice(0, 3)
    const latest = [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3)
    const completed = posts.filter(p => p[POST_FIELDS.AIRING_STATUS] === 'Completed').slice(0, 3)

    return (
        <div className="home-container">
            <div className="home-header">
                <h1>Anime Board</h1>
                <Link to="/create">+ New Post</Link>
            </div>

            <div className="panel-grid">
                <PanelRow title="🔥 Trending" items={trending} />
                <PanelRow title="🆕 Latest" items={latest} />
                <PanelRow title="✅ Completed" items={completed} />
            </div>

            <div className="home-controls">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="created_at">Newest</option>
                    <option value="upvotes">Most Upvoted</option>
                </select>
                <select value={flagFilter} onChange={e => setFlagFilter(e.target.value)}>
                    <option value="">All Flags</option>
                    {FLAGS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>

            <ul className="post-list">
                {visiblePosts.map(post => (
                    <li key={post.id} className="post-row">
                        <span className="post-time">{new Date(post.created_at).toLocaleDateString()}</span>
                        <Link to={`/post/${post.id}`} className="post-title">
                            {post[POST_FIELDS.TITLE]}
                        </Link>
                        <span className="post-upvotes">▲ {post[POST_FIELDS.UPVOTES]}</span>
                    </li>
                ))}
            </ul>

            {visiblePosts.length === 0 && <p>No posts match your filters.</p>}
        </div>
    )
}

function PanelRow({ title, items }) {
    if (items.length === 0) return null
    return (
        <div className="panel-row">
            <h2>{title}</h2>
            <div className="panel-cards">
                {items.map(post => (
                    <Link to={`/post/${post.id}`} key={post.id} className="panel-card">
                        {post[POST_FIELDS.IMAGE_URL] ? (
                            <img src={post[POST_FIELDS.IMAGE_URL]} alt={post[POST_FIELDS.TITLE]} />
                        ) : (
                            <div className="panel-card-placeholder" />
                        )}
                        <span>{post[POST_FIELDS.TITLE]}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}