package backend

import (
	"fmt"
	"strconv"

	"github.com/xuri/excelize/v2"
)

type Candidate struct {
	Id            int     `json:"id"`
	Date          string  `json:"date"`
	Name          string  `json:"name"`
	Position      string  `json:"position"`
	Nationality   string  `json:"nationality"`
	Race          string  `json:"race"`
	Gender        string  `json:"gender"`
	Age           int     `json:"age"`
	Qualification string  `json:"qualification"`
	Remarks       string  `json:"remarks"`
	Decision      string  `json:"decision"`
	Comments      string  `json:"comments"`
	Overall       float64 `json:"overall"`
	Scores        *Score  `json:"scores"`
}

type Score struct {
	Education      int `json:"education"`
	Technical      int `json:"technical"`
	WorkExperience int `json:"workExperience"`
	Supervisory    int `json:"supervisory"`
	Teamwork       int `json:"teamwork"`
	Alertness      int `json:"alertness"`
	Maturity       int `json:"maturity"`
	Growth         int `json:"growth"`
}

func GetExcelSheets(excelpath string) ([]string, error) {
	f, err := excelize.OpenFile(excelpath)
	if err != nil {
		return nil, err
	}
	return f.GetSheetList(), nil
}

func ReadDataFromExcel(excelpath, sheet string) ([]*Candidate, error) {
	var cands []*Candidate
	f, err := excelize.OpenFile(excelpath)
	if err != nil {
		return nil, err
	}
	rows, err := f.GetRows(sheet)
	if err != nil {
		return nil, err
	}
	x, _ := f.GetComments(sheet)
	for _, i := range x {
		fmt.Println(i.Cell)
		for _, p := range i.Runs {
			fmt.Println(p.Text)
		}
	}
	for irow, row := range rows {
		if irow == 0 {
			continue
		}
		cand := &Candidate{}
		cand.Scores = &Score{}
		for k := range row {
			switch k {
			case 0:
				cand.Id, _ = strconv.Atoi(row[k])
			case 1:
				dateFloat, _ := strconv.ParseFloat(row[k], 64)
				dateFormat, _ := excelize.ExcelDateToTime(dateFloat, false)
				cand.Date = dateFormat.Format("02-01-2006")
			case 2:
				cand.Name = row[k]
			case 3:
				cand.Position = row[k]
			case 4:
				cand.Nationality = row[k]
			case 5:
				cand.Race = row[k]
			case 6:
				cand.Gender = row[k]
			case 7:
				cand.Age, _ = strconv.Atoi(row[k])
			case 8:
				cand.Qualification = row[k]
			case 9:
				cand.Remarks = row[k]
			case 10:
				cand.Decision = row[k]
			case 11:
				cand.Comments = row[k]
			case 14:
				cand.Overall, _ = strconv.ParseFloat(row[k], 64)
			case 15:
				cand.Scores.Education, _ = strconv.Atoi(row[k])
			case 16:
				cand.Scores.Technical, _ = strconv.Atoi(row[k])
			case 17:
				cand.Scores.WorkExperience, _ = strconv.Atoi(row[k])
			case 18:
				cand.Scores.Supervisory, _ = strconv.Atoi(row[k])
			case 19:
				cand.Scores.Teamwork, _ = strconv.Atoi(row[k])
			case 20:
				cand.Scores.Alertness, _ = strconv.Atoi(row[k])
			case 21:
				cand.Scores.Maturity, _ = strconv.Atoi(row[k])
			case 22:
				cand.Scores.Growth, _ = strconv.Atoi(row[k])
			}
		}
		cands = append(cands, cand)
	}
	return cands, nil
}
