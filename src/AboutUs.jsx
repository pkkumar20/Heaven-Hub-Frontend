import React from "react";

const AboutUs = () => {
  return (
    <div className="max-w-4xl mt-3 mb-3 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">About Us</h1>
      <p className="text-gray-700 text-lg mb-4">
        Welcome to <strong>Heaven Hub</strong>, your trusted platform for
        finding and renting homes with ease. Our mission is to connect
        homeowners and renters seamlessly, providing a hassle-free rental
        experience for everyone.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Our Mission</h2>
      <p className="text-gray-700 text-lg mb-4">
        We strive to simplify the home rental process by offering a secure,
        user-friendly, and transparent platform. Whether you're a homeowner
        looking to rent out your property or a renter searching for the perfect
        home, we make the process smooth and efficient.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Why Choose Us?</h2>
      <ul className="list-disc list-inside text-gray-700 text-lg mb-4">
        <li>Wide range of verified rental listings</li>
        <li>Secure and transparent transactions</li>
        <li>Easy-to-use platform with advanced search filters</li>
        <li>24/7 customer support for a seamless experience</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">Our Story</h2>
      <p className="text-gray-700 text-lg mb-4">
        Founded in 2024, <strong>Heaven Hub</strong> was built with the
        vision of revolutionizing the rental industry. Our team of experts is
        dedicated to providing innovative solutions to make home renting simpler
        and more accessible for everyone.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
      <p className="text-gray-700 text-lg">
        Have questions or need support? Feel free to reach out to us at:
      </p>
      <p className="text-gray-700 font-semibold">Email: heavenhub6@gmail.com</p>
    </div>
  );
};

export default AboutUs;
