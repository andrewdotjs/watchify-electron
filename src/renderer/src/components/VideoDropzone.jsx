import React from "react";
import "../styles/components/VideoDropzone.css";

import { useDropzone } from "react-dropzone";

export default function VideoDropzone({ setUploadVideos, mode }) {
  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    maxFiles: (mode === 'show' ? 0 : 1),
    accept: {
      "video/*": [".mp4"]
    },
    onDrop: acceptedFiles => {
      const videos = acceptedFiles.map(file => Object.assign(file));
      setUploadVideos(videos);
    }
  });

  return (
        <div
          className="dropzone"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p>{`Drag 'n' drop the video file(s) here, or click to select the video file(s)`}</p>
        </div>
  );
}