import {
  SelectFileDialog, GetExcelSheets,
  ReadDataFromExcel, SelectDirectory,
  MessageDialog, MergeReportAndResumePDF
} from "../../wailsjs/go/main/App";
import { useState } from "react"
import { ICandidateWithPathProps, IMergePDFProps } from "../types/generatePDF";

const MergePDFPage = () => {
  const [props, setProps] = useState<IMergePDFProps>({
    rawData: [],
    data: [],
    selected: [],
    excel: '',
    sheet: '',
    outputDir: '',
  })
  const [sheets, setSheets] = useState<string[]>([])
  const [dates, setDates] = useState<string[]>([])
  const [date, setDate] = useState<string>('')

  const handleSelectExcel = async () => {
    try {
      const res = await SelectFileDialog()
      const sh = await GetExcelSheets(res)
      setProps(prev => ({ ...prev, excel: res }))
      setSheets(sh)
      await MessageDialog("info", "Get sheets from excel file", `Successfully get sheets from ${res}`)
    } catch (e) {
      await MessageDialog("error", "Get sheets from excel file", `${e}`)
    }
  }

  const handleReadDataFromExcel = async () => {
    try {
      const res = await ReadDataFromExcel(props.excel, props.sheet) as unknown as ICandidateWithPathProps[]
      setProps(prev => ({ ...prev, rawData: res }))
      const uniDates = [...new Set(res.map(e => e.date))].reverse()
      setDates(uniDates)
      await MessageDialog("info", "Read data from excel", `Successfully read data from ${props.excel}`)
    } catch (e) {
      await MessageDialog("error", "Read data from excel", `${e}`)
    }
  }

  const handleSelectDirForReportPDF = async () => {
    const res = await SelectDirectory()
    setProps(prev => ({ ...prev, outputDir: res }))
  }

  const handleCheckboxChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const find = props.data.find(ele => String(ele.id) === event.target.value)
      console.log(find)
      if (find !== undefined) {
        setProps(prev => ({ ...prev, selected: [...props.selected, find] }))
      }
    } else if (!event.target.checked) {
      setProps(prev => ({
        ...prev, selected:
          props.selected.filter(ele => String(ele.id) !== event.target.value)
      }))
    }
  }

  const handleFilterDataByDate = () => {
    if (date === '') return
    const filtered = props.rawData.filter(e => (
      e.date === date
    ))
    setProps(prev => ({ ...prev, data: filtered }))
  }

  const handleSelectAll = () => {
    const options = document.querySelectorAll<HTMLInputElement>(".name-option")
    options.forEach(o => {
      if (!o.disabled) {
        o.checked = true
      }
    })
    // setSelected(data)
    setProps(prev => ({
      ...prev, selected: props.data.filter(
        e => (e.resume !== undefined && e.report !== undefined))
    }))
  }

  const handleResetAll = () => {
    const options = document.querySelectorAll<HTMLInputElement>(".name-option")
    options.forEach(o => o.checked = false)
    setProps(prev => ({ ...prev, selected: [] }))
  }

  const handleMergePDF = async () => {
    try {
      props.selected.forEach(async (e) => {
        try {
          if (e.report !== undefined && e.resume !== undefined) {
            if (e.report.toLowerCase().endsWith('pdf') && e.resume.toLowerCase().endsWith('pdf')) {
              await MergeReportAndResumePDF(e.report, e.resume, props.outputDir)
            }
          }
        } catch (e) {
          await MessageDialog("error", "Merge PDF", `${e}`)
        }
      })
      await MessageDialog("info", "Merge PDF", "Merged All PDFs")

    } catch (e) {
      await MessageDialog("error", "Merge PDF", `${e}`)
    }
  }

  return (
    <div>

      <div className="flex flex-col gap-2 p-4">
        {/* excel file input field to generate excel sheets */}
        <div className="flex gap-2 items-center">
          <label className="font-medium">Interview Excel File :</label>
          <input type="text" value={props.excel} disabled className="p-2 grow" />
          <button
            className="bg-purple-500 font-medium text-[#fff] rounded-xl px-4 py-2 uppercase"
            onClick={handleSelectExcel}>Browse</button>
        </div>

        {/* excel sheet input field and get data from excel button */}
        <div className="flex gap-2 items-center">
          <label className="font-medium">Excel Sheet :</label>
          <select
            value={props.sheet}
            onChange={(e) => setProps(prev => ({ ...prev, sheet: e.target.value }))}
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
          <label className="font-medium">Merged PDF Output Directory :</label>
          <input type="text" value={props.outputDir} disabled className="p-2 grow" />
          <button
            className="bg-purple-500 font-medium text-[#fff] rounded-xl px-4 py-2 uppercase"
            onClick={handleSelectDirForReportPDF}>Browse</button>
        </div>
      </div>

      <hr />

      <div className="p-4 flex gap-6">
        <div className="flex gap-2 font-medium items-center">
          <label>Date :</label>
          <select className="w-[150px] p-2" value={date} onChange={(e) => setDate(e.target.value)}>
            <option value="">Select A Date</option>
            {dates?.map((date, index) => (
              <option value={date} key={index}>{date}</option>
            ))}
          </select>
          <button
            onClick={handleFilterDataByDate}
            className="bg-blue-500 uppercase rounded-xl text-white py-2 px-4">Filter</button>
        </div>
        <div className="flex gap-2 font-medium">
          <button
            onClick={handleResetAll}
            className="bg-orange-500 uppercase rounded-xl text-white py-2 px-4">Reset</button>
          <button
            onClick={handleSelectAll}
            className="bg-orange-500 uppercase rounded-xl text-white py-2 px-4">Select All</button>
        </div>
        <div className="flex gap-2 font-medium">
          <button
            onClick={handleMergePDF}
            className="bg-purple-500 uppercase rounded-xl text-white py-2 px-4">{`Merge PDFs (${props.selected.length})`}</button>
        </div>

      </div>

      <hr />


      <div className="px-4 flex flex-col gap-2 my-4">
        {props.data.map((d, i) => (
          <div key={i} className="flex gap-4 items-center">
            <label className="text-sm font-medium flex gap-2">
              <input
                type="checkbox"
                className="name-option"
                value={d.id}
                onChange={(e) => handleCheckboxChecked(e)}
                disabled={d.report !== undefined && d.resume !== undefined &&
                  d.report.toLowerCase().endsWith('pdf') && d.resume.toLowerCase().endsWith('pdf')
                  ? false : true}
              />
              <span>{d.name}</span>
            </label>
            <div className="flex gap-1 text-xs items-center">
              <button
                onClick={async () => {
                  const res = await SelectFileDialog()
                  console.log(res.toLowerCase().endsWith('pdf'))
                  if (!res.toLowerCase().endsWith('pdf')) {
                    d.report = undefined
                    return
                  }
                  d.report = res
                  setProps(prev => ({
                    ...prev, data: prev.data.map(ele => (
                      ele.id === d.id ? d : ele
                    ))
                  }))
                }}
                className={`${d.report !== undefined && d.report.toLowerCase().endsWith('pdf') ? 'bg-blue-700' : 'bg-red-700'} uppercase text-white rounded-xl px-4 py-2`}
              >
                Report
              </button>
              <button
                onClick={async () => {
                  const res = await SelectFileDialog()
                  if (!res.toLowerCase().endsWith('pdf')) {
                    d.resume = undefined
                    return
                  }
                  d.resume = res
                  setProps(prev => ({
                    ...prev, data: prev.data.map(ele => (
                      ele.id === d.id ? d : ele
                    ))
                  }))
                }}
                className={`${d.resume !== undefined && d.resume.toLowerCase().endsWith('pdf') ? 'bg-blue-700' : 'bg-red-700'} uppercase text-white rounded-xl px-4 py-2`}
              >
                Resume
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default MergePDFPage;
