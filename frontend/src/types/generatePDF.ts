import { ICandidateProps } from "./candidate"

export interface IGeneratePDFProps {
  rawData: ICandidateProps[]
  data: ICandidateProps[]
  selected: ICandidateProps[]
  excel: string
  sheet: string
  outputDir: string
  supervisor: string
  designation: string
}


export interface IMergePDFProps {
  rawData: ICandidateWithPathProps[]
  data: ICandidateWithPathProps[]
  selected: ICandidateWithPathProps[]
  excel: string
  sheet: string
  outputDir: string
}

export interface ICandidateWithPathProps extends ICandidateProps {
  report?: string
  resume?: string
}
