export const maxDuration = 60;

import { s3 } from "../../../../../helpers/constant";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { fileName, partNumber, uploadId } = await request.json();

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      PartNumber: partNumber,
      UploadId: uploadId,
      Expires: 600,
    };

    const uploadUrl = await s3.getSignedUrlPromise('uploadPart', params);

    return NextResponse.json({ uploadUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// export async function POST(request) {
//   try {
//     const form = await request.formData();
//     const filename = form.get("filename");
//     const uploadId = form.get("uploadId");
//     const partNumber = form.get("partNumber");
//     const chunk = form.get("chunk");

//     const chunkBuffer = Buffer.from(await chunk.arrayBuffer());

//     const params = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: filename,
//       PartNumber: parseInt(partNumber, 10),
//       UploadId: uploadId,
//       Body: chunkBuffer,
//     };

//     const data = await s3.uploadPart(params).promise();

//     return NextResponse.json({ ETag: data.ETag });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
