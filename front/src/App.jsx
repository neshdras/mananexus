import { Route, Routes } from "react-router-dom"
import { Home } from "./page/Home"
import { NotFound } from "./page/NotFound"
import { LegalNotice } from "./page/LegalMention"
import './styles/base/global.scss'
import { Ranking } from "./page/Ranking"
import { Profile } from "./page/Profile"
import { Tournament } from "./page/Tournament"


function App() { 
  
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/legal-mention" element={<LegalNotice/>}/>
      <Route path="/ranking" element={<Ranking/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/tournament" element={<Tournament/>}/>
      <Route path="/*" element={<NotFound/>}/>
    </Routes>
  )
}

export default App
