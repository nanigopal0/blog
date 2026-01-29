import type { BlogSortField } from "@/types/blog/BlogInfo";

const sortFieldLabels: Record<BlogSortField, string> = {
  title: "Title",
  createdAt: "Date Created"
};

type HeaderFilterProps = {
  onChangeSortBy: (by: BlogSortField) => void;
  sortByValue: BlogSortField;
  sortByItems: BlogSortField[];
  onChangeSortOrder: (order:string) => void;
  sortOrderValue: string;


}

export default function HeaderFilter({
  onChangeSortBy,
  sortByValue,
  sortByItems,
  onChangeSortOrder,
  sortOrderValue,
}: HeaderFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 items-center text-gray-700 dark:text-gray-300">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Sort by</label>
        <select
          onChange={e=>onChangeSortBy(e.target.value as BlogSortField)}
          value={sortByValue}
          className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
        >
          {sortByItems &&
            sortByItems.map((item, index) => (
              <option key={index} value={item}>{sortFieldLabels[item]}
              </option>
            ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Order</label>
        <select
          onChange={e=>onChangeSortOrder(e.target.value)}
          value={sortOrderValue}
          className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}
