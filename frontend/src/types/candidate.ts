export interface ICandidateProps {
  id: number
  date: string
  name: string
  position: string
  nationality: string
  race: string
  gender: string
  age: number
  qualification: string
  remarks: string
  decision: string
  overall: number
  comments: string
  Scores: IScoresProps
}

export interface IScoresProps {
  education: number
  technical: number
  workExperience: number
  supervisory: number
  teamwork: number
  alertness: number
  maturity: number
  growth: number
}
