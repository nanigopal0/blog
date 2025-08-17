export default function FollowerCard({ follower }) {
  return (
    <div className="flex items-center gap-2 py-2 px-4 hover:bg-gray-300 hover:text-gray-600 rounded-sm">
      <img
        src={`${follower.photo}`}
        alt="photo"
        className="rounded-full w-14 object-cover h-14"
      />
      <h3>{follower.name}</h3>
    </div>
  );
}
