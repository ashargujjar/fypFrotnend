export default function AdminTopbar() {
  return (
    <div className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h2 className="text-xl font-bold text-primary">Admin Dashboard</h2>
      <img
        src="https://randomuser.me/api/portraits/men/37.jpg"
        className="w-10 h-10 rounded-full border"
      />
    </div>
  );
}
