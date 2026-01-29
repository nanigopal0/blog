type HeaderHomePageProps = {
  category: string;
  onClick: () => void;
  isSelected: boolean;
};

export default function HeaderHomePage({ category, onClick, isSelected }: HeaderHomePageProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-block rounded-full px-5 py-2 text-sm font-medium capitalize transition-all duration-200
        ${
          isSelected 
            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        } 
       cursor-pointer border border-transparent ${!isSelected && "border-gray-200 dark:border-gray-700"}`}
    >
      {category}
    </button>
  );
}
