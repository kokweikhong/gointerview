import { Link } from "react-router-dom";
import {
  SelectDirectory, ExportInterviewExcelTemplate,
  MessageDialog
} from "../../wailsjs/go/main/App";

const Navbar = () => {

  const handleGenerateInterviewTemplate = async () => {
    try {
      const dir = await SelectDirectory()
      await ExportInterviewExcelTemplate(dir)
      await MessageDialog("info", "Export Interview Template", `Successfully exported template to ${dir}`)
    } catch (e) {
      await MessageDialog("error", "Export Interview Template", `${e}`)
    }
  }
  return (
    <nav className="w-full flex items-center justify-between px-4">
      <button
        className="bg-blue-500 font-medium text-white rounded-xl px-4 py-2 uppercase text-xs"
        onClick={handleGenerateInterviewTemplate}
      >
        Generate Interview Excel Template
      </button>
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
