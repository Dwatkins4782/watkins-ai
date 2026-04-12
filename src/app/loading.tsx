export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary, #0a0a1a)' }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-lg" style={{ color: 'var(--text-secondary, #94a3b8)' }}>Loading...</p>
      </div>
    </div>
  );
}
