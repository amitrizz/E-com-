"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { authHeaders, useAuth } from "@/hooks/auth-context";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export function SizeChartUpload({ value, onChange }: Props) {
  const { token } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await fetch("/api/admin/upload-images", {
        method: "POST",
        headers: authHeaders(token),
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      const url = (data.urls as string[])?.[0];
      if (url) onChange(url);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm mb-2">Size chart image (optional)</label>
      <p className="text-xs text-muted mb-3">
        Upload a size guide (JPEG/PNG). Stored optimized in MongoDB. Shoppers see this alongside size
        labels when both are set.
      </p>

      {value && (
        <div className="relative w-full max-w-xs aspect-[4/3] border border-line bg-stone mb-4">
          <Image src={value} alt="Size chart preview" fill className="object-contain" sizes="320px" unoptimized />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-1 right-1 w-6 h-6 bg-ink text-paper text-xs leading-6 text-center"
            aria-label="Remove size chart"
          >
            ×
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:border file:border-line file:bg-paper file:text-ink"
        disabled={uploading}
        onChange={(e) => onFiles(e.target.files)}
      />

      {uploading && <p className="text-sm text-muted mt-2">Optimizing and uploading…</p>}
      {error && (
        <p className="text-sm text-red-700 mt-2" role="alert">{error}</p>
      )}
    </div>
  );
}
