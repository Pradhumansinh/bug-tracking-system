import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { BrowserRouter } from "react-router-dom"
import AuthProvider from "./context/AuthContext.jsx"
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from "react-toastify"
import "./styles/global.css"


const darkMode=localStorage.getItem("darkMode")
if (darkMode === "true"){
  document.body.classList.add("dark")
}


ReactDOM.createRoot(document.getElementById("root")).render(
<BrowserRouter>
   <AuthProvider>
    <App />
    <ToastContainer position = "top-right" autoClose={3000} />
  </AuthProvider>
</BrowserRouter>
)
