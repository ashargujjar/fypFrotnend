export default function Topbar() {
  return (
    <div className="w-full bg-white shadow-md py-4 px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h2 className="text-xl font-bold text-primary">Customer Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="text-gray-500 text-sm sm:text-base">Notifications</span>

        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          className="w-10 h-10 rounded-full border self-start sm:self-center"
        />
      </div>
    </div>
  );
}
