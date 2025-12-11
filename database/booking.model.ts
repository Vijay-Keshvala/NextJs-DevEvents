import { Schema, model, models, Document, Types, Model } from 'mongoose';
import Event from './event.model';

// 1. Clean Interface (The raw data shape)
export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Document Type (For use in your hooks and application code)
// This combines your data with Mongoose Document methods (save, _id, etc.)
export type BookingDocument = IBooking & Document;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

// 3. ASYNC/AWAIT Pre-save hook
BookingSchema.pre('save', async function () {
  // We cast 'this' to BookingDocument so we can access .isModified, .isNew, etc.
  const booking = this as unknown as BookingDocument;

  // Only validate eventId if it's new or modified
  if (booking.isModified('eventId') || booking.isNew) {
    let eventExists;
    
    try {
      eventExists = await Event.findById(booking.eventId).select('_id');
    } catch (err) {
      const validationError = new Error('Invalid events ID format or database error');
      validationError.name = 'ValidationError';
      throw validationError;
    }

    if (!eventExists) {
      const error = new Error(`Event with ID ${booking.eventId} does not exist`);
      error.name = 'ValidationError';
      throw error;
    }
  }
});

BookingSchema.index({ eventId: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true, name: 'uniq_event_email' });

// 4. Export Model
// FIX IS HERE: Use <IBooking> inside model<...>. 
// Mongoose automatically ensures the result is a Model of documents that have both IBooking properties AND Document methods.
const Booking = (models.Booking as Model<BookingDocument>) || model<IBooking>('Booking', BookingSchema);

export default Booking;