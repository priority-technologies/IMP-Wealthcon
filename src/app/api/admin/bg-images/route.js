import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import BgImage from "@/schemas/BgImage";
import connectToDatabase from "@/_database/mongodb";

export async function DELETE(req) {
  await connectToDatabase();

  try {
    const { id } = await req.json();
    const image = await BgImage.findById(id);
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const fullPath = path.join(process.cwd(), "public", image.path);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await BgImage.findByIdAndDelete(id);
    return NextResponse.json({ message: "Image deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();

  try {
    const images = await BgImage.find().sort({ createdAt: -1 });
    return NextResponse.json(images);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}