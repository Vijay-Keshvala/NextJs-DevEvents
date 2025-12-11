"use server";

import Booking from "@/database/booking.model";
import connectDB from "@/lib/mongodb";

export const createBooking = async ({
  eventId,
  slug, // You can keep it as an argument if you need it for redirects/logging
  email,
}: {
  eventId: string;
  slug: string;
  email: string;
}) => {
  try {
    await connectDB();

    // FIX: Only pass the fields that actually exist in your Booking Schema
    await Booking.create({
      eventId,
      email,
    });

    return { success: true };
  } catch (e) {
    console.error("create booking failed", e);
    return { success: false };
  }
};
