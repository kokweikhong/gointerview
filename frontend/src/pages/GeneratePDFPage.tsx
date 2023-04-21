import React, { useState } from "react";
import {
  SelectFileDialog, ReadDataFromExcel,
  GetExcelSheets, SelectDirectory,
  GenerateInterviewReportPDF, MessageDialog
} from "../../wailsjs/go/main/App"
import { ICandidateProps } from "../types/candidate";
import { IGeneratePDFProps } from "../types/generatePDF";

const GeneratePDFPage: React.FC = () => {
  const [data, setData] = useState<IGeneratePDFProps>({
    rawData: [],
    data: [],
    selected: [],
    excel: '',
    sheet: '',
    outputDir: '',
    supervisor: '',
    designation: '',
  })
  const [sheets, setSheets] = useState<string[]>([])
  const [dates, setDates] = useState<string[]>([])
  const [date, setDate] = useState<string>('')

  const handleSelectExcelFile = async () => {
    try {
      const res = await SelectFileDialog()
      setData(prev => ({ ...prev, excel: res }))
      const sh = await GetExcelSheets(res)
      setSheets(sh)
      await MessageDialog("info", "Get Excel Sheets", `Successfully get excel sheets from ${res}`)
    } catch (e) {
      await MessageDialog("error", "Get Excel Sheets", `${e}`)
    }
  }

  const handleReadDataFromExcel = async () => {
    try {
      const res = await ReadDataFromExcel(data.excel, data.sheet) as unknown as ICandidateProps[]
      setData(prev => ({ ...prev, rawData: res, data: res }))
      const uniDates = [...new Set(res.map(ele => ele.date))].reverse()
      setDates(uniDates)
      await MessageDialog("info", "Read Data From Excel", `Successfully read data from ${data.excel}`)
    } catch (e) {
      await MessageDialog("error", "Read Data From Excel", `${e}`)
    }
  }

  const handleSelectDirForReportPDF = async () => {
    const res = await SelectDirectory()
    setData(prev => ({ ...prev, outputDir: res }))
  }

  const handleFilterDataByDate = async () => {
    const filtered = data.rawData.filter(ele => (ele.date === date))
    setData(prev => ({ ...prev, data: filtered }))
  }

  const handleGeneratePDFReport = async () => {
    if (data.supervisor === "" || data.designation == "") {
      alert("Error")
      return
    }
    try {
      data.selected.forEach(async (ele) => {
        try {
          await GenerateInterviewReportPDF(ele, data.supervisor, data.designation, data.outputDir)
        } catch (e) {
          MessageDialog("error", "Export PDF Report", `${e}`)
        }
      })
      await MessageDialog("info", "Export PDF Report", `Successfully exported ${data.selected.length} PDF reports.`)
    } catch (e) {
      await MessageDialog("error", "Export PDF Report", `${e}`)
    }
  }

  const handleCheckboxChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const find = data.data.find(ele => String(ele.id) === event.target.value)
      if (find !== undefined) {
        setData(prev => ({ ...prev, selected: [...data.selected, find] }))
      }
    } else if (!event.target.checked) {
      setData(prev => ({
        ...prev, selected:
          data.selected.filter(ele => String(ele.id) !== event.target.value)
      }))
    }
  }

  const handleSelectAll = () => {
    const options = document.querySelectorAll<HTMLInputElement>(".name-option")
    options.forEach(o => o.checked = true)
    // setSelected(data)
    setData(prev => ({ ...prev, selected: data.data }))
  }

  const handleResetAll = () => {
    const options = document.querySelectorAll<HTMLInputElement>(".name-option")
    options.forEach(o => o.checked = false)
    setData(prev => ({ ...prev, selected: [], data: data.rawData }))
  }



  return (
    <div className="px-8">

      {/* all the input fields */}
      <div className="flex flex-col gap-2 p-6 border border-black border-dashed">
        {/* excel file input field to generate excel sheets */}
        <div className="flex gap-2 items-center">
          <label className="font-medium">Interview Excel File :</label>
          <input type="text" value={data.excel} disabled className="p-2 grow" />
          <button
            className="bg-purple-500 font-medium text-[#fff] rounded-xl px-4 py-2 uppercase"
            onClick={handleSelectExcelFile}>Browse</button>
        </div>


        {/* excel sheet input field and get data from excel button */}
        <div className="flex gap-2 items-center">
          <label className="font-medium">Excel Sheet :</label>
          <select
            value={data.sheet}
            onChange={(e) => setData(prev => ({ ...prev, sheet: e.target.value }))}
            className="p-2 grow" >
            <option value="">Select Sheet</option>
            {sheets?.map((sheet, index) => (
              <option value={sheet} key={index}>{sheet}</option>
            ))}
          </select>
          <button
            className="bg-purple-500 font-medium text-[#fff] rounded-xl px-4 py-2 uppercase"
            onClick={handleReadDataFromExcel}>Get Data</button>
        </div>


        {/* pdf output directory input field and export button */}
        <div className="flex gap-2 items-center">
          <label className="font-medium">Report PDF Output Directory :</label>
          <input type="text" value={data.outputDir} disabled className="p-2 grow" />
          <button
            className="bg-purple-500 font-medium text-[#fff] rounded-xl px-4 py-2 uppercase"
            onClick={handleSelectDirForReportPDF}>Browse</button>
        </div>


        {/* supervisor and designation input field */}
        <div className="grid grid-cols-[2fr_2fr_1fr] gap-2 items-center">
          <div className="flex gap-1 items-center">
            <label className="font-medium">Supervisor :</label>
            <input type="text" value={data.supervisor}
              onChange={(e) => setData(prev => ({ ...prev, supervisor: e.target.value }))}
              className="p-2 grow" />
          </div>
          <div className="flex gap-1 items-center">
            <label className="font-medium">Designation :</label>
            <input type="text"
              value={data.designation}
              onChange={(e) => setData(prev => ({ ...prev, designation: e.target.value }))}
              className="p-2 grow" />
          </div>
          <button
            className="bg-blue-500 font-medium text-[#fff] rounded-xl px-4 py-2 uppercase"
            onClick={handleGeneratePDFReport}>{`Export Data (${data.selected.length})`}</button>
        </div>
      </div>

      <div className="flex gap-2 items-center my-4 pb-2 border-b border-gray-600">
        <div className="flex gap-2 items-center font-medium mr-6">
          <label>Date :</label>
          <select
            className="grow p-2 w-[150px]"
            onChange={(e) => setDate(e.target.value)}>
            <option value="">Select Date</option>
            {dates?.map((date, index) => (
              <option value={date} key={index}>{date}</option>
            ))}
          </select>
          <button
            className="px-4 py-2 bg-violet-500 uppercase font-medium text-white rounded-xl"
            onClick={handleFilterDataByDate}>
            Filter
          </button>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 uppercase font-medium text-white rounded-xl"
          onClick={handleResetAll}>
          Reset
        </button>
        <button
          className="px-4 py-2 bg-blue-500 uppercase font-medium text-white rounded-xl"
          onClick={handleSelectAll}>
          Select All
        </button>
      </div>

      <div>
        <ul>
          {data?.data?.map((d, i) => (
            <li key={i} className="font-medium text-sm">
              <label className="flex gap-2 cursor-pointer">
                <input type="checkbox"
                  onChange={(e) => handleCheckboxChecked(e)}
                  className="name-option"
                  value={d.id}
                />
                {`${d.date} | ${d.name} | ${d.overall} | ${d.position} | ${d.decision}`}
              </label>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default GeneratePDFPage;
