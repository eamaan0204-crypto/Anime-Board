import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import PostPage from './pages/PostPage'
import EditPage from './pages/EditPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/post/:id/edit" element={<EditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
