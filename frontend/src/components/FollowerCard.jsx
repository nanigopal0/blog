import { User } from "lucide-react";

export default function FollowerCard({ follower, onclick }) {
  return (
    <div
      onClick={onclick}
      className="w-full flex items-center cursor-pointer gap-4 py-2 px-4 hover:bg-gray-400 
      hover:dark:bg-gray-600 rounded-lg border border-black/20 dark:border-white/20 
                  bg-gray-300 dark:bg-gray-700"
    >
      <div className="overflow-hidden rounded-full w-12 h-12 flex-shrink-0 border">
        {follower.photo  ? (
          <img
            src={`${follower.photo}`}
            alt="photo"
            className="rounded-full object-cover scale-125 w-full h-full"
          />
        ) : (
          <User size={48} />
        )}
      </div>
      <h3>{follower.name}</h3>
    </div>
  );
}
