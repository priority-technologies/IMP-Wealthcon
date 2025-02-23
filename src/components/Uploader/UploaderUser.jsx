import { useState } from "react";
import Papa from "papaparse";
import { FileUploader } from "react-drag-drop-files";
import { roleObject } from "@/helpers/constant";
import "./uploader.scss";

const UploaderUser = ({ title, fileTypes, classes, onDataParsed }) => {
  const [fileData, setFileData] = useState([]);

  const handleChange = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const formattedData = result.data
          .map((row) => {
            // Ensure email is valid before proceeding
            if (!row["Email"]) {
              return null;
            }

            return {
              username: row["Full name"],
              email: row["Email"],
              password: row["Mobile number"], // This assumes mobile number is used as password (confirm if correct)
              mobile: row["Mobile number"],
              role: roleObject[(row["Role"] || "lot1").toLowerCase()],
              district: row["District"],
              state: row["State"],
            };
          })
          .filter((row) => row !== null); // Remove rows with invalid emails

        setFileData(formattedData);
        onDataParsed(formattedData);
      },
      error: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <div className={classes}>
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        classes={`custom-uploader ${classes}`}
      />
      <p>{title}</p>
    </div>
  );
};

export default UploaderUser;
