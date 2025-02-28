import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import VerifyEmail from "./components/VerifyEmail"

import "./App.css"
import ProcessFlow from "./components/ProcessFlow"

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/process" element={<ProcessFlow />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App