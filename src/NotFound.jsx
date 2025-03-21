import { Link } from "react-router-dom";

const NotFound = ({ message,link }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black px-4">
      {/* Illustration */}
      <img
        src="/404.svg"
        alt="404 Not Found"
        className="w-[500px] max-w-full"
      />

      {/* Text */}
      <h2 className="text-xl font-semibold text-blue-400 mt-4">
        404 Not Found
      </h2>
      <h1 className="text-3xl md:text-4xl font-bold mt-2 text-center">
        {message || "Whoops! That page doesn’t exist."}
      </h1>

      <p className="text-gray-400 mt-2 text-center">
        Here are some helpful links instead:
      </p>

      {/* Button to Homepage */}
      <Link
        to={link||"/"}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
      >
        Go Back
      </Link>
    </div>
  );
};

export default NotFound;
