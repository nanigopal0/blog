export default function HeaderFilter({
  onChangeSortBy,
  sortByValue,
  sortByItems,
  onChangeSortOrder,
  sortOrderValue,
}) {
  return (
    <div
      className=" border border-black/20 dark:border-white/20 p-2 rounded-lg dark:bg-gray-800
     bg-gray-100 flex justify-between gap-6 items-center text-gray-800 dark:text-gray-300"
    >
      <div>
        <label className="me-2 text-sm">Sort by</label>
        <select
          onChange={onChangeSortBy}
          value={sortByValue}
          className=" border border-black/50 dark:border-white/40 p-1 rounded-full text-sm bg-gray-200 dark:bg-gray-800 "
        >
          {sortByItems &&
            sortByItems.map((item, index) => (
              <option key={index} value={item}>
                {item.toLocaleUpperCase()}
              </option>
            ))}
        </select>
      </div>

      <div className="text-right">
        <label className="me-2 text-sm">Sort order</label>
        <select
          onChange={onChangeSortOrder}
          value={sortOrderValue}
          className="border p-1 border-black/50 dark:border-white/40 rounded-full text-sm bg-gray-200 dark:bg-gray-800 "
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
