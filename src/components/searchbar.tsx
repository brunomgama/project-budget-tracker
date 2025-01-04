/**
 * SearchBar Component
 * Provides an input field for searching through a list of items.
 *
 * Props:
 * - `searchQuery`: The current search query string.
 * - `onSearch`: A function to handle the search query updates.
 */
export default function SearchBar({ searchQuery, onSearch }: { searchQuery: string; onSearch: (query: string) => void }) {
    return (
        <div className="mb-4 w-1/3 text-xs">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
        </div>
    );
}
