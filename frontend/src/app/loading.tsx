export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Logo Animation */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-[#FF6B35]/20 rounded-full animate-ping" />
          <div className="absolute inset-2 border-4 border-[#FF6B35] rounded-full border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">✈️</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Packing your bags...</h2>
        <p className="text-gray-500 text-sm">Getting everything ready for your adventure</p>
      </div>
    </div>
  );
}
