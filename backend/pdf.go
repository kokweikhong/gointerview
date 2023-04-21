package backend

import (
	"bytes"
	"embed"
	"fmt"
	"io"
	"log"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/phpdave11/gofpdi"
	"github.com/signintech/gopdf"
)

//go:embed interview_report.pdf
var interviewReport embed.FS

//go:embed STSong.TTF
var wts embed.FS

func GenerateInterviewReportPDF(data *Candidate, supervisor, supervisorDesignation, dir string) error {
	pdf := &gopdf.GoPdf{}
	pdf.Start(gopdf.Config{
		PageSize: gopdf.Rect{H: 841.89, W: 595.28},
	})

	pdf.AddPage()
	font, err := wts.ReadFile("STSong.TTF")
	if err != nil {
		log.Fatal(err)
	}
	if err = pdf.AddTTFFontData("STSong", font); err != nil {
		return err
	}
	pdf.SetFont("STSong", "", 10)

	b, err := interviewReport.ReadFile("interview_report.pdf")
	if err != nil {
		return err
	}

	tplSeeker := io.ReadSeeker(bytes.NewReader(b))

	tpl := pdf.ImportPageStream(&tplSeeker, 1, "/MediaBox")
	pdf.UseImportedTemplate(tpl, 0, 0, 595.28, 841.89)

	pdf.SetFontSize(10)
	pdf.SetXY(210, 110)
	pdf.Text(data.Name)

	pdf.SetXY(210, 128)
	pdf.Text(data.Position)

	pdf.SetXY(210, 143)
	pdf.Text(fmt.Sprintf("%s / %s", supervisor, supervisorDesignation))

	otherCommentsY := 155
	otherComments, _ := pdf.SplitTextWithWordWrap(data.Comments, 200)
	for _, o := range otherComments {
		pdf.SetXY(380, float64(otherCommentsY))
		pdf.Text(o)
		otherCommentsY += 8

	}

	mark := "√"
	pdf.SetFontSize(20)

	switch data.Scores.Education {
	case 0:
		pdf.SetXY(370, 210)
	case 1:
		pdf.SetXY(420, 210)
	case 2:
		pdf.SetXY(475, 210)
	case 3:
		pdf.SetXY(530, 210)
	}
	pdf.Text(mark)

	switch data.Scores.Technical {
	case 0:
		pdf.SetXY(370, 270)
	case 1:
		pdf.SetXY(420, 270)
	case 2:
		pdf.SetXY(475, 270)
	case 3:
		pdf.SetXY(530, 270)
	}
	pdf.Text(mark)

	switch data.Scores.WorkExperience {
	case 0:
		pdf.SetXY(370, 325)
	case 1:
		pdf.SetXY(420, 325)
	case 2:
		pdf.SetXY(475, 325)
	case 3:
		pdf.SetXY(530, 325)
	}
	pdf.Text(mark)

	switch data.Scores.Supervisory {
	case 0:
		pdf.SetXY(370, 380)
	case 1:
		pdf.SetXY(420, 380)
	case 2:
		pdf.SetXY(475, 380)
	case 3:
		pdf.SetXY(530, 380)
	}
	pdf.Text(mark)

	switch data.Scores.Teamwork {
	case 0:
		pdf.SetXY(370, 418)
	case 1:
		pdf.SetXY(420, 418)
	case 2:
		pdf.SetXY(475, 418)
	case 3:
		pdf.SetXY(530, 418)
	}
	pdf.Text(mark)

	switch data.Scores.Alertness {
	case 0:
		pdf.SetXY(370, 465)
	case 1:
		pdf.SetXY(420, 465)
	case 2:
		pdf.SetXY(475, 465)
	case 3:
		pdf.SetXY(530, 465)
	}
	pdf.Text(mark)

	switch data.Scores.Maturity {
	case 0:
		pdf.SetXY(370, 520)
	case 1:
		pdf.SetXY(420, 520)
	case 2:
		pdf.SetXY(475, 520)
	case 3:
		pdf.SetXY(530, 520)
	}
	pdf.Text(mark)

	switch data.Scores.Growth {
	case 0:
		pdf.SetXY(370, 570)
	case 1:
		pdf.SetXY(420, 570)
	case 2:
		pdf.SetXY(475, 570)
	case 3:
		pdf.SetXY(530, 570)
	}
	pdf.Text(mark)

	if data.Overall < 0.5 {
		pdf.SetXY(370, 625)
	} else if data.Overall >= 0.5 && data.Overall < 1 {
		pdf.SetXY(395, 625)
	} else if data.Overall >= 1 && data.Overall < 1.5 {
		pdf.SetXY(420, 625)
	} else if data.Overall >= 1.5 && data.Overall < 2 {
		pdf.SetXY(450, 625)
	} else if data.Overall >= 2 && data.Overall < 2.5 {
		pdf.SetXY(475, 625)
	} else if data.Overall >= 2.5 && data.Overall < 3 {
		pdf.SetXY(500, 625)
	} else if data.Overall >= 3 {
		pdf.SetXY(530, 625)
	}
	pdf.Text(mark)

	remarkY := 642
	pdf.SetFontSize(9)
	r, err := pdf.SplitTextWithWordWrap(data.Remarks, 400)
	if err != nil {
		return err
	}
	for _, re := range r {
		pdf.SetXY(150, float64(remarkY))
		pdf.Text(re)
		remarkY += 15
	}

	total := data.Scores.Growth + data.Scores.Maturity + data.Scores.Teamwork + data.Scores.Alertness +
		data.Scores.Education + data.Scores.Technical + data.Scores.Supervisory + data.Scores.WorkExperience
	pdf.SetXY(500, 587)
	pdf.Text(fmt.Sprintf("%v", total))

	pdf.SetFontSize(15)
	if strings.Contains(strings.ToLower(data.Decision), "hire") {
		pdf.SetXY(135, 690)
	} else if strings.Contains(strings.ToLower(data.Decision), "file for") {
		pdf.SetXY(205, 690)
	} else if strings.Contains(strings.ToLower(data.Decision), "regre") {
		pdf.SetXY(380, 690)
	}
	pdf.Text(mark)

	pdf.SetXY(420, 780)
	pdf.Text(data.Date)

	restricted := []string{"~", "\"", "#", "%", "&", "*", ":", "<", ">", "?", "/", "\\", "{", "|", "}", "."}
	editedName := data.Name
	for _, r := range restricted {
		editedName = strings.ReplaceAll(editedName, r, "")
	}
	alphabetRE := regexp.MustCompile(`[^a-zA-Z ]+`)
	editedName = alphabetRE.ReplaceAllString(editedName, "")

	dateCombine := strings.ReplaceAll(data.Date, "-", "")

	filename, err := filepath.Abs(
		filepath.Join(
			filepath.Clean(dir),
			fmt.Sprintf("%v-%v-%v.pdf", dateCombine, data.Decision, editedName),
		))
	if err != nil {
		return err
	}

	if err = pdf.WritePdf(filename); err != nil {
		return err
	}

	return nil
}

func MergeResumeAndReport(report, resume, outputDir string) error {
	pdf := gopdf.GoPdf{}

	pdf.Start(gopdf.Config{PageSize: gopdf.Rect{W: 595.28, H: 841.89}})

	pdfs := []string{report, resume}

	importer := gofpdi.NewImporter()

	for _, f := range pdfs {
		importer.SetSourceFile(f)

		totalPages := importer.GetNumPages()

		for i := 0; i < totalPages; i++ {
			pdf.AddPage()
			importedPage := pdf.ImportPage(f, i+1, "/MediaBox")
			pdf.UseImportedTemplate(importedPage, 0, 0, 595.28, 841.89)
		}
	}
	filename, err := filepath.Abs(
		filepath.Join(
			filepath.Clean(outputDir), filepath.Base(report),
		))
    if err != nil {
        return err
    }
	return pdf.WritePdf(filename)
}
