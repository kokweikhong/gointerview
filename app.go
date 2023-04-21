package main

import (
	"changeme/backend"
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) SelectFileDialog() (string, error) {
	return runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{})
}

func (a *App) SelectDirectory() (string, error) {
	return runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{})
}

func (a *App) MessageDialog(messageType, title, message string) (string, error) {
	var msgType runtime.DialogType
	switch messageType {
	case "error":
		msgType = runtime.ErrorDialog
	default:
		msgType = runtime.InfoDialog
	}
	return runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Type:    msgType,
		Title:   title,
		Message: message,
	})
}

func (a *App) GetExcelSheets(excelpath string) ([]string, error) {
	return backend.GetExcelSheets(excelpath)
}

func (a *App) ReadDataFromExcel(excelpath, sheet string) ([]*backend.Candidate, error) {
	return backend.ReadDataFromExcel(excelpath, sheet)
}

func (a *App) GenerateInterviewReportPDF(data *backend.Candidate, supervisor, supervisorDesignation, dir string) error {
	return backend.GenerateInterviewReportPDF(data, supervisor, supervisorDesignation, dir)
}

func (a *App) MergeReportAndResumePDF(report, resume, outputDir string) error {
	return backend.MergeResumeAndReport(report, resume, outputDir)
}

func (a *App) ExportInterviewExcelTemplate(dir string) error {
	return backend.ExportInterviewExcelTemplate(dir)
}
