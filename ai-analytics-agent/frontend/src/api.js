import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function uploadDataset(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${API_BASE}/upload-dataset`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

export async function askQuestion(question) {
  const res = await axios.post(`${API_BASE}/ask`, {
    question,
  });

  return res.data;
}
