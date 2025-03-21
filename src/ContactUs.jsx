import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const ContactUs = () => {
      const navigate = useNavigate();
  return (
    <div className="max-w-4xl mt-3 mb-3 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
      <p className="text-gray-700 text-lg mb-4 text-center">
        We'd love to hear from you! Whether you have a question about our
        platform, need support, or just want to provide feedback, feel free to
        reach out.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Get in Touch</h2>
      <p className="text-gray-700 text-lg">
        You can contact us through the following channels:
      </p>
      <ul className="list-disc list-inside text-gray-700 text-lg mb-4">
        <li>
          <strong>Email:</strong> heavenhub6@gmail.com
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">Send Us a Message</h2>
      <form className="mt-4 space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 border rounded-md"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 border rounded-md"
          required
        />
        <textarea
          placeholder="Your Message"
          rows="5"
          className="w-full p-3 border rounded-md"
          required
        ></textarea>
        <button
          onClick={() => {navigate("/");toast.success("Message sent susessfully")}}
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
