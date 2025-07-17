"use client";

import axios from "axios";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  categoryId: number;
  isFeatured?: boolean;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

export async function fetchNewsList() {
  const res = await axios.get("http://localhost:3001/api/news");
  return res.data;
}

export async function fetchCategoriesList() {
  const res = await axios.get("http://localhost:3001/api/category");
  return res.data;
}

export async function addNews(payload: any) {
  await axios.post("http://localhost:3001/api/news", payload);
}

export async function updateNews(id: number, payload: any) {
  await axios.put(`http://localhost:3001/api/news/${id}`, payload);
}

export async function deleteNews(id: number) {
  await axios.delete(`http://localhost:3001/api/news/${id}`);
}
