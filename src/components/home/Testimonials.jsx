const reviews = [
  {
    name: "Ahmed Khan",
    role: "E-Commerce Seller",
    review:
      "ShipSmart completely changed our delivery experience. Real-time IoT tracking is a game changer.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sara Malik",
    role: "Cold-Chain Exporter",
    review:
      "Temperature alerts helped us save sensitive shipments many times. Highly reliable platform.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Bilal Sheikh",
    role: "Logistics Manager",
    review:
      "The blockchain milestone logs provide unmatched transparency and trust.",
    img: "https://randomuser.me/api/portraits/men/14.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-primary">
          What Our Customers Say
        </h2>
        <p className="text-gray-500 mt-2">
          Trusted by businesses across Pakistan
        </p>

        <div className="grid md:grid-cols-3 gap-10 mt-14">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-light rounded-xl shadow-md p-6 hover:shadow-xl transition"
            >
              <img src={r.img} className="w-16 mx-auto rounded-full" />

              <p className="text-gray-700 mt-4 italic">“{r.review}”</p>

              <div className="mt-4">
                <h3 className="text-lg font-bold">{r.name}</h3>
                <span className="text-sm text-gray-500">{r.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
