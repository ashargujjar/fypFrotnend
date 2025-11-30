export default function Hero() {
  return (
    <section className="relative bg-white">
      {/* Background Image */}
      <img
        src="https://images.pexels.com/photos/4484071/pexels-photo-4484071.jpeg"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-500/60"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-10 items-center">
        {/* Left Text */}
        <div>
          <h1 className="text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
            Next-Gen Smart Logistics
            <span className="block text-secondary">
              Powered by AI • IoT • Blockchain
            </span>
          </h1>

          <p className="text-gray-200 mt-4 text-lg max-w-lg">
            Experience real-time tracking, predictive analytics, and verified
            delivery through cutting-edge logistics technology.
          </p>

          <div className="mt-8 flex space-x-4">
            <button className="px-6 py-3 bg-secondary text-black font-semibold rounded-lg hover:opacity-90 transition">
              Track Shipment
            </button>
            <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-700 transition">
              Get Started
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="hidden md:block">
          <img
            src="https://cdn-icons-png.flaticon.com/512/679/679720.png"
            className="w-full drop-shadow-xl animate-fadeInUp"
          />
        </div>
      </div>
    </section>
  );
}
