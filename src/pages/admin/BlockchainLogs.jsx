import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

export default function BlockchainLogs() {
  const logs = [
    { id: "SS-1012", event: "Picked Up", hash: "0x2343...A3F", block: 123334 },
    { id: "SS-1012", event: "In Transit", hash: "0xBB1C...37D", block: 123450 },
  ];

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-light min-h-screen">
        <AdminTopbar />

        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Blockchain Logs
          </h1>

          <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b">
                  <th className="p-3">Shipment</th>
                  <th className="p-3">Event</th>
                  <th className="p-3">Hash</th>
                  <th className="p-3">Block</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.hash} className="border-b">
                    <td className="p-3">{l.id}</td>
                    <td className="p-3">{l.event}</td>
                    <td className="p-3 text-primary">{l.hash}</td>
                    <td className="p-3">{l.block}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
