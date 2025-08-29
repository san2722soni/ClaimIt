"use client";

import { useEffect } from "react";

export default function CloudUploadButton() {
  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openWidget = () => {
    if (!window.cloudinary) return;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          console.log("Uploaded URL:", result.info.secure_url);
          alert(`File uploaded! URL: ${result.info.secure_url}`);
        }
      }
    );
    widget.open();
  };

  return (
    <button
      onClick={openWidget}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
    >
      Upload to Cloudinary
    </button>
  );
}
