const settingsAPI = {
  read: async function () {
    const REQUIRED_SETTINGS = ['server-address', 'simulate-server-lag', 'server-lag-simulation-time']
    const { data: settings } = await window.electron.ipcRenderer.invoke('api-read-settings')
    let matched = 0

    // Validate that new settings have required settings.
    Object.keys(settings).forEach((givenKey) => {
      for (const requiredKey of REQUIRED_SETTINGS) {
        if (givenKey === requiredKey) {
          matched++
        }
      }
    })

    if (matched !== REQUIRED_SETTINGS.length) {
      throw Error('Current settings did not contain all of the required settings.')
    }

    return settings
  },
  write: async function (newSettings) {
    const REQUIRED_SETTINGS = ['server-address', 'simulate-server-lag', 'server-lag-simulation-time']
    let matched = 0

    // Validate that new settings have required settings.
    Object.keys(newSettings).forEach((givenKey) => {
      for (const requiredKey of REQUIRED_SETTINGS) {
        if (givenKey === requiredKey) {
          matched++
        }
      }
    })

    if (matched !== REQUIRED_SETTINGS.length) {
      throw Error('New settings did not contain all of the required settings.')
    }

    console.log(newSettings)

    // Write new settings to file.
    const writeResult = await window.electron.ipcRenderer.invoke('api-write-settings', {
      'server-address': newSettings['server-address'],
      'simulate-server-lag': newSettings['simulate-server-lag'] === 'true' ? true : false,
      'server-lag-simulation-time': newSettings['server-lag-simulation-time'] < 0 ? 0 : parseInt(newSettings['server-lag-simulation-time'])
    })

    return writeResult
  }
}

export default settingsAPI
