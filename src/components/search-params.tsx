"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";

export function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedValue) {
      params.set("q", debouncedValue);
    } else {
      params.delete("q");
    }
    const next = `?${params.toString()}`;
    const current = `?${searchParams.toString()}`;
    if (next === current) return;

    setIsLoading(true);
    router.replace(next);
    setTimeout(() => setIsLoading(false), 300);
  }, [debouncedValue, router]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Input
          placeholder="Tìm kiếm tin tức..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full pl-10 pr-10 py-3 text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ?
            <Spinner className="h-5 w-5" />
          : <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.313 0 6 2.687 6 6s-2.687 6-6 6-6-2.687-6-6 2.687-6 6-6z" />
            </svg>
          }
        </div>
        {value && (
          <button
            onClick={() => setValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            aria-label="Xóa tìm kiếm"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      {debouncedValue && (
        <div className="absolute top-full left-0 right-0 mt-1 text-sm text-gray-500 bg-white px-3 py-1 rounded shadow-sm border">
          Đang tìm kiếm: "{debouncedValue}"
        </div>
      )}
    </div>
  );
}
