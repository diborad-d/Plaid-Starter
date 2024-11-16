import axios from "axios";

// Register user
export const registerUser = async (username, password) => {
  try {
    const response = await axios.post("/auth/register", { username, password });
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw new Error(error.response?.data?.message || "Error registering user");
  }
};

// Login user
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post("/auth/login", { username, password });
    return response.data.token; // Return token
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error(error.response?.data?.message || "Error logging in user");
  }
};

// Verify token (can be used on frontend to check if the user is logged in)
export const verifyToken = async (token) => {
  try {
    const response = await axios.get("/auth/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // This contains the decoded token info
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Token verification failed");
  }
};
