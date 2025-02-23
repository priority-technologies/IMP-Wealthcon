import { s3 } from "../../../../../helpers/constant";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { fileName, fileType } = await req.json();

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
      Expires: 60,
    };

    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

    return NextResponse.json({ uploadUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
