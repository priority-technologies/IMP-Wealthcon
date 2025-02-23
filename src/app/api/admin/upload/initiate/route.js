export const maxDuration = 60;

import { s3 } from "../../../../../helpers/constant";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { fileName, fileType } = await request.json();

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    };

    const { UploadId } = await s3.createMultipartUpload(params).promise();

    return NextResponse.json({ UploadId });
  } catch (error) {
    console.error("Error during upload:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
