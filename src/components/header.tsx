/**
 * `Header` component:
 * A simple header that displays a user avatar with initials.
 * - Full-width container (`w-full`) with padding and height set.
 * - Flexbox layout used to center the avatar and align it to the right.
 */
export default function Header() {
    return (
        <header className="w-full h-16 flex items-center justify-end px-6">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-300 text-white">
                <span className="text-md font-bold">BG</span>
            </div>
        </header>
    );
}
