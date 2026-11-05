import { StoreContext } from "../Context/StoreContext";
import { Navigate } from "react-router-dom";
import { useContext } from "react";

const AdminAuthorizer = ({ children }) => {
  const { token, user } = useContext(StoreContext);

  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "Admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminAuthorizer;
