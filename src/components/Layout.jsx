import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { getTheme, setTheme } from '../utils/theme'

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [theme, setThemeState] = useState(getTheme())

    useEffect(() => {
        setTheme(theme)
    }, [theme])

    function toggleTheme() {
        setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'))
    }

    return (
        <div className="app-container">
            <div className="bg-glow-1" />
            <div className="bg-glow-2" />
            <div className="bg-dots" />

            <div className="app-content">
                <header className="app-header">
                    <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
                    <button className="menu-btn" onClick={toggleTheme}>
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </header>

                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}