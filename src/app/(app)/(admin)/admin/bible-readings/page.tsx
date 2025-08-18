"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
  getAllReading,
  getAllCategories,
  getAllLiturgicalYear,
  saveReading,
  deleteReading,
  deleteCurrentImage,
} from "@/modules/bible-reading/server/procedures";

import RichText from "@/components/RichText";
import Image from "next/image";

interface BibleReading {
  id: number;
  title: string;
  slug: string;
  scripture: string;
  reading1?: string;
  reading2?: string;
  psalm?: string;
  alleluia?: string;
  gospel: string;
  thumbnail?: string;
  liturgicalYearId: number;
  categoryId: number;
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

// Utility function để convert markdown sang HTML
function markdownToHtml(markdown: string): string {
  return (
    markdown
      // Headers
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")

      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")

      // Underline (custom syntax)
      .replace(/__(.*?)__/g, "<u>$1</u>")

      // Superscript (custom syntax)
      .replace(/\^(.*?)\^/g, "<sup>$1</sup>")

      // Line breaks
      .replace(/\n/g, "<br>")
  );

  // // Lists
  // .replace(/^\* (.*$)/gim, '<li>$1</li>')
  // .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  // // Numbered lists
  // .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
  // .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
}

// Utility function để convert markdown sang plain text
function markdownToText(markdown: string): string {
  return (
    markdown
      // Remove headers
      .replace(/^#{1,6} (.*$)/gim, "$1")

      // Remove bold/italic
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")

      // Remove underline
      .replace(/__(.*?)__/g, "$1")

      // Remove superscript
      .replace(/\^(.*?)\^/g, "$1")

      // // Remove list markers
      // .replace(/^\* /gim, '')
      // .replace(/^\d+\. /gim, '')

      // Clean up extra spaces and line breaks
      .replace(/\n+/g, " ")
      .trim()
  );
}

export default function AdminReadingPage() {
  const [readings, setReadings] = useState<BibleReading[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [liturgicalYears, setLiturgicalYears] = useState<LiturgicalYear[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [scripture, setScripture] = useState("");
  const [reading1, setReading1] = useState("");
  const [reading2, setReading2] = useState("");
  const [psalm, setPsalm] = useState("");
  const [alleluia, setAlleluia] = useState("");
  const [gospel, setGospel] = useState("");
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<
    string | undefined
  >(undefined);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [liturgicalYearId, setLiturgicalYearId] = useState<number | null>(null);

  async function fetchReadingData() {
    try {
      const readingData = await getAllReading();
      setReadings(readingData);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function fetchCategoriesData() {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function fetchLiturgicalYearData() {
    try {
      const liturgicalYearData = await getAllLiturgicalYear();
      setLiturgicalYears(liturgicalYearData);
    } catch (error: any) {
      alert(error.message);
    }
  }

  useEffect(() => {
    fetchReadingData();
    fetchCategoriesData();
    fetchLiturgicalYearData();
  }, []);

  async function handleAddOrUpdate() {
    try {
      if (!categoryId) {
        alert("Vui lòng chọn danh mục!");
        return;
      }

      // Convert markdown description thành HTML trước khi lưu
      // const htmlDescription = markdownToHtml(description); Hiện tại chưa cần
      // const plainDescription = markdownToText(description);

      const payload: Omit<BibleReading, "id"> = {
        title,
        reading1: reading1,
        reading2: reading2,
        psalm: psalm,
        alleluia: alleluia,
        gospel: gospel,
        slug,
        scripture,
        thumbnail: currentThumbnailUrl,
        categoryId,
        liturgicalYearId: liturgicalYearId ?? 0,
      };

      await saveReading(payload, file, editingId);

      setTitle("");
      setReading1("");
      setReading2("");
      setPsalm("");
      setAlleluia("");
      setGospel("");
      setSlug("");
      setScripture("");
      setFile(null);
      setEditingId(null);
      setCategoryId(null);
      setCurrentThumbnailUrl(undefined);
      fetchReadingData();
    } catch (error) {
      console.error("Lỗi khi lưu Kinh Thánh:", error);
      alert("Lưu Kinh Thánh thất bại. Vui lòng thử lại");
    }
  }

  function startEdit(item: BibleReading) {
    setTitle(item.title);
    setSlug(item.slug);
    setReading1(item.reading1 || "");
    setReading2(item.reading2 || "");
    setPsalm(item.psalm || "");
    setAlleluia(item.alleluia || "");
    setGospel(item.gospel);
    setLiturgicalYearId(item.liturgicalYearId);
    setScripture(item.scripture);
    setFile(null);
    setCategoryId(item.categoryId);
    setEditingId(item.id);
    setCurrentThumbnailUrl(item.thumbnail);
  }

  async function handleDeleteCurrentImageFromUI() {
    if (!currentThumbnailUrl) return;

    try {
      await deleteCurrentImage(currentThumbnailUrl);
      setReadings((prevReading) =>
        prevReading.map((read) =>
          read.id === editingId ? { ...read, thumbnail: undefined } : read
        )
      );

      setCurrentThumbnailUrl(undefined);
      setFile(null);
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className="flex min-h-screen max-w-screen bg-[#f9f9ff]">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
          Quản lý các sách Kinh Thánh
        </h1>
        {/* Debug section - có thể xóa sau */}
        {/* {description && (
          <div className="bg-yellow-50 p-4 rounded mb-4 text-sm">
            <strong>Debug - Current markdown:</strong>
            <pre className="mt-2 text-xs">{description}</pre>
            <strong>Will save as HTML:</strong>
            <div
              className="mt-2 p-2 bg-white rounded"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(description) }}
            />
          </div>
        )} */}

        {/* Thêm mới nội dung Kinh Thánh */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-medium mb-4 text-[#2d27ff]">
            {editingId ?
              "Chỉnh sửa Kinh Thánh"
            : "Thêm mới nội dung Kinh Thánh"}
          </h2>
          <div className="flex flex-col space-y-3">
            <input
              type="text"
              value={title}
              placeholder="Tiêu đề sách Kinh Thánh - Ví dụ: Dụ ngôn Người Cha nhân hậu"
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded p-2"
            />

            <input
              type="text"
              value={slug}
              placeholder="slug"
              onChange={(e) => setSlug(e.target.value)}
              className="border rounded p-2"
            />
            {/* Bài đọc 1 */}
            <p className="text-gray-800 font-bold text-base">
              Nội dung bài đọc 1
            </p>
            <RichText
              value={reading1}
              onChange={setReading1}
              placeholder="Nội dung Kinh Thánh"
              className="min-h-[150px]"
            />
            {/* Đáp ca */}
            <p className="text-gray-800 font-bold text-base">Nội dung đáp ca</p>
            <RichText
              value={psalm}
              onChange={setPsalm}
              className="min-h-[150px]"
            />
            {/* Bài đọc 2 */}
            <p className="text-gray-800 font-bold text-base">
              Nội dung bài đọc 2
            </p>
            <RichText
              value={reading2}
              onChange={setReading2}
              className="min-h-[150px]"
            />
            {/* Alleluia */}
            <p className="text-gray-800 font-bold text-base">
              Nội dung Alleluia
            </p>
            <RichText
              value={alleluia}
              onChange={setAlleluia}
              className="min-h-[150px]"
            />
            {/* Tin Mừng */}
            <p className="text-gray-800 font-bold text-base">
              Nội dung đoạn Tin Mừng
            </p>
            <RichText
              value={gospel}
              onChange={setGospel}
              className="min-h-[150px]"
            />

            <input
              type="text"
              value={scripture}
              placeholder="Ga 13, 1-16"
              onChange={(e) => setScripture(e.target.value)}
              className="border rounded p-2"
            />
            {/* Chọn danh mục */}
            <select
              className="border p-2 rounded"
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                Chọn danh mục
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {/* Chọn danh mục Năm Phụng Vụ */}
            <select
              className="border p-2 rounded"
              value={liturgicalYearId ?? ""}
              onChange={(e) => setLiturgicalYearId(Number(e.target.value))}
            >
              <option value="" disabled>
                Chọn Năm Phụng Vụ
              </option>
              {liturgicalYears.map((years) => (
                <option key={years.id} value={years.id}>
                  {years.name} - {years.code}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Chọn hình ảnh
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFile(e.target.files[0]);
                      setCurrentThumbnailUrl(undefined); // Xóa URL thumbnail hiện tại khi chọn file mới
                    }
                  }}
                />
              </label>
              {/* Hiển thị preview của file mới chọn */}
              {file && (
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="object-cover rounded border"
                  width={160}
                  height={160}
                  priority // Tải sớm ảnh preview
                />
              )}

              {/* Hiển thị hình ảnh hiện tại khi chỉnh sửa và chưa chọn file mới */}
              {editingId && !file && currentThumbnailUrl && (
                <div className="relative">
                  <Image
                    src={currentThumbnailUrl}
                    alt="Preview"
                    className="object-cover rounded border"
                    width={160}
                    height={160}
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold cursor-pointer"
                    onClick={handleDeleteCurrentImageFromUI}
                    title="Xóa hình ảnh hiện tại"
                  >
                    X
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleAddOrUpdate}
              className="bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90"
            >
              {editingId ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>

        {/* Danh sách hiển thị Kinh Thánh */}
        <div className="text-xl font-semibold mb-4 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
          Danh sách các sách Kinh Thánh
        </div>
        <ul className="space-y-4">
          {readings.map((reading) => (
            <li
              key={reading.id}
              className="flex overflow-hidden bg-white rounded-lg shadow-sm cursor-pointer"
              onClick={() => startEdit(reading)}
            >
              {reading.thumbnail && (
                <img
                  src={reading.thumbnail}
                  alt={reading.title}
                  className="w-40 h-28 object-cover"
                />
              )}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium">{reading.title}</h3>
                  {/* <p className="text-sm text-gray-600 line-clamp-1 w-196">
                    Bài đọc 1: {reading.reading1 || "Không có bài đọc 1"} <br />
                    Đáp ca: {reading.psalm || "Không có đáp ca"} <br />
                    Alleluia: {reading.alleluia || "Không có Alleluia"} <br />
                    Bài đọc 2: {reading.reading2 || "Không có bài đọc 2"} <br />
                  </p> */}
                  <span className="text-xs text-gray-400 mt-1">
                    Năm Phụng Vụ: {reading.liturgicalYearId} - Danh mục:{" "}
                    {reading.categoryId}
                  </span>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="bg-[#ff2525] text-white h-[100%] w-20 rounded cursor-pointer hover:opacity-70"
                  onClick={() => deleteReading(reading.id, reading.thumbnail)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
