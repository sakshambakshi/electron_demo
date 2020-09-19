const electron = require("electron")
const url = require("url")
const path = require("path")
process.env.NODE_ENV = "Production"

const { NODE_ENV } = process.env
const { platform } = process

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow

app.on("ready", (evt) => {
    //create New window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    //Load Html files into the window keep it simple this init process
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'html/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    mainWindow.on("closed", app.quit)
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    //Noe its time to /replace it
    Menu.setApplicationMenu(mainMenu)
})

//Catch add item
ipcMain.on("item:add", function (evt, item) {
    mainWindow.webContents.send("item:add", item)
    console.log(item)
    addWindow.close()
})

function createAddWindow() {
    // CREATE NEW WINDOW TO ADD WINDOW
    addWindow = new BrowserWindow({
        width: 300,
        heigh: 100,
        title: "Add Shoping List Item",
        webPreferences: {
            nodeIntegration: true
        }
    })
    addWindow.on("closed", () => { addWindow = null; console.log(addWindow) })
    //Load Html files into the window keep it simple this init process
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'html/addWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
}

//  Lets Create Menu template

const mainMenuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Add Item",
                accelerator: platform == "darwin" ? "Command+N" : "Ctrl+N",
                click() {
                    createAddWindow();
                }
            },
            {
                label: "Clear Items", 
                click() {
                    mainWindow.webContents.send("clear:items")
                }
            },
            {
                label: "Quit",
                accelerator: platform == "darwin" ? "Command+Q" : "Ctrl+Q",
                click() {
                    app.quit()
                }
            }
        ]
    }
];

if (platform == "darwin") {
    //On mac add empty object to see task menu 
    mainMenuTemplate.unshift({})
}

if (NODE_ENV != "Production") {
    console.log(NODE_ENV)
    mainMenuTemplate.push({
        label: "Developer Tools",
        submenu: [
            {
                label: "Toggle DevTools",
                accelerator: platform == "darwin" ? "Command+I" : "Ctrl+I",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: "reload"
            }
        ]
    })
}