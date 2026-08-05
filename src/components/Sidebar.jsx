import { Link } from 'react-router-dom'

export default function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
            <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <p className="sidebar-title">Anime-Board</p>
                <nav className="sidebar-nav">
                    <Link to="/" onClick={onClose}>Home feed</Link>
                    <Link to="/create" onClick={onClose}>New post</Link>
                </nav>
            </div>
        </>
    )
}