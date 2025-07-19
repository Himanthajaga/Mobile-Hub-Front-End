import './App.css';
import { Route, Routes, useNavigate} from "react-router-dom";
import {DefaultLayout} from "./view/common/DefaultLayout/DefaultLayout.tsx";
import {Login} from "./view/pages/Login/Login.tsx";
import {useEffect} from "react"; // Import useEffect
import {isTokenExpired} from "./auth/auth.ts";
import {Unauthorized} from "./auth/Unauthorized.tsx"; // Import JWT token validation

function App() {
    const navigate = useNavigate(); // Define useNavigate

    useEffect(() => {
        const token = localStorage.getItem("token"); // Get token from the local storage
        if (!token || isTokenExpired(token)) { // Make sure whether token is available or is valid
            localStorage.removeItem("token"); // Remove token from local storage
            navigate("/login"); // Redirect to login page
        }
    }, [navigate]);

    return (
        <Routes>
            <Route path="/*" element={<DefaultLayout/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/unauthorized" element={<Unauthorized/>}></Route> // Define Route for unauthorized access
        </Routes>
    );
}

export default App;