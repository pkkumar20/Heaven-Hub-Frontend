import React, { useState } from "react";
import { Heart, MessageSquareText, House } from "lucide-react";
import avatar from "animal-avatar-generator";
import { useAuth } from "./Auth";
const UserProfileModal = () => {
  const [isOpen, setIsOpen] = useState(true);
        const { user} = useAuth();
            let svg;
      svg = avatar(user.fullname, { size: 150, blackout: false });
  const StatItem = ({ icon, label, value }) => (
    <div className="flex flex-col items-center p-2 hover:bg-gray-100 transition-colors duration-200 rounded">
      {icon}
      <span className="text-sm font-semibold mt-1">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 flex items-center justify-center p-4 mt-10">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in-down">
        <div className="relative p-6">
          <div className="flex flex-col items-center">
            <div className="" dangerouslySetInnerHTML={{ __html: svg }} />
            <TextComponent text={user.fullname} />
            <p className="text-gray-600">{user.email}</p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 text-sm leading-relaxed">
              Discover cozy homes, unique stays, and unforgettable experiences —
              wherever your journey takes you. Your dream rental is just a click
              away
            </p>
          </div>

          <div className="mt-6 flex justify-around border-t border-gray-200 pt-6">
            <StatItem
              icon={
                <House
                  className="text-blue-500 cursor-pointer"
                  size={20}
                />
              }
              label="Hometels"
              value={user.hometels.length}
            />

            <StatItem
              icon={
                <MessageSquareText
                  className="text-green-500 cursor-pointer"
                  size={20}
                />
              }
              label="Reviews"
              value={user.reviews.length}
            />
            <StatItem
              icon={
                <Heart className="text-red-500 fill-red-500 cursor-pointer" />
              }
              label="Favraoites"
              size={20}
              value={user.favoriteHometels.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
const TextComponent = ({ text }) => {
  const formattedText =
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  return (
    <h2 className="mt-4 text-2xl font-bold text-gray-800">{formattedText}</h2>
  );
};
export default UserProfileModal;
