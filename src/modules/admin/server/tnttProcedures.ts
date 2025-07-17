"use client";

import axios from "axios";

// TNTT Server
export async function fetchTnttList() {
  const res = await axios.get("http://localhost:3001/api/tntt");
  return res.data;
}

export async function fetchCategoriesList() {
  const res = await axios.get("http://localhost:3001/api/tntt");
  return res.data;
}

export async function addTntt(payload: any) {
  await axios.post("http://localhost:3001/api/tntt", payload);
}

export async function updateTntt(id: number, payload: any) {
  await axios.put(`http://localhost:3001/api/tntt/${id}`, payload);
}

export async function deleteTntt(id: number) {
  await axios.delete(`http://localhost:3001/api/tntt/${id}`);
}
