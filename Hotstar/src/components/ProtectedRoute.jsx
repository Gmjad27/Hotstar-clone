import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const hasToken = Boolean(token && token !== "undefined" && token !== "null");

    if (!hasToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
