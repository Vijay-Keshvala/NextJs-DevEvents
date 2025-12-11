// app/page.tsx
import { Suspense } from "react"; // Required for streaming
import ExploreBtn from "@/components/ExploreBtn";
import EventList from "@/components/EventList"; // Import the component we just made

const Home = () => {
  return (
    <section>
      {/* 1. These static elements load INSTANTLY */}
      <h1 className="text-center">
        The Hub For Every Dev <br /> Event You Can't Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        {/* 2. The data loads in the background. 
               The 'fallback' UI shows while fetching. */}
        <Suspense fallback={<p className="text-center">Loading events...</p>}>
          <EventList />
        </Suspense>
      </div>
    </section>
  );
};

export default Home;
