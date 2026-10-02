"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { authHeaders, useAuth } from "@/hooks/auth-context";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export function ProductImageUpload({ value, onChange }: Props) {
  const { token } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
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
      onChange([...value, ...(data.urls as string[])]);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div>
      <label className="block text-sm mb-2">Product images</label>
      <p className="text-xs text-muted mb-3">
        Upload JPEG, PNG, WebP, GIF, or AVIF. We optimize and store as WebP in MongoDB (max 6 images, 8MB each).
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        {value.map((url) => (
          <div key={url} className="relative w-24 h-28 border border-line bg-stone">
            <Image src={url} alt="" fill className="object-cover" sizes="96px" unoptimized />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute top-1 right-1 w-6 h-6 bg-ink text-paper text-xs leading-6 text-center"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif,.avif"
        multiple
        className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:border file:border-line file:bg-paper file:text-ink"
        disabled={uploading || value.length >= 6}
        onChange={(e) => onFiles(e.target.files)}
      />

      {uploading && <p className="text-sm text-muted mt-2">Optimizing and uploading…</p>}
      {error && (
        <p className="text-sm text-red-700 mt-2" role="alert">{error}</p>
      )}
      {value.length === 0 && (
        <p className="text-xs text-muted mt-2">At least one image is required to publish.</p>
      )}
    </div>
  );
}
