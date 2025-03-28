// import { Button } from "@/components/ui/button";
// import { Star } from "lucide-react";
import avatar from "animal-avatar-generator";
export default function MeetYourHost({name,email}) {
  let svg = avatar(email||"", { size: 90, blackout: false });
  return (
    <div className="mt-3 mb-3">
      <h2 className="text-2xl font-semibold mb-4">Meet your host</h2>
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6">
        {/* Left Side: Profile */}
        <div className="flex flex-col items-center w-80 border-r pr-6">
          <div className="relative">
            <div
              className="rounded-full w-24 h-24 object-cover"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
          <h2 className="text-xl font-semibold mt-4">{name||""}</h2>
          <span className="text-gray-500 flex items-center gap-1 mt-1">
            Superhost
          </span>
        </div>
        {/* Right Side: Details */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{`${name||""} is a Superhost`}</h3>
          <p className="text-gray-600 mt-1">
            Superhosts are experienced, highly rated hosts who are committed to
            providing great stays for guests.
          </p>
          <h4 className="text-md font-semibold mt-4">Host details</h4>
          <p className="text-gray-600">Response rate: 100%</p>
          <p className="text-gray-600">Responds within an hour</p>
          <h4 className="text-md font-semibold mt-4">Contact</h4>
          <p className="text-gray-600">{`${email||""}`}</p>
        </div>
      </div>
    </div>
  );
}
