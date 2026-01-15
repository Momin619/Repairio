import { useState } from "react";
import axios from "axios";

export default function ActivateSubscription() {
  const [userId, setUserId] = useState("");

  const handleActivate = async () => {
    try {
      const res = await axios.post(`/api/admin/activate/${userId}`);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Activation failed");
    }
  };

  return (
    <div>
      <h2>Activate User Subscription</h2>
      <input
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleActivate}>Activate</button>
    </div>
  );
}
