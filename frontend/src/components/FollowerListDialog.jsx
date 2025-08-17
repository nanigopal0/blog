import { useContext, useState } from "react";
import FollowerCard from "./FollowerCard";
import ColorPalette from "../util/ColorPalette";
import { ThemeContext } from "../contexts/ThemeContext";

export default function FollowerListDialog({ isOpen, onClose }) {
  const { darkMode } = useContext(ThemeContext);
  const palette = darkMode ? ColorPalette.darkMode : ColorPalette.lightMode;
  const [followers, setFollowers] = useState([
    {
      name: "John Doe",
      photo:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      id: 1,
    },
    {
      name: "Jane Smith",
      photo:
        "https://images.unsplash.com/photo-1702884163621-ded464345868?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      id: 2,
    },
    {
      name: "Alice Johnson",
      photo:
        "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      id: 3,
    },
    {
      name: "Bob Brown",
      photo:
        "https://images.unsplash.com/photo-1599972680486-1acb1358755a?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      id: 4,
    },
    {
      name: "Charlie White",
      photo:
        "https://images.unsplash.com/photo-1683009427479-c7e36bbb7bca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      id: 5,
    },
    {
      name: "John Doe",
      photo:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      id: 6,
    },
    {
      name: "Jane Smith",
      photo:
        "https://images.unsplash.com/photo-1702884163621-ded464345868?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      id: 7,
    },
    {
      name: "Alice Johnson",
      photo:
        "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      id: 8,
    },
    {
      name: "Bob Brown",
      photo:
        "https://images.unsplash.com/photo-1599972680486-1acb1358755a?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      id: 9,
    },
    {
      name: "Charlie White",
      photo:
        "https://images.unsplash.com/photo-1683009427479-c7e36bbb7bca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      id: 10,
    },
  ]);

  useEffect(() => {
    setFollowers([]);
  }, []);

  return (
    <div
      className="z-50 fixed inset-0 flex items-center justify-center bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="rounded-2xl overflow-auto border-gray-300 border-2 shadow-2xl w-11/12 h-2/3 max-w-md p-6 "
        style={{ backgroundColor: palette.background.body }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Followers</h2>
          <button
            className="text-gray-600 cursor-pointer hover:text-gray-800 text-2xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div>
          {followers.map((follower) => (
            <FollowerCard key={follower.id} follower={follower} />
          ))}
        </div>
      </div>
    </div>
  );
}
