import {Routes, Route, Navigate} from "react-router-dom";
import {useEffect} from "react";
import Messages from "./pages/Messages";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Verification from "./auth/Verification";
import Layout from "./components/layout";
import ProfilePage from "./pages/ProfilePage";
// import Sidebar from "./components/layout/Sidebar";
const App = () => {
    useEffect(() => {
        const colorMode = JSON.parse(
            window.localStorage.getItem("color-theme")
        );
        const className = "dark";
        const bodyClass = window.document.body.classList;
        colorMode === "dark"
            ? bodyClass.add(className)
            : bodyClass.remove(className);
    }, []);

    return (
        <Routes>
            {/* Redirect home to login */}
            <Route path="/" element={<Navigate to="/auth/login" />} />

            {/* Authentication Routes */}
            <Route path="auth/login" element={<Login />} />
            <Route path="auth/signup" element={<Signup />} />
            <Route path="auth/verify" element={<Verification />} />

            {/* Dashboard Layout */}
            <Route path="dashboard" element={<Layout />}>
                <Route index element={<Messages />} />{" "}
                {/* Default content for /dashboard */}
                <Route path="profile" element={<ProfilePage />} />{" "}
                {/* /dashboard/profile */}
            </Route>
        </Routes>
    );
};

export default App;
