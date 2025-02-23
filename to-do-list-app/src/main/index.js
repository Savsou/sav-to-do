import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
//Built-in Node.js module that allows us to interact with the file system on the computer.
//Used for read from, write to, and manipulate files and directories.
import fs from 'fs';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    //numbers are in px, electron uses px as default dimensions
    width: 400,
    height: 250,
    show: false,
    autoHideMenuBar: true,
    //Makes the window frameless
    frame: false,
    // Tried using the functions below but the maximize button would bug out and no actions further could be done
    // // Hides the default title bar on Mac
    // titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   //Customize the top bar color
    //   color: '#2f3241',
    //   //Customize button colors on Mac
    //   symbolColor: '#74b1be',
    //   //Height of Top Bar
    //   height: 30,
    // },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      //sandBox and contextIsolation provides more security if true
      sandbox: false,
      // contextIsolation: true,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.on('close-window', () => {
  const currentWindow = BrowserWindow.getFocusedWindow();
  if (currentWindow) {
    currentWindow.close()
  }
})

ipcMain.on('minimize-window', () => {
  const currentWindow = BrowserWindow.getFocusedWindow();
  if (currentWindow) {
    currentWindow.minimize()
  }
})

//Create functions that would be useful when the todo list is changed. For instance when adding, editing or removing
//from the todo list. Have the functions happen in a useEffect
//save todos function, to save into todos.json file in userData directory.
ipcMain.on('save-todos', (event, todos) => {
  try {
    //Get the userData path, which is specific to each platform
    const userDataPath = app.getPath('userData');

    //create a path for todos.json within userData
    const filePath = join(userDataPath, 'todos.json');
    //JSON.stringify(todos, null, 2).  Value (Object to create into a JSON string), Replacer (the properties you want to return to exclude properties), and
    // Space (indentation to make the JSON easier to read).
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
    event.reply('save-todos-success', true);
  } catch (error) {
    console.error('Error saving todos.json', error);
    event.reply('save-todos-error', false);
  }
})
//load todos function, to load from todos.json file.
ipcMain.handle('load-todos', async () => {
  try {
    const userDataPath = app.getPath('userData');
    const filePath = join(userDataPath, 'todos.json');
    // console.log(filePath)

    //new users won't have a todos.json created yet, so create if-else to have at least an array to load and save into
    if (fs.existsSync(filePath)) {
      //utf-8 is for text-encoding standard that makes the file's content readable as a string in JS
      const data = fs.readFileSync(filePath, 'utf-8')

      return JSON.parse(data);
    }

    return [];
  } catch (error) {
    console.error('Error loading todos.json', error)
    return [];
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  // ipcMain.on('ping', () => console.log('pong'))

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
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
