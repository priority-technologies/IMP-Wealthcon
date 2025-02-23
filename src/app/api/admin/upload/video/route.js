export const maxDuration = 60;

import { NextResponse } from "next/server";
import Videos from "../../../../../schemas/Videos";
import connectToDatabase from "../../../../../_database/mongodb";

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const {
      fileName,
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
    } = reqBody;

    if (
      !fileName ||
      !date ||
      !title ||
      !videoUrl ||
      !description ||
      !studentCategory ||
      !videoCategory
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const parsedDate = new Date(date);
    const currentTime = new Date();
    parsedDate.setHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());

    await connectToDatabase();
    // Save video details to MongoDB
    const newVideo = new Videos({
      title,
      description,
      thumbnail: thumbnailUrl,
      thumbnailFileName: thumbnailName,
      videoUrl: videoUrl,
      shorts,
      videoFileName: fileName,
      studentCategory: JSON.parse(studentCategory),
      videoCategory,
      videoDuration: duration,
      videoCreatedAt: parsedDate
    });

    const { _id } = await newVideo.save();

    return NextResponse.json({
      message: "Upload complete",
      insertId: _id,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
