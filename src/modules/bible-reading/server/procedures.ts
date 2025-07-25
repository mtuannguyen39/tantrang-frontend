import axios from "axios";

export async function getBibleReadingList() {
  try {
    const res = await axios.get(
      //`https://tantrang-backend.onrender.com/api/bible-reading/`
      `http://localhost:3001/api/bible-reading/`
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch bible list:", err);
  }
}
