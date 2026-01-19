import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Chip,
  Button,
  Divider,
  Stack,
  Box,
} from "@mui/material";
import {
  FaUser,
  FaStore,
  FaEnvelope,
  FaPhone,
  FaUserTag,
  FaCalendarAlt,
  FaArrowCircleUp,
  FaClock,
} from "react-icons/fa";
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
      setUser(res.data);
    } catch (err) {
      toast.error("Failed to load user");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleBtn = async () => {
    try {
      setLoading(true);
      const url = user.subscription
        ? `/admin/update-subscription/${userId}`
        : `/admin/create-subscription/${userId}`;
      const res = await API.post(
        url,
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } },
      );
      toast.success(res.data.message);
      fetchUser(); // refresh user data
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading) return <Loader />;

  return (
    <Box className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Paper
        sx={{
          maxWidth: 900,
          margin: "auto",
          padding: { xs: 3, md: 5 },
          borderRadius: 3,
          boxShadow: 4,
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          User Details
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={3}>
          {/* Name */}
          <Box className="flex items-center gap-3">
            <FaUser className="text-xl text-gray-500 dark:text-gray-300" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Box>
          </Box>

          {/* Shop Name */}
          <Box className="flex items-center gap-3">
            <FaStore className="text-xl text-gray-500 dark:text-gray-300" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Shop Name
              </Typography>
              <Typography variant="body1">{user.shopName}</Typography>
            </Box>
          </Box>

          {/* Email */}
          <Box className="flex items-center gap-3">
            <FaEnvelope className="text-xl text-gray-500 dark:text-gray-300" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
          </Box>

          {/* Phone */}
          <Box className="flex items-center gap-3">
            <FaPhone className="text-xl text-gray-500 dark:text-gray-300" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Phone Number
              </Typography>
              <Typography variant="body1">{user.phoneNumber}</Typography>
            </Box>
          </Box>

          {/* Role */}
          <Box className="flex items-center gap-3">
            <FaUserTag className="text-xl text-gray-500 dark:text-gray-300" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1">{user.role}</Typography>
            </Box>
          </Box>

          {/* Subscription */}
          {user.subscription && (
            <Box className="flex flex-col gap-1">
              <Typography variant="subtitle2" color="text.secondary">
                Subscription Details
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                {/* Start Date & Time */}
                <Box className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-500 dark:text-gray-300" />
                  <Typography variant="body2">
                    Start:{" "}
                    {user.subscription?.startDate
                      ? new Date(user.subscription.startDate).toLocaleString(
                          "en-US",
                          {
                            dateStyle: "medium",
                            timeStyle: "short", // shows time like 4:30 PM
                          },
                        )
                      : "N/A"}
                  </Typography>
                </Box>

                {/* End Date & Time */}
                <Box className="flex items-center gap-2">
                  <FaClock className="text-gray-500 dark:text-gray-300" />
                  <Typography variant="body2">
                    End:{" "}
                    {user.subscription?.endDate
                      ? new Date(user.subscription.endDate).toLocaleString(
                          "en-US",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )
                      : "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}

          {/* Subscription Button */}
          <Box className="flex flex-col mt-3">
            <Button
              variant="contained"
              color="primary"
              startIcon={<FaArrowCircleUp />}
              sx={{
                textTransform: "none",
                py: 1.5,
                fontWeight: 600,
                fontSize: "0.95rem",
                borderRadius: 2,
              }}
              onClick={handleBtn}
            >
              {user.subscription
                ? "Extend Subscription"
                : "Activate Subscription"}
            </Button>
          </Box>

          {/* Account Created At */}
          <Box className="flex flex-col gap-1">
            <Typography variant="subtitle2" color="text.secondary">
              Account Created
            </Typography>
            <Typography variant="body1">
              {new Date(user.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Box className="flex justify-center">
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
