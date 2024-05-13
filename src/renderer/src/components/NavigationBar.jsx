import "../styles/components/NavigationBar.css";

import React from "react";

import { Link } from "react-router-dom";

import { IconButton, Stack, List, ListItem, ListItemButton, colors } from "@mui/material";
import { Search, Home, Movie, Tv, Upload, Settings, BugReport, TrackChanges } from "@mui/icons-material";

export default function NavigationBar() {
  const [series, setSeries] = React.useState([]);
  const [activePage, setActivePage] = React.useState("home");

  React.useMemo(() => {
    fetch("http://127.0.0.1/api/v1/series", {
      method: "GET"
    })
    .then(response => response.json())
    .then(seriesData => setSeries(seriesData.data));
  }, []);

  return (
    <div className="navigation-bar">
      <div className="content-group">
        <h3 className="navigation-icon" to={"/"}>
          WATCHIFY_LOGO
        </h3>
        <h3 className="navigation-header">Menu</h3>
        <Link
          className={"navigation-button" + (activePage === "home" ? " navigation-button-active" : "")}
          to={"/"}
          onClick={() => setActivePage("home")}
        >
          <Home sx={{width: "20px"}}/>
          Home
        </Link>
        <Link
          className={"navigation-button" + (activePage === "shows" ? " navigation-button-active" : "")}
          to={"/shows"}
          onClick={() => setActivePage("shows")}
        >
          <Tv sx={{width: "20px"}}/>
          Shows
        </Link>
        <Link
          className={"navigation-button" + (activePage === "movies" ? " navigation-button-active" : "")}
          to={"/movies"}
          onClick={() => setActivePage("movies")}
        >
          <Movie sx={{width: "20px"}}/>
          Movies
        </Link>
        <Link
          className={"navigation-button" + (activePage === "upload" ? " navigation-button-active" : "")}
          to={"/upload"}
          onClick={() => setActivePage("upload")}
        >
          <Upload sx={{width: "20px"}}/>
          Upload
        </Link>
        <Link
          className={"navigation-button" + (activePage === "settings" ? " navigation-button-active" : "")}
          to={"/upload"}
          onClick={() => setActivePage("settings")}
        >
          <Settings sx={{width: "20px"}}/>
          Settings
        </Link>
        <h3 className="navigation-header">Misc</h3>
        <Link
          className={"navigation-button" + (activePage === "changelogs" ? " navigation-button-active" : "")}
          to={"/upload"}
          onClick={() => setActivePage("changelogs")}
        >
          <TrackChanges sx={{width: "20px"}}/>
          Changelogs
        </Link>
        <Link
          className={"navigation-button" + (activePage === "bugreport" ? " navigation-button-active" : "")}
          onClick={() => console.log("send user to github")}
        >
          <BugReport sx={{width: "20px"}}/>
          Report Bug
        </Link>
        <h3 className="navigation-app-version">Watchify v1.0</h3>
      </div>
    </div>
  );
}