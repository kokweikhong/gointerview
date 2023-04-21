import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full">
      <ul className="px-4 w-full flex gap-6 uppercase font-medium justify-end items-center">
        <li>
          <Link to={"/"}>Report</Link>
        </li>
        <li>
          <Link to={"/merge"}>Merge PDF</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
