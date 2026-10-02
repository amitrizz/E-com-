"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadAdminImages } from "@/lib/admin-upload-client";
import { formatMaxUploadMb } from "@/lib/image-upload-limits";
import { useAuth } from "@/hooks/auth-context";

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
      const result = await uploadAdminImages(Array.from(files), token);
      if (result.error) {
        setError(result.error);
      } else if (result.urls?.length) {
        onChange([...value, ...result.urls]);
      } else {
        setError("Upload failed.");
      }
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
        Upload JPEG, PNG, WebP, GIF, or AVIF. Stored as WebP in MongoDB (max 6 images, {formatMaxUploadMb()} each).
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
