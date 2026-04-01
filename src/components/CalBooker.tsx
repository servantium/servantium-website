import { BookerEmbed } from "@calcom/atoms";

interface CalBookerProps {
  calLink?: string;
  username?: string;
  eventSlug?: string;
}

export default function CalBooker({
  calLink = "christopher-veale/servantium-introduction",
  username,
  eventSlug,
}: CalBookerProps) {
  // Parse calLink into username and eventSlug if not provided separately
  const parsedUsername = username || calLink.split("/")[0];
  const parsedEventSlug = eventSlug || calLink.split("/")[1];

  return (
    <div style={{ width: "100%", minHeight: "360px" }}>
      <BookerEmbed
        eventSlug={parsedEventSlug}
        username={parsedUsername}
        view="month_view"
        customClassNames={{
          bookerContainer: "border-subtle border",
        }}
        onCreateBookingSuccess={() => {
          console.log("Servantium demo booking created successfully");
        }}
      />
    </div>
  );
}
