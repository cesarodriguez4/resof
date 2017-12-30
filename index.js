'use strict';
const electron = require('electron');
const {ipcMain} = require('electron');
const XLSX = require('xlsx');
const open = require('open');

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1300,
		height: 700
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});

ipcMain.on('excel', (event, arg) => {
  saveToExcel(event, arg);
});

function saveToExcel(event, data) {
	const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, [], "Lista de Evaporadores");
    XLSX.writeFileAsync(`books/lista-evaporadores.xlsx`,workbook, {bookType:'xlsx', type:'array'},()=>open('books/lista-evaporadores.xlsx'));
}
