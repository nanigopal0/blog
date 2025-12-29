export default function HeaderFilter({
  onChangeSortBy,
  sortByValue,
  sortByItems,
  onChangeSortOrder,
  sortOrderValue,
}) {
  return (
    <div className="flex flex-wrap justify-center gap-4 items-center text-gray-700 dark:text-gray-300">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Sort by</label>
        <select
          onChange={onChangeSortBy}
          value={sortByValue}
          className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
        >
          {sortByItems &&
            sortByItems.map((item, index) => (
              <option key={index} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Order</label>
        <select
          onChange={onChangeSortOrder}
          value={sortOrderValue}
          className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>
    </div>
  );
}
