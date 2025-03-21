import React, { useState } from "react";

const GuestSelector = ({ onClose, onSave }) => {
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const maxGuests = 3; // Max guests excluding infants

  const handleChange = (type, delta) => {
    setGuests((prev) => {
      const newCount = prev[type] + delta;

      // Ensure limits: no negative numbers & max guest rule
      if (newCount < 0) return prev;
      if (type !== "infants" && type !== "pets") {
        const totalGuests = newCount + prev.children;
        if (totalGuests > maxGuests) return prev;
      }

      return { ...prev, [type]: newCount };
    });
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
        <h2 className="text-xl font-semibold">Guests</h2>
        <p className="text-sm text-gray-500">
          This place has a maximum of {maxGuests} guests, not including infants.
          If you’re bringing more than 2 pets, please let your host know.
        </p>

        <div className="mt-4 space-y-4">
          {[
            { label: "Adults", sub: "Age 13+", key: "adults" },
            { label: "Children", sub: "Ages 2 – 12", key: "children" },
            { label: "Infants", sub: "Under 2", key: "infants" },
            { label: "Pets", sub: "Bringing a service animal?", key: "pets" },
          ].map(({ label, sub, key }) => (
            <div key={key} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-gray-500">{sub}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleChange(key, -1)}
                  className="w-8 h-8 rounded-full bg-gray-200 text-xl text-gray-700 disabled:opacity-50"
                  disabled={key === "adults" && guests[key] === 1} // Disable if Adults = 1
                >
                  –
                </button>
                <span className="w-6 text-center">{guests[key]}</span>
                <button
                  onClick={() => handleChange(key, 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 text-xl text-gray-700"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button onClick={onClose} className="text-gray-600">
            Cancel
          </button>
          <button
            onClick={() => onSave(guests)}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestSelector;
