import { useState } from "react";

const faq = [
  {
    q: "How does ShipSmart track shipments?",
    a: "We use IoT GPS + temperature + shock sensors connected to our backend.",
  },
  {
    q: "How does blockchain help in logistics?",
    a: "Each shipment milestone is permanently logged, preventing fraud or tampering.",
  },
  {
    q: "Is ShipSmart suitable for cold-chain?",
    a: "Yes! We monitor temperature in real-time and trigger alerts on threshold breaches.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-20 bg-light">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-primary text-center">
          Frequently Asked Questions
        </h2>

        <div className="mt-10 space-y-4">
          {faq.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow cursor-pointer"
              onClick={() => setOpen(open === index ? null : index)}
            >
              <h3 className="font-bold text-lg flex justify-between">
                {item.q}
                <span>{open === index ? "−" : "+"}</span>
              </h3>

              {open === index && <p className="text-gray-600 mt-3">{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
