import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { accessSync, readFileSync, writeFileSync } from 'fs'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1100,
    minWidth: 1100,
    height: 700,
    minHeight: 700,
    show: false,
    title: 'Watchify',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');
  const settingsPath = join(app.getAppPath(), "settings.json");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  });

  ipcMain.on("request-read-settings", (event) => {
    // START SETTINGS VALIDATION
    const settingsExists = checkSettingsExists(settingsPath);
    const requiredKeys = ["server-address", "server-lag"];
    
    if (!settingsExists) {
      createSettings(settingsPath, {
        "server-address": "127.0.0.1",
        "server-lag": 0
      });
    }

    const keysMatched = validateSettings(settingsPath, requiredKeys);

    if (!keysMatched) {
      throw Error("the settings within the file did not match the expected settings.")
    }

    // END SETTINGS VALIDATION

    const settings = readFileSync(join(app.getAppPath(), "settings.json"));
    const settingsObject = JSON.parse(settings);

    event.sender.send("recieve-read-settings", settingsObject);
  });

  // IPC test
  ipcMain.on("request-write-settings", (event, settingsObject) => {
    // END SETTINGS VALIDATION
    const settingsExists = checkSettingsExists(settingsPath);
    const requiredKeys = ["server-address", "server-lag"];
    
    if (!settingsExists) {
      createSettings(settingsPath, {
        "server-address": "127.0.0.1",
        "server-lag": 0
      });
    }

    const keysMatched = validateSettings(settingsPath, requiredKeys);

    if (!keysMatched) {
      throw Error("the settings within the file did not match the expected settings.")
    }

    // END SETTINGS VALIDATION

    writeFileSync(settingsPath, JSON.stringify(settingsObject, null, 2));

    event.sender.send("recieve-write-settings", settingsObject);
  });

  // START SETTINGS VALIDATION
  const settingsExists = checkSettingsExists(settingsPath);
  const requiredKeys = ["server-address", "server-lag"];
  
  if (!settingsExists) {
    createSettings(settingsPath, {
      "server-address": "127.0.0.1",
      "server-lag": 0
    });
  }

  const keysMatched = validateSettings(settingsPath, requiredKeys);

  if (!keysMatched) {
    throw Error("the settings within the file did not match the expected settings.")
  }

  // END SETTINGS VALIDATION

  createWindow();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  app.quit()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
function validateSettings(settingsPath, arrayOfRequiredKeys) {
  if (!(arrayOfRequiredKeys instanceof Array)) {
    throw Error("the passed in arrayOfRequiredKeys parameter was not an array");
  }

  if (typeof settingsPath !== "string") {
    throw Error("the passed in settingsPath parameter was not a string");
  }

  const REQUIRED_KEY_COUNT = arrayOfRequiredKeys.length;
  const SETTINGS = JSON.parse(readFileSync(settingsPath));
  let matchedKeyCount = 0;

  Object.keys(SETTINGS).forEach((settingsKey) => {
    arrayOfRequiredKeys.forEach((requiredKey) => {
      if (settingsKey === requiredKey) {
        matchedKeyCount += 1;
      }
    });
  });
  
  return (REQUIRED_KEY_COUNT !== matchedKeyCount ? false : true);
}

function createSettings(settingsPath, defaultSettings) {
  if (typeof settingsPath !== "string") {
    throw Error("the passed in settingsPath parameter was not a string");
  }

  if (typeof defaultSettings !== "object") {
    throw Error("the passed in defaultObjects parameter was not an object");
  }

  try {
    writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
  } catch {
    throw Error("could not create settings file")
  }

  return Object.keys(defaultSettings);
}

function checkSettingsExists(settingsPath) {
  if (typeof settingsPath !== "string") {
    throw Error("the passed in settingsPath parameter was not a string");
  }

  let exists;

  try {
    accessSync(settingsPath);
    exists = true;
  } catch {
    exists = false;
  }

  return exists;
}