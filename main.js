var config = require('./config');

//Create the mqtt client
var mqtt = require('mqtt')
var client = mqtt.connect(config.mqtt_server)

//Create a native browser window
const {app, BrowserWindow, Menu} = require('electron')
const isMac = process.platform === 'darwin'
const path = require('path')
Menu.setApplicationMenu(null)

function createWindow()
{
  const win = new BrowserWindow({
    title: config.app_name,
    width: config.initial_window_width,
    height: config.initial_window_height,
    nodeIntegration: true,
    fullscreenable: true,
    backgroundColor: config.main_background_color,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  win.loadFile('index.html')

  var menu = Menu.buildFromTemplate([
      ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
    }] : []),
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          id: 'pause-auto-loading',
          label : 'Pause auto loading',
          type: 'checkbox'
        }
      ]
    },
    { label: 'View',
    submenu: [
    {
      id: 'open-in-external-browser',
      enabled: false,
      label: 'Open in external browser',
      click: async () => {
          const { shell } = require('electron')
          browserWindow = BrowserWindow.getFocusedWindow()
          currentURL = browserWindow.webContents.getURL()
          if (currentURL.startsWith('http'))
            await shell.openExternal(currentURL)
        }
    }]
    }
])

Menu.setApplicationMenu(menu);

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
      
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

client.on("connect", function(){
  client.subscribe(config.mqtt_link_topic)
})

client.on("message", function(topic, message, packet){
  menuItemPauseAutoLoading = Menu.getApplicationMenu().getMenuItemById('pause-auto-loading')
  if (menuItemPauseAutoLoading.checked == false)
  {
    updateBrowserWindow = BrowserWindow.fromId(1)
    updateBrowserWindow.loadURL(message.toString())
    menuItemOpenInExternalBrowser = Menu.getApplicationMenu().getMenuItemById('open-in-external-browser')
    menuItemOpenInExternalBrowser.enabled = true;
  }
  

})