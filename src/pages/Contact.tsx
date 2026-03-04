import { useState, useCallback } from "react";
import Layout from "@/components/Layout";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("gramrakshak-lang");
    return (saved as Lang) || "en";
  });

  const t = translations[lang];
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const newLang = prev === "en" ? "te" : "en";
      localStorage.setItem("gramrakshak-lang", newLang);
      return newLang;
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just simulate submit
    console.log("Form submitted", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Layout lang={lang} onToggleLang={toggleLang}>
      <section className="bg-blue-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Contact Us</h1>
          <p className="text-gray-700">
            Have questions or want to report a cybercrime? Reach out to us below.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-700" size={24} />
              <span>Cyber Awareness Center, New Delhi, India</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-blue-700" size={24} />
              <span>+91 12345 67890</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-blue-700" size={24} />
              <span>support@cyberaware.gov.in</span>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 space-y-4">
            {submitted && (
              <div className="p-3 bg-green-100 text-green-800 rounded">
                Thank you! We received your message.
              </div>
            )}
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-700 text-white font-semibold py-2 rounded hover:bg-blue-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;