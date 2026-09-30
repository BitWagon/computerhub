import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const Contact =
  mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);

// ============================================================
// POST /api/contact
// Save contact message
// ============================================================

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { name, email, subject, message } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required.",
        },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        { status: 400 }
      );
    }

    if (!subject?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject is required.",
        },
        { status: 400 }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Message is required.",
        },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully.",
        contact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message.",
      },
      { status: 500 }
    );
  }
}