import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000"; // Thay bằng IP của backend nếu chạy trên máy thật

// Hàm gửi request đăng ký
export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registration failed";
  }
};

// Hàm gửi request đăng nhập
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    const { token } = response.data;
    await AsyncStorage.setItem("token", token); // Lưu token
    return token;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};

// Hàm gửi câu trả lời lên server
export const submitAnswer = async (questionId, answer) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/answers/submit`,
      { questionId, answer },
      { headers: { Authorization: token } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to submit answer";
  }
};

// Hàm lấy danh sách câu trả lời của user
export const getUserAnswers = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_URL}/answers/my-answers`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch answers";
  }
};
