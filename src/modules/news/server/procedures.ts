import axios from "axios";

export async function getNewsDetail(id: number) {
  try {
    const res = await axios.get(
      // `https://tantrang-backend.onrender.com/api/news/${id}`
      `http://localhost:3001/api/news/${id}`
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch news detail:", err);
  }
}

export async function getNewsList() {
  try {
    const res = await axios.get(
      // `https://tantrang-backend.onrender.com/api/news/`
      `http://localhost:3001/api/news/`
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch news list:", err);
  }
}
