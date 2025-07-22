"use client";

import axios from "axios";

// TNTT Server
export async function fetchTnttList() {
  const res = await axios.get("https://tantrang-backend.onrender.com/api/tntt");
  return res.data;
}

export async function fetchCategoriesList() {
  const res = await axios.get("https://tantrang-backend.onrender.com/api/tntt");
  return res.data;
}

export async function addTntt(payload: any) {
  await axios.post("https://tantrang-backend.onrender.com/api/tntt", payload);
}

export async function updateTntt(id: number, payload: any) {
  await axios.put(
    `https://tantrang-backend.onrender.com/api/tntt/${id}`,
    payload
  );
}

export async function deleteTntt(id: number) {
  await axios.delete(`https://tantrang-backend.onrender.com/api/tntt/${id}`);
}
