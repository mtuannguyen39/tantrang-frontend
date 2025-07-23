import axios from "axios";

export async function getTnttDetail(id: number) {
  try {
    const res = await axios.get(`http://localhost:3001/api/tntt/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch tntt details:", err);
  }
}

export async function getTnttList() {
  try {
    const res = await axios.get(`http://localhost:3001/api/tntt`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch TNTT list:", err);
  }
}
