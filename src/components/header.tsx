import {TbUserCircle} from "react-icons/tb";

export default function Header() {
    return (
        <header className="w-full h-16 bg-secondary flex items-center justify-end px-6"
            style={{backgroundColor: "var(--color-dark)"}}>
            <TbUserCircle size={32} />
        </header>
    )
}