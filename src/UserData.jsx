import { useNavigate } from "react-router-dom";
export default function UserData() {
    const navigate = useNavigate();
  return (
    <>
      <div className="py-8 px-2 mx-auto max-w-xl">
        <h1 className="text-4xl font-semibold mb-10">Your data in Heavenhub</h1>
        <div className="flex justify-between  mt-4 items-center border-b pb-2">
          {/* Left Section */}
          <div>
            <h4 className="text-xl font-medium text-gray-800">Your Hometels</h4>
            <p className="text-lg text-gray-500 mb-4">To See your Hometels</p>
          </div>

          {/* Right Section */}
          <button
            className="text-md font-bold underline"
            onClick={() => {
              navigate("/dashboard/user-hometel");
            }}
          >
            View
          </button>
        </div>
        <div className="flex justify-between items-center mt-4 border-b pb-2">
          {/* Left Section */}
          <div>
            <h4 className="text-xl font-medium text-gray-800">Rewiews</h4>
            <p className="text-lg text-gray-500 mb-4">To see your Rewiews</p>
          </div>

          {/* Right Section */}
          <button
            className="text-md font-bold underline"
            onClick={() => {
              navigate("/dashboard/user-reviews");
            }}
          >
            View
          </button>
        </div>
        <div className="flex justify-between items-center mt-4 border-b pb-2">
          {/* Left Section */}
          <div>
            <h4 className="text-xl font-medium text-gray-800">
              Your Favriotes
            </h4>
            <p className="text-lg text-gray-500 mb-4">
              To see your Favroite Hometels
            </p>
          </div>

          {/* Right Section */}
          <button
            className="text-md font-bold underline"
            onClick={() => {
              navigate("/dashboard/user-favriote");
            }}
          >
            View
          </button>
        </div>
        <div className="flex justify-between items-center mt-4 border-b pb-2">
          {/* Left Section */}
          <div>
            <h4 className="text-xl font-medium text-gray-800">
              Your Trips
            </h4>
            <p className="text-lg text-gray-500 mb-4">
              To see your Trips
            </p>
          </div>

          {/* Right Section */}
          <button
            className="text-md font-bold underline"
            onClick={() => {
              navigate("/dashboard/user-trips");
            }}
          >
            View
          </button>
        </div>
      </div>
    </>
  );
}
