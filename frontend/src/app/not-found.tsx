import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-600">404</h1>
        <h2 className="text-xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link
            href="/"
            className="rounded-md bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-medium hover:bg-gray-50 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
