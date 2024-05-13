import React from "react";
import "../styles/components/VideoDropzone.css";

import { useDropzone } from "react-dropzone";

export default function VideoDropzone({ setUploadVideos }) {
  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: {
      "video/*": [".mp4"]
    },
    onDrop: acceptedFiles => {
      const videos = acceptedFiles.map(file => Object.assign(file));
      setUploadVideos(videos);
      console.log(videos);
    }
  });

  return (
        <div
          className="dropzone"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p>Drag 'n' drop the videos here, or click to select videos</p>
        </div>
  );
}