import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { auth } = useAuth();

  return (
    <div>
      <h1>Welcome, {auth.role}</h1>
      <p>User ID: {auth.userId}</p>
    </div>
  );
}
