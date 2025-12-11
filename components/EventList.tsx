// components/EventList.tsx
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function EventList() {
  // This fetch happens independently inside this component
  const response = await fetch(`${BASE_URL}/api/events`, {
    cache: "no-store", // Ensures dynamic data
  });

  const { events } = await response.json();

  return (
    <ul className="events">
      {events && events.length > 0 ? (
        events.map((event: IEvent) => (
          <li className="list-none" key={event._id as unknown as string}>
            {" "}
            <EventCard {...event} />
          </li>
        ))
      ) : (
        <p>No events found</p>
      )}
    </ul>
  );
}
