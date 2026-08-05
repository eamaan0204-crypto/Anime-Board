import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost, getPost } from '../services/postService'
import { getUserId } from '../utils/userId'
import { uploadImage } from '../services/storageService'
import { POST_FIELDS, FLAGS, AIRING_STATUSES } from '../constants'
import './CreatePage.css'

export default function CreatePage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [imageFile, setImageFile] = useState(null)

    const [form, setForm] = useState({
        [POST_FIELDS.TITLE]: '',
        [POST_FIELDS.BODY]: '',
        [POST_FIELDS.IMAGE_URL]: '',
        [POST_FIELDS.VIDEO_URL]: '',
        [POST_FIELDS.FLAG]: FLAGS[0],
        [POST_FIELDS.SERIES_NAME]: '',
        [POST_FIELDS.AIRING_STATUS]: '',
        [POST_FIELDS.REPOST_OF]: '',
    })

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

        if (form[POST_FIELDS.IMAGE_URL] && imageFile) {          // ← new block goes here
            setError('Please provide either an image URL or an uploaded file, not both.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const repostId = form[POST_FIELDS.REPOST_OF].trim()

            if (repostId) {
                try {
                    await getPost(repostId)
                } catch {
                    setError('No post found with that ID to repost.')
                    setLoading(false)
                    return
                }
            }

            let finalImageUrl = form[POST_FIELDS.IMAGE_URL]

            if (imageFile) {
                try {
                    finalImageUrl = await uploadImage(imageFile)
                } catch (err) {
                    setError('Image upload failed: ' + err.message)
                    setLoading(false)
                    return
                }
            }

            const newPost = await createPost({
                ...form,
                [POST_FIELDS.IMAGE_URL]: finalImageUrl,
                [POST_FIELDS.REPOST_OF]: repostId || null,
                [POST_FIELDS.AUTHOR_ID]: getUserId(),
            })
            navigate(`/post/${newPost.id}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="create-container">
            <form onSubmit={handleSubmit}>
                <h1>Create a Post</h1>

                {error && <p className="create-error">{error}</p>}

                <label>
                    Title *
                    <input
                        name={POST_FIELDS.TITLE}
                        value={form[POST_FIELDS.TITLE]}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Body
                    <textarea
                        name={POST_FIELDS.BODY}
                        value={form[POST_FIELDS.BODY]}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Image URL
                    <input
                        name={POST_FIELDS.IMAGE_URL}
                        value={form[POST_FIELDS.IMAGE_URL]}
                        onChange={handleChange}
                        disabled={!!imageFile}
                    />
                </label>

                <label>
                    Or upload an image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setImageFile(e.target.files[0] || null)}
                        disabled={!!form[POST_FIELDS.IMAGE_URL]}
                    />
                    {imageFile && (
                        <button type="button" onClick={() => setImageFile(null)}>
                            Remove file
                        </button>
                    )}
                </label>

                <label>
                    Video URL
                    <input
                        name={POST_FIELDS.VIDEO_URL}
                        value={form[POST_FIELDS.VIDEO_URL]}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Flag
                    <select
                        name={POST_FIELDS.FLAG}
                        value={form[POST_FIELDS.FLAG]}
                        onChange={handleChange}
                    >
                        {FLAGS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </label>

                <label>
                    Series Name
                    <input
                        name={POST_FIELDS.SERIES_NAME}
                        value={form[POST_FIELDS.SERIES_NAME]}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Airing Status
                    <select
                        name={POST_FIELDS.AIRING_STATUS}
                        value={form[POST_FIELDS.AIRING_STATUS]}
                        onChange={handleChange}
                    >
                        <option value="">— none —</option>
                        {AIRING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </label>

                <label>
                    Repost of Post ID (optional)
                    <input
                        name={POST_FIELDS.REPOST_OF}
                        value={form[POST_FIELDS.REPOST_OF]}
                        onChange={handleChange}
                        placeholder="Paste a post ID to repost it"
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? 'Posting...' : 'Create Post'}
                </button>
            </form>
        </div>
    )
}