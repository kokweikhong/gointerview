import "./styles/main.css"
import GeneratePDFPage from "./pages/GeneratePDFPage"
import MergePDFPage from "./pages/MergePDFPage"
import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"

function App() {
  return (
    <div id="App">
        <header className="w-full p-4 bg-gray-100">
          <Navbar />
        </header>
        <Routes>
          <Route path="/" element={<GeneratePDFPage />} />
          <Route path="/merge" element={<MergePDFPage />} />
        </Routes>
    </div>
  )
}

export default App
