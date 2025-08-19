import axios from "axios";

interface TnttProps {
  id: number;
  title: string;
  slug?: string;
  description: string;
  thumbnail?: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

const API_BASE_URL = "http://localhost:3001/api";
const API_SERVER_URL = "https://tantrang-backend.onrender.com/api";

export async function getAllTntt(): Promise<TnttProps[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/tntt`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tải tin tức của Thiếu Nhi Thánh Thể!!!", error);
    throw new Error(
      "Không thể tải danh sách tin tức của Thiếu Nhi Thánh Thể. Vui lòng thử lại sau !!!"
    );
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/category`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tải danh mục!!!", error);
    throw new Error(
      "Không thể tải danh sách danh mục. Vui lòng thử lại sau!!!"
    );
  }
}

export async function getTnttDetail(id: number) {
  try {
    const res = await axios.get(`${API_BASE_URL}/tntt/${id}`);
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
