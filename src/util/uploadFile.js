import axios from "axios";

export async function initiateUpload(filename, filetype, cancelToken) {
  try {
    const response = await axios.post(
      "/api/admin/upload/initiate",
      {
        fileName: filename,
        fileType: filetype,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: cancelToken.token,
      }
    );

    const { UploadId } = response.data;
    return UploadId;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error("Request canceled", error.message);
      throw new Error("cancel");
    }
    console.error("Error initiating upload", error);
    throw error;
  }
}

export async function uploadPart(
  file,
  filename,
  partNumber,
  uploadId,
  partSize,
  cancelToken
) {
  try {
    const start = (partNumber - 1) * partSize;
    const end = Math.min(file.size, start + partSize);
    const chunk = file.slice(start, end);

    const response = await axios.post(
      "/api/admin/upload/chunk",
      {
        fileName: filename,
        partNumber,
        uploadId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: cancelToken.token,
      }
    );

    const { uploadUrl } = response.data;

    if (!uploadUrl) throw new Error("Failed to get presigned URL");

    const uploadResponse = await axios.put(uploadUrl, chunk, {
      headers: {
        "Content-Type": file.type,
      },
      cancelToken: cancelToken.token,
    });

    if (uploadResponse.status !== 200) throw new Error("Failed to upload part");

    return {
      ETag: uploadResponse.headers["etag"],
      PartNumber: partNumber,
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error(`Upload part ${partNumber} canceled`);
      throw new Error("cancel");
    } else {
      console.error(`Error uploading part ${partNumber}`, error);
      throw error;
    }
  }
}

export async function completeUploadVideo(
  filename,
  uploadId,
  parts,
  cancelToken
) {
  try {
    const result = await axios.post(
      "/api/admin/upload/complete-video",
      {
        fileName: filename,
        uploadId,
        parts,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: cancelToken.token,
      }
    );
    return result.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error("Request canceled");
      throw new Error("cancel");
    } else {
      console.error("Error completing video upload", error);
      throw error;
    }
  }
}

export async function insertUploadVideoDB(
  filename,
  videoUrl,
  thumbnailName,
  thumbnailUrl,
  date,
  shorts,
  title,
  description,
  studentCategory,
  videoCategory,
  duration,
  cancelToken
) {
  try {
    const result = await axios.post(
      "/api/admin/upload/video",
      {
        fileName: filename,
        videoUrl,
        thumbnailName,
        thumbnailUrl,
        date,
        shorts,
        title,
        description,
        studentCategory,
        videoCategory,
        duration,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: cancelToken.token,
      }
    );
    return result.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error("Request canceled");
      throw new Error("cancel");
    } else {
      console.error("Error completing upload", error);
      throw error;
    }
  }
}

export async function uploadVideoThumbnail(
  thumbnail,
  filename,
  filetype,
  cancelToken
) {
  try {
    const response = await axios.post(
      "/api/admin/upload/signed-url",
      {
        fileName: filename,
        fileType: filetype,
      },
      {
        headers: { "Content-Type": "application/json" },
        cancelToken: cancelToken.token,
      }
    );

    const { uploadUrl } = response.data;

    if (!uploadUrl)
      throw new Error("Failed to get presigned URL for thumbnail");

    const uploadResponse = await axios.put(uploadUrl, thumbnail, {
      headers: { "Content-Type": filetype },
      cancelToken: cancelToken.token,
    });

    if (uploadResponse.status !== 200) {
      throw new Error("Failed to upload thumbnail");
    }

    return { thumbnailUrl: uploadUrl.split("?")[0] };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error("Thumbnail upload canceled");
      throw new Error("cancel");
    } else {
      console.error("Error uploading thumbnail", error);
      throw error;
    }
  }
}

export async function generateSignUrl(file, filename, cancelToken) {
  try {
    const { data } = await axios.post(
      "/api/admin/upload/signed-url",
      {
        fileName: filename,
        fileType: file.type,
      },
      {
        cancelToken: cancelToken.token, // Pass cancelToken directly
      }
    );

    const { uploadUrl } = data;

    // Upload the file using the presigned URL
    const uploadResponse = await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      cancelToken: cancelToken.token,
    });

    if (uploadResponse.status !== 200) throw new Error("Failed to upload part");
    return { url: uploadUrl.split("?")[0], name: filename };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error(`Upload canceled`);
      throw new Error("cancel");
    } else {
      console.error(`Error uploading `, error);
      throw error;
    }
  }
}

export async function completeUploadNotes(
  filename,
  notesUrl,
  thumbnailName,
  thumbnailUrl,
  date,
  title,
  description,
  studentCategory,
  pageCount,
  type,
  cancelToken
) {
  try {
    const result = await axios.post(
      "/api/admin/upload/notes",
      {
        filename,
        notesUrl,
        thumbnailName,
        thumbnailUrl,
        date,
        title,
        description,
        studentCategory,
        pageCount,
        type
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: cancelToken.token,
      }
    );

    return result.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.errror("Request canceled");
      throw new Error("cancel");
    } else {
      console.error("Error completing upload", error);
      throw error;
    }
  }
}

export async function completeUploadGallary(
  filename,
  url,
  date,
  title,
  description,
  studentCategory,
  cancelToken
) {
  try {
    await axios.post(
      "/api/admin/upload/gallery",
      {
        filename,
        url,
        date,
        title,
        description,
        studentCategory,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: cancelToken.token,
      }
    );
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error("Request canceled");
      throw new Error("cancel");
    } else {
      console.error("Error completing upload", error);
      throw error;
    }
  }
}
