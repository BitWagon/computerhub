// ========================================
// ComputerHub Cloudinary Upload Helper
// src/lib/imageUpload.js
// ========================================

const CLOUDINARY_URL =
  process.env.NEXT_PUBLIC_CLOUDINARY_URL ||
  process.env.CLOUDINARY_URL;

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
  process.env.CLOUDINARY_UPLOAD_PRESET;

export async function uploadImage(file) {
  if (!file) {
    throw new Error("Image is required.");
  }

  if (!CLOUDINARY_URL) {
    throw new Error("Cloudinary URL is missing.");
  }

  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary upload preset is missing.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    CLOUDINARY_UPLOAD_PRESET
  );

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.secure_url) {
    throw new Error(
      data.error?.message || "Image upload failed."
    );
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
  };
}

export async function uploadMultipleImages(files = []) {
  const uploaded = [];

  for (const file of files) {
    uploaded.push(await uploadImage(file));
  }

  return uploaded;
}

export function isValidImage(file) {
  if (!file) return false;

  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  return allowed.includes(file.type);
}

export function validateImageSize(
  file,
  maxMB = 5
) {
  if (!file) return false;

  return file.size <= maxMB * 1024 * 1024;
}