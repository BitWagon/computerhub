"use client";

import { RefreshCw } from "lucide-react";

export default function LoadingSpinner({
  text = "Loading...",
  size = "md",
  fullScreen = false,
}) {
  const iconSize =
    size === "sm"
      ? 18
      : size === "lg"
      ? 36
      : 24;

  const textClass =
    size === "sm"
      ? "text-sm"
      : size === "lg"
      ? "text-lg"
      : "text-base";

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <RefreshCw
        size={iconSize}
        className="animate-spin text-blue-600"
      />

      <p className={`${textClass} font-medium text-gray-500`}>
        {text}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {content}
    </div>
  );
}