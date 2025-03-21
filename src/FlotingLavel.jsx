import Select from "./Select";

export default function FloatingLabel() {
  const handleSelectChange = (name) => {
  };

  return (
    <>
      <div className="py-8 px-4 mx-auto max-w-4xl lg:py-16">
        {/** Wrapper with consistent margin/padding for all input fields **/}
        <div className="space-y-6">
          {" "}
          {/* Adds uniform spacing between each field */}
          <div className="relative">
            <input
              type="text"
              required
              className="w-full h-12 text-black placeholder-transparent bg-transparent border border-gray-500 rounded-md px-2 outline-none peer transition duration-300"
            />
            <label
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 bg-white px-1 transition-all duration-300 pointer-events-none
              peer-focus:top-[-6px] peer-focus:left-2 peer-focus:text-blue-400 peer-focus:text-sm
              peer-valid:top-[-6px] peer-valid:left-2 peer-valid:text-gray-500 peer-valid:text-sm"
            >
              Title
            </label>
          </div>
          <div className="relative">
            <textarea
              required
              className="w-full h-12 text-black placeholder-transparent bg-transparent border border-gray-500 rounded-md px-2 outline-none peer transition duration-300"
            />
            <label
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 bg-white px-1 transition-all duration-300 pointer-events-none
              peer-focus:top-[-6px] peer-focus:left-2 peer-focus:text-blue-400 peer-focus:text-sm
              peer-valid:top-[-6px] peer-valid:left-2 peer-valid:text-gray-500 peer-valid:text-sm"
            >
              Description
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              required
              className="w-full h-12 text-black placeholder-transparent bg-transparent border border-gray-500 rounded-md px-2 outline-none peer transition duration-300"
            />
            <label
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 bg-white px-1 transition-all duration-300 pointer-events-none
              peer-focus:top-[-6px] peer-focus:left-2 peer-focus:text-blue-400 peer-focus:text-sm
              peer-valid:top-[-6px] peer-valid:left-2 peer-valid:text-gray-500 peer-valid:text-sm"
            >
              Location
            </label>
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative">
              <input
                type="text"
                required
                className="w-full h-12 text-black placeholder-transparent bg-transparent border border-gray-500 rounded-md px-2 outline-none peer transition duration-300"
              />
              <label
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 bg-white px-1 transition-all duration-300 pointer-events-none
                peer-focus:top-[-6px] peer-focus:left-2 peer-focus:text-blue-400 peer-focus:text-sm
                peer-valid:top-[-6px] peer-valid:left-2 peer-valid:text-gray-500 peer-valid:text-sm"
              >
                Price
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                className="w-full h-12 text-black placeholder-transparent bg-transparent border border-gray-500 rounded-md px-2 outline-none peer transition duration-300"
              />
              <label
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 bg-white px-1 transition-all duration-300 pointer-events-none
                peer-focus:top-[-6px] peer-focus:left-2 peer-focus:text-blue-400 peer-focus:text-sm
                peer-valid:top-[-6px] peer-valid:left-2 peer-valid:text-gray-500 peer-valid:text-sm"
              >
                Country
              </label>
            </div>
          </div>
          <Select prnames={handleSelectChange} />
          
        </div>
      </div>
    </>
  );
}
