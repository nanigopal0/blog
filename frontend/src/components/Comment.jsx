import { User } from "lucide-react";
import FormatDate from "../util/FormatDate";

function Comment({ photo, name, time, text }) {
  return (
    <div className="flex mb-6 p-4 rounded-lg shadow-md bg-white/60 dark:bg-gray-800">
      <div className="mr-4 border rounded-full w-10 h-10 overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt={name}
          className="w-full h-full object-cover scale-125 object-top"
          />
        ) : (
          <User size={""} />
        )}
      </div>
      <div>
        <p style={{ fontWeight: "bold", margin: "0 0 4px 0" }}>{name}</p>
        <p style={{ color: "gray", margin: "0 0 8px 0", fontSize: "14px" }}>
          {FormatDate(time)}
        </p>
        <p style={{ margin: "0", fontSize: "14px" }}>{text}</p>
      </div>
    </div>
  );
}

export default Comment;
