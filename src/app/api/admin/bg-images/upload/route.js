import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import BgImage from "@/schemas/BgImage";
import connectToDatabase from "@/_database/mongodb";

export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { base64Image, filename } = body;

    if (!base64Image || !filename) {
      return NextResponse.json({ error: "Missing image or filename" }, { status: 400 });
    }

    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: "Invalid base64 format" }, { status: 400 });
    }

    const buffer = Buffer.from(matches[2], "base64");
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imagePath = path.join(uploadDir, filename);
    fs.writeFileSync(imagePath, buffer);

    const newImage = new BgImage({
      filename,
      path: `/uploads/${filename}`,
    });

    await newImage.save();

    return NextResponse.json({ message: "Image uploaded", path: newImage.path });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
