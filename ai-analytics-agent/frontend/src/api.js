import axios from "axios";

let API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
if (API_BASE.endsWith('/')) {
  API_BASE = API_BASE.slice(0, -1);
}
console.log("DEBUG: Using API_BASE:", API_BASE);

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
