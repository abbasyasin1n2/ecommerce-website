'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function UploadTestPage() {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleUploadComplete = (url, publicId) => {
    setUploadedImages((prev) => [
      ...prev,
      { url, publicId, uploadedAt: new Date().toISOString() },
    ]);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Cloudinary Image Upload Test</h1>
      
      <div className="space-y-8">
        {/* Upload Section */}
        <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          <ImageUpload 
            onUploadComplete={handleUploadComplete}
            folder="ecommerce/test"
          />
        </div>

        {/* Uploaded Images List */}
        {uploadedImages.length > 0 && (
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">
              Uploaded Images ({uploadedImages.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <img
                    src={image.url}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 break-all">
                      <strong>URL:</strong> {image.url}
                    </p>
                    <p className="text-xs text-gray-500 break-all">
                      <strong>Public ID:</strong> {image.publicId}
                    </p>
                    <p className="text-xs text-gray-500">
                      <strong>Uploaded:</strong>{' '}
                      {new Date(image.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(image.url);
                      alert('URL copied to clipboard!');
                    }}
                    className="text-xs text-blue-500 hover:text-blue-700 underline"
                  >
                    Copy URL
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="border rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Click "Choose Image" to select an image file</li>
            <li>Supported formats: JPG, PNG, GIF, WebP, etc.</li>
            <li>Maximum file size: 10MB</li>
            <li>Images will be uploaded to Cloudinary and stored in the "ecommerce/test" folder</li>
            <li>After upload, you'll see the image preview and URL</li>
            <li>Click "Copy URL" to copy the image URL to your clipboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


