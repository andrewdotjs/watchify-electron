import { Button, Divider } from "@mui/material";
import React from "react";
import "../styles/views/SettingsView.css";

export default function SettingsView({ setAlert }) {
  const [settings, setSettings ] = React.useState(JSON.parse(window.localStorage.getItem("appSettings")));

  const [serverAddress, setServerAddress] = React.useState(settings["server-address"]);
  const [serverLag, setServerLag] = React.useState(settings["server-lag"]);

  function writeSettings(settingsObject) {
    window.electron.ipcRenderer.send("request-write-settings", settingsObject);
  }

  return (
    <>
      <div className="settings-container">
        <div className="setting-container">
          <h3 className="setting-section">
            App: <span className="setting-name">Server Address</span>
          </h3>
          <p className="setting-description">
            The IP address, with port (if applicable), of the watchify server that the app will communicate to.
          </p>
          <input
            className="setting-input"
            value={serverAddress}
            onInput={event => setServerAddress(event.target.value)}
          />
        </div>
        <div className="setting-container">
          <h3 className="setting-section">
            Dev Tools: <span className="setting-name">Server Lag Emulation</span>
          </h3>
          <p className="setting-description">
            Simulates server lag within the app, which is nice for ensuring that loading animations are functioning correctly.
          </p>
          <input
            className="setting-input"
            value={serverLag}
            onInput={event => setServerLag(event.target.value)}
          />
        </div>
      </div>
      <Button
        sx={{
          marginTop: "20px",
          marginLeft: "20px"
        }}
        variant="contained"
        onClick={() => {
          const settings = {
            "server-address": serverAddress,
            "server-lag": serverLag
          }

          writeSettings(settings);
          setAlert({
            active: true,
            severity: "success",
            message: "Settings have been saved."
          });
        }}
      >
        Save Settings
      </Button>
    </>
  )
}
