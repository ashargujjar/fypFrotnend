const features = [
  {
    title: "Real-Time Shipment Visibility",
    desc: "Track GPS, temperature, humidity and shock levels in real-time.",
    img: "https://images.pexels.com/photos/4484071/pexels-photo-4484071.jpeg",
  },
  {
    title: "AI Powered ETA & Risk Prediction",
    desc: "Our algorithms detect delays and predict arrival times accurately.",
    img: "https://images.pexels.com/photos/2569839/pexels-photo-2569839.jpeg",
  },
  {
    title: "Blockchain Verified Milestones",
    desc: "Every shipment event is recorded permanently on blockchain.",
    img: "https://images.pexels.com/photos/4484073/pexels-photo-4484073.jpeg",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-primary">
          Why Choose ShipSmart?
        </h2>
        <p className="text-gray-500 mt-2">
          Cutting-edge technology designed to make logistics smarter.
        </p>

        <div className="grid md:grid-cols-3 gap-10 mt-16">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden"
            >
              <div className="w-full h-48 overflow-hidden">
                <img src={f.img} className="w-full h-full object-cover" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-dark">{f.title}</h3>
                <p className="text-gray-600 mt-2">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
