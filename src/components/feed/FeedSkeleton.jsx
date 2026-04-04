function Bone({ className = '' }) {
  return <div className={`bg-olive/10 rounded-lg animate-pulse ${className}`} />
}

export default function FeedSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="border-b-2 border-olive/20 pb-4 flex items-center justify-between">
        <div className="space-y-2">
          <Bone className="h-8 w-48" />
          <Bone className="h-3 w-32" />
        </div>
        <div className="flex gap-2">
          <Bone className="h-6 w-20 rounded-full" />
          <Bone className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Hero + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 space-y-3">
          <Bone className="h-6 w-24 rounded-full" />
          <Bone className="h-7 w-3/4" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-5/6" />
          <Bone className="h-4 w-4/6" />
        </div>
        <div className="space-y-3">
          <Bone className="h-5 w-20" />
          <Bone className="h-32 w-full rounded-2xl" />
          <Bone className="h-20 w-full rounded-2xl" />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-olive/20 p-5 space-y-3">
            <Bone className="h-4 w-24 rounded-full" />
            <Bone className="h-5 w-3/4" />
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-5/6" />
            <Bone className="h-3 w-4/6" />
          </div>
        ))}
      </div>
    </div>
  )
}
