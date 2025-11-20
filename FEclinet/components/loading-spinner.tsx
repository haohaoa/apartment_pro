export function LoadingSpinner({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}
      ></div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    </div>
  )
}
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`
        bg-gray-300/60 
        animate-pulse 
        rounded 
        ${className || "h-6 w-full"}
      `}
    ></div>
  );
}

export function SkeletonLayout() {
  return (
    <div className="p-4 space-y-4">
      {/* Tiêu đề */}
      <Skeleton className="h-6 w-3/4 rounded-md" />
      
      {/* Ảnh/Thumbnail */}
      <Skeleton className="h-48 w-full rounded-lg" />

      {/* Nội dung */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Button */}
      <Skeleton className="h-10 w-32 rounded-full" />
    </div>
  );
}
