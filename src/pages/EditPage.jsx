import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPost, updatePost } from '../services/postService'
import { POST_FIELDS, FLAGS, AIRING_STATUSES } from '../constants'
import Spinner from '../components/Spinner'
import './CreatePage.css'

export default function EditPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [form, setForm] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function load() {
            try {
                const data = await getPost(id)
                setForm(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!form[POST_FIELDS.TITLE].trim()) {
            setError('Title is required')
            return
        }

        setSaving(true)
        setError(null)

        try {
            await updatePost(id, {
                [POST_FIELDS.TITLE]: form[POST_FIELDS.TITLE],
                [POST_FIELDS.BODY]: form[POST_FIELDS.BODY],
                [POST_FIELDS.IMAGE_URL]: form[POST_FIELDS.IMAGE_URL],
                [POST_FIELDS.VIDEO_URL]: form[POST_FIELDS.VIDEO_URL],
                [POST_FIELDS.FLAG]: form[POST_FIELDS.FLAG],
                [POST_FIELDS.SERIES_NAME]: form[POST_FIELDS.SERIES_NAME],
                [POST_FIELDS.AIRING_STATUS]: form[POST_FIELDS.AIRING_STATUS],
            })
            navigate(`/post/${id}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <Spinner />
    if (error) return <p style={{ color: 'red' }}>{error}</p>
    if (!form) return <p>Post not found.</p>

    return (
        <div className="create-container">
            <form onSubmit={handleSubmit}>
                <Link to={`/post/${id}`}>&larr; Cancel</Link>
                <h1>Edit Post</h1>

                {error && <p className="create-error">{error}</p>}

                <label>
                    Title *
                    <input
                        name={POST_FIELDS.TITLE}
                        value={form[POST_FIELDS.TITLE] || ''}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Body
                    <textarea
                        name={POST_FIELDS.BODY}
                        value={form[POST_FIELDS.BODY] || ''}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Image URL
                    <input
                        name={POST_FIELDS.IMAGE_URL}
                        value={form[POST_FIELDS.IMAGE_URL] || ''}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Video URL
                    <input
                        name={POST_FIELDS.VIDEO_URL}
                        value={form[POST_FIELDS.VIDEO_URL] || ''}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Flag
                    <select
                        name={POST_FIELDS.FLAG}
                        value={form[POST_FIELDS.FLAG] || FLAGS[0]}
                        onChange={handleChange}
                    >
                        {FLAGS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </label>

                <label>
                    Series Name
                    <input
                        name={POST_FIELDS.SERIES_NAME}
                        value={form[POST_FIELDS.SERIES_NAME] || ''}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Airing Status
                    <select
                        name={POST_FIELDS.AIRING_STATUS}
                        value={form[POST_FIELDS.AIRING_STATUS] || ''}
                        onChange={handleChange}
                    >
                        <option value="">— none —</option>
                        {AIRING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </label>

                <button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    )
}