import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Paper, Typography, Chip, Button, Divider } from "@mui/material";
import API from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";
import Loader from "@/components/ui/Loader";
import toast from "react-hot-toast";

export default function AdminUserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await API.get(`/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      console.log(res.data);

      setUser(res.data);
    } catch (err) {
      toast.error("Failed to load user");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-4 bg-gray-100 sm:p-6 dark:bg-black">
      <Paper
        sx={{
          maxWidth: 900,
          margin: "auto",
          padding: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom>
          User Details
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Name */}
        <Typography variant="subtitle2" color="text.secondary">
          Name
        </Typography>
        <Typography variant="body1" mb={2}>
          {user.name}
        </Typography>

        {/* Email */}
        <Typography variant="subtitle2" color="text.secondary">
          Email
        </Typography>
        <Typography variant="body1" mb={2}>
          {user.email}
        </Typography>

        {/* Role */}
        <Typography variant="subtitle2" color="text.secondary">
          Role
        </Typography>
        <Typography variant="body1" mb={2}>
          {user.role}
        </Typography>

        {/* Status */}
        <Typography variant="subtitle2" color="text.secondary">
          Status
        </Typography>
        <Chip
          label={user.isActive ? "Active" : "Pending"}
          color={user.isActive ? "success" : "warning"}
          sx={{ mb: 3 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </Paper>
    </div>
  );
}
