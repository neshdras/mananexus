import { Route, Routes, useLocation } from "react-router-dom"
import { Home } from "./page/Home"
import { NotFound } from "./page/NotFound"
import { LegalNotice } from "./page/LegalMention"
import './styles/base/global.scss'
import { Ranking } from "./page/Ranking"
import { Profile } from "./page/Profile"
import { Tournament } from "./page/Tournament"
import { useEffect } from 'react'
import useAuth from './hook/useAuth'
import ProtectedRoute from './component/ProtectedRoute'


function App() { 
  const { error, checkSession } = useAuth()
  const location = useLocation()
  const pathArray = ['/ranking', '/profile', '/tournament']
  useEffect(() => { checkSession() }, [checkSession])

  return (
    <>
      {(pathArray.includes(location.pathname) || location.pathname.startsWith('/profile/')) && error && (
        <div role="alert"><p>{error}</p><button onClick={checkSession}>Réessayer</button></div>
      )}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/legal-mention" element={<LegalNotice/>}/>
        <Route element={<ProtectedRoute />}>
          <Route path="/ranking" element={<Ranking/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/profile/:id" element={<Profile/>}/>
          <Route path="/tournament" element={<Tournament/>}/>
        </Route>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App
