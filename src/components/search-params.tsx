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
    const updateSearchParams = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(searchParams);
        if (debouncedValue) {
          params.set("q", debouncedValue);
        } else {
          params.delete("q");
        }
        await router.push(`?${params.toString()}`);
      } finally {
        setIsLoading(false);
      }
    };
    updateSearchParams();
  }, [debouncedValue, router, searchParams]);

  return (
    <div className="relative w-full max-w-sm">
      <Input
        placeholder="Tìm kiếm..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-8 pr-8"
      />
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
        {isLoading ?
          <Spinner />
        : <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.313 0 6 2.687 6 6s-2.687 6-6 6-6-2.687-6-6 2.687-6 6-6z" />
          </svg>
        }
      </div>
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg
            width="16"
            height="16"
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
  );
}
