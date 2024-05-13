import React from "react";
import "../styles/views/UploadView.css";

import { TextField, Button, List, ListItem, Divider } from "@mui/material";
import CoverDropzone from "../components/CoverDropzone.jsx";
import VideoDropzone from "../components/VideoDropzone.jsx";

export default function UploadView({ setAlert }) {
  const [videoFiles, setVideoFiles] = React.useState([]);
  const [coverFile, setCoverFile] = React.useState([]);
  const [showTitle, setShowTitle] = React.useState("");
  const [showDescription, setShowDescription] = React.useState("");

  function uploadShow(
    title,
    description,
    cover,
    videos
  ) {
    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("cover", cover[0]);

    for (let i = 0; i < videos.length; i++) {
      data.append("videos", videos[i]);
    }

    fetch("http://127.0.0.1/api/v1/series", {
      method: "POST",
      body: data,
      headers: {
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
        "Accept": "application/json",
      }
    })
    .then((response) => response.json())
    .then((info) => {
      let alert = {
        active: true,
      }

      if (info.status !== 201) {
        alert.message = `Could not create show. REASON: ${info.detail}`;
        alert.severity = "error";
      } else {
        alert.message = "Show successfully uploaded!";
        alert.severity = "success";
      }

      setAlert(alert);
    })
    .catch((error) => console.log(error));
  }

  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

  return (
    <div className="upload-view">
      <Divider
        sx={{
          marginBottom: "20px"
        }}
      >
        Details
      </Divider>
      <div className="upload-container">
        <div className="upload-details">
          <TextField
            label="Title"
            onInput={(e) => setShowTitle(e.target.value)}
          />
          <TextField
            label="Description"
            onInput={(e) => setShowDescription(e.target.value)}
            multiline={true}
            minRows={10}
            maxRows={10}
          />
        </div>
        <div className="upload-images">
          <CoverDropzone uploadFiles={coverFile} setUploadFiles={setCoverFile}/>
        </div>
      </div>
      <Divider
        sx={{
          marginTop: "20px",
          marginBottom: "20px"
        }}
      >
        Videos
      </Divider>
      <div className="upload-videos-container">
        <VideoDropzone setUploadVideos={setVideoFiles} />
        {
          videoFiles.length
          ?
            <List
              sx={{
                backgroundColor: "#000000",
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                borderRadius: "5px",
              }}
            >
              <ListItem 
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px"
                }}
              >
                <p className="upload-videos-title initial">Filename</p>
                <p className="upload-videos-title centered">Format</p>
                <p className="upload-videos-title end">Filesize</p>
              </ListItem>
              {
                videoFiles.map((videoFile) => (
                  <ListItem 
                    key={videoFile.name}
                    className="upload-videos-container"
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px"
                    }}
                  >
                    <p className="upload-videos-info initial">{videoFile.name}</p>
                    <p className="upload-videos-info centered">{videoFile.type}</p>
                    <p className="upload-videos-info end">{formatBytes(videoFile.size)}</p>
                  </ListItem>
                ))
              }
            </List>
          :
          <></>
        }

      </div>
      <Button
        variant="contained"
        onClick={() => uploadShow(showTitle, showDescription, coverFile, videoFiles)}
        sx={{
          marginTop: "20px",
        }}
      >
        Upload
      </Button>
    </div>
  );
}