export default function Contact() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl font-bold text-primary">Contact Us</h2>
          <p className="text-gray-600 mt-2">
            Our team will get back to you within 24 hours.
          </p>

          <div className="mt-6 space-y-4 text-gray-700">
            <p>📍 Islamabad, Pakistan</p>
            <p>📞 +92 300 1234567</p>
            <p>📧 support@shipsmart.com</p>
          </div>
        </div>

        <form className="bg-light p-8 rounded-xl shadow-lg space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 rounded-lg border"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border"
          />
          <textarea
            placeholder="Message"
            rows="4"
            className="w-full p-3 rounded-lg border"
          ></textarea>

          <button className="bg-primary text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
