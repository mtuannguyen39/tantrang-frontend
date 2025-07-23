"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
}

interface CategoryProps {
  categories: Category[];
  selectedCategory: number | null;
  setSelectedCategory: (categoryId: number | null) => void;
}

export default function CategoryFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-6">
      <Button
        onClick={() => setSelectedCategory(null)}
        className={`px-4 py-2 border rounded full ${
          selectedCategory === null
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700"
        } transition-colors duration-200 hover:bg-gray-100`}
      >
        Tất cả
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          onClick={() => setSelectedCategory(cat.id)}
          className={`px-4 py-2 border rounded full ${
            selectedCategory === cat.id
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
          }transition-colors duration-200 hover:bg-gray-100`}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}
