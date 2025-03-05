import { BrowserRouter as Router, Routes, Route, RouterProvider } from "react-router-dom"
import LoginForm from "./Component/Auth/LoginForm.jsx"
import RegisterForm from "./Component/Auth/RegisterForm.jsx"
import VerifyEmail from "./Component/Auth/VerifyEmail.jsx"
import "./CSS/App.css"
import ProcessFlow from "./pages/ProcessFlow.jsx"
import Auth from "./pages/Auth.jsx"
import ReqSheet from "./pages/ReqSheet.jsx"

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<ProcessFlow />} />
          <Route path="/auth" element={<Auth />} >   {/** nested routes */}
              <Route path="login" element={<LoginForm />}></Route>
              <Route path="register" element={<RegisterForm />}></Route>
              <Route path="verify/:email" element={<VerifyEmail />}></Route>
          </Route>
          <Route path="/reqSheet" element={<ReqSheet />}></Route>
        </Routes>
      </div>
    </Router>
  )
}


export default App