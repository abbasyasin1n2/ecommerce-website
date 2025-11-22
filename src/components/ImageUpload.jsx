'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ImageUpload({ onUploadComplete, folder = 'ecommerce' }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (e.g., max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadedUrl(data.url);
      if (onUploadComplete) {
        onUploadComplete(data.url, data.publicId);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="image-upload" className="cursor-pointer">
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            asChild
          >
            <span>{uploading ? 'Uploading...' : 'Choose Image'}</span>
          </Button>
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {uploadedUrl && (
        <div className="space-y-2">
          <p className="text-sm text-green-600">Upload successful!</p>
          <img
            src={uploadedUrl}
            alt="Uploaded"
            className="max-w-xs rounded-md border"
          />
          <p className="text-xs text-gray-500 break-all">{uploadedUrl}</p>
        </div>
      )}
    </div>
  );
}


