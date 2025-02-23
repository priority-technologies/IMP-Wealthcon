export const maxDuration = 60;

import { NextResponse } from "next/server";
import { s3 } from "../../../../../helpers/constant";

export async function POST(request) {
  try {
    const { fileName, uploadId, parts } = await request.json();

    if (!fileName || !uploadId || !parts.length) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map((part) => ({
          ETag: part.ETag,
          PartNumber: part.PartNumber,
        })),
      },
    };

    const { Location } = await s3.completeMultipartUpload(params).promise();

    return NextResponse.json({
      url: Location,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
