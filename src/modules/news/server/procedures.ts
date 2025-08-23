import axios from "axios";

interface NewsProps {
  id: number;
  title: string;
  slug?: string;
  content?: string;
  thumbnail?: string;
  categoryId: number;
  liturgicalYearId?: number;
}

interface Category {
  id: number;
  name: string;
}

interface LiturgicalYear {
  id: number;
  title: string;
  name: string;
  code: string;
}

const API_BASE_URL = "http://localhost:3001/api";
const API_SERVER_URL = "https://tantrang-backend.onrender.com/api";

export async function getAllNews(): Promise<NewsProps[]> {
  try {
    const res = await axios.get(`${API_SERVER_URL}/news`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tải tin tức", error);
    throw new Error("Không thể tải danh sách tin tức. Vui lòng thử lại !!!");
  }
}

export async function getNewsDetail(id: number) {
  try {
    const res = await axios.get(
      // `https://tantrang-backend.onrender.com/api/news/${id}`
      `${API_SERVER_URL}/news/${id}`
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch news detail:", err);
  }
}

export async function gettAllCategories(): Promise<Category[]> {
  const res = await axios.get(`${API_SERVER_URL}/category`);
  return res.data;
}

export async function getAllLiturgicalYear(): Promise<LiturgicalYear[]> {
  const res = await axios.get(`${API_SERVER_URL}/year`);
  return res.data;
}

export async function createNews(
  payload: Omit<NewsProps, "id">,
  file: File | null,
  editingId: number | null
): Promise<void> {
  let thumbnailUrl = payload.thumbnail;

  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    const uploadRes = await axios.post(
      `${API_SERVER_URL}/news/uploads`,
      formData
    );
    thumbnailUrl = uploadRes.data.url;
  }

  const finalPayload = { ...payload, thumbnail: thumbnailUrl };

  if (editingId !== null) {
    // Cập nhật news
    await axios.put(`${API_SERVER_URL}/news/${editingId}`, finalPayload);
  } else {
    // Thêm mới sản phẩm
    await axios.post(`${API_SERVER_URL}/news`, finalPayload);
  }
}

export async function getNewsList() {
  try {
    const res = await axios.get(
      // `https://tantrang-backend.onrender.com/api/news/`
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/news/`
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch news list:", err);
  }
}
