import React from "react";
import { useDropzone } from "react-dropzone";

import "../styles/components/CoverDropzone.css";

import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

export default function CoverDropzone({ uploadFiles, setUploadFiles}) {
  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: {'image/*': [".png", ".jpg", ".jpeg", ".webp"]},
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setUploadFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file),
      })));
    }
  });

  return (
    <div className="cover-dropzone-container">
      <div className="upload-container">
        <div
          className="dropzone"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p>Drag 'n' drop the cover image here, or click to select files</p>
        </div>
        <div className="cover-preview-container">
          {
            uploadFiles[0]?.preview
            ?
            (
              <img
                src={uploadFiles[0].preview}
                className="cover-preview"
                loading="lazy"
                alt="Cover preview"
              />
            )
            :
            <></>
          }
        </div>
      </div>
      <IconButton
        onClick={() => setUploadFiles([])}
        variant="filled"
        color="error"
        size="small"
        sx={{
          position: "absolute",
          top: "5px",
          right: "5px",
        }}
      >
        <Delete />
      </IconButton>
    </div>
  );
}