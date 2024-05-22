import { accessSync, writeFileSync, readFileSync } from "node:fs";

export default {
  read: function (settingsPath) {
    let matchedKeyCount = 0;
    const defaultSettings = {
      "server-address": "127.0.0.1:8080",
      "simulate-server-lag": false,
      "server-lag-simulation-time": 0,
    }

    let exists, validated;

    // Ensure that the settings path is a string.
  
    if (typeof settingsPath !== "string")  {
      throw Error(`the passed in settingsPath parameter was not a string, was given type ${typeof settingsPath}`);
    }

    // Check if settings file exists. If not exists, create new one with default settings.
    try {
      accessSync(settingsPath);
      exists = true;
    } catch {
      exists = false;
    }

    if (!exists) {
      try {
        writeFileSync(settingsPath, JSON.stringify(
          {
            "server-address": "127.0.0.1:8080",
            "simulate-server-lag": false,
            "server-lag-simulation-time": 0,
          },
          null,
          2
        ));
      } catch (error) {
        return {
          ok: false,
          detail: error,
        };
      }
    }

    // Validate the settings.
    const REQUIRED_KEY_COUNT = Object.keys(defaultSettings).length;
    const settings = JSON.parse(readFileSync(settingsPath));
  
    Object.keys(settings).forEach((settingsKey) => {
      Object.keys(defaultSettings).forEach((requiredKey) => {
        if (settingsKey === requiredKey) {
          matchedKeyCount += 1;
        }
      });
    });

    validated = (REQUIRED_KEY_COUNT !== matchedKeyCount ? false : true);

    if (!validated) {
      return {
        ok: false,
        detail: "The settings within the file did not match the expected settings.",
      };
    };

    return {
      ok: true,
      detail: "Settings successfully retrieved.",
      data: settings,
    };
  },
  write: function (settingsPath, newSettings) {
    let matchedKeyCount = 0;
    const defaultSettings = {
      "server-address": "127.0.0.1:8080",
      "simulate-server-lag": false,
      "server-lag-simulation-time": 0,
    }
    
    let exists, validated;

    if (typeof settingsPath !== "string") {
      throw Error(`the passed in settingsPath parameter was not a string, was given type ${typeof settingsPath}`);
    }

    if (typeof newSettings !== "object") {
      throw Error(`the passed in newSettings parameter was not an object, was given type ${typeof settingsPath}`);
    }

    // Test new settings against required settings to ensure app has settings that it needs.
    const REQUIRED_KEY_COUNT = Object.keys(defaultSettings).length;
  
    Object.keys(newSettings).forEach((settingsKey) => {
      Object.keys(defaultSettings).forEach((requiredKey) => {
        if (settingsKey === requiredKey) {
          matchedKeyCount += 1;
        }
      });
    });

    validated = (REQUIRED_KEY_COUNT !== matchedKeyCount ? false : true);

    if (!validated) {
      return {
        ok: false,
        detail: "Settings are missing from settings.json",
      };
    };

    try {
      writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2));
    } catch {
      return {
        ok: false,
        detail: "Unable to save settings to settings.json.",
      };
    }
    
    return {
      ok: true,
      detail: "Settings successfully saved.",
      data: newSettings,
    };
  }
}