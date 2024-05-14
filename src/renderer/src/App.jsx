import React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { HashRouter, Routes, Route } from 'react-router-dom';

import ShowView from './views/ShowView.jsx';
import SeriesView from './views/SeriesView.jsx';
import WatchView from './views/WatchView.jsx';
import UploadView from "./views/UploadView.jsx";
import SettingsView from "./views/SettingsView.jsx";

import NavigationBar from "./components/NavigationBar.jsx";
import { Snackbar, Alert, Slide } from "@mui/material";
import HomeView from "./views/HomeView.jsx";

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

export default function App() {
  const [alert, setAlert] = React.useState({
    active: false,
  });

  React.useMemo(() => {
    window.electron.ipcRenderer.send("request-read-settings");

    window.electron.ipcRenderer.on("recieve-read-settings", (event, settingsObject) => {
      window.localStorage.setItem("appSettings", JSON.stringify(settingsObject));
    });
  
    window.electron.ipcRenderer.on("recieve-write-settings", (event, settingsObject) => {
      window.localStorage.setItem("appSettings", JSON.stringify(settingsObject));
    });
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <HashRouter>
        <NavigationBar active={false} />
        <div className="main-content">
          <Routes>
            <Route path="/watch/:id" element={<WatchView setAlert={setAlert} settings />} lazy={true} />
            <Route path="/series/:id" element={<SeriesView setAlert={setAlert} />} lazy={true} />
            <Route path="/settings" element={<SettingsView setAlert={setAlert} />} lazy={true} />
            <Route path="/upload" element={<UploadView setAlert={setAlert} />} lazy={true} />
            <Route path="/shows" element={<ShowView setAlert={setAlert} />} lazy={true} />
            <Route path="/" element={<HomeView setAlert={setAlert} />} lazy={true} />
          </Routes>
        </div>
        <Snackbar
          autoHideDuration={5000}
          open={alert?.active ?? false}
          TransitionComponent={Slide}
          onClose={() => setAlert({
            active: false,
            severity: alert?.severity ?? "error",
            message: alert?.message ?? "?"
          })}
        >
          <Alert
            variant="filled"
            severity={alert?.severity ?? "error"}
          >
            {alert?.message ?? "error"}
          </Alert>
        </Snackbar>
      </HashRouter>
    </ThemeProvider>
  );
}