export default function HeaderHomePage({ category, onClick, isSelected }) {
  return (
    <button
      onClick={onClick}
      className={`inline-block rounded-lg px-3 py-2 
        ${
          isSelected ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"
        } 
       hover:bg-gray-400 hover:dark:bg-gray-500 cursor-pointer`}
    >
      <p className="font-medium capitalize text-center">{category}</p>
    </button>
  );
}
