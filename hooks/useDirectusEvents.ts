import { useQuery } from "@tanstack/react-query";

const mockDirectusEvents: Array<DirectusEvent> = [
  {
    id: 1,
    owned_by: 2,
    created_by: 2,
    updated_by: 3,
    status: "active",
    name: "Menu Launch",
    description: "Join us for the grand unveiling of our new seasonal menu featuring chef-curated dishes, special tastings, and exclusive offers for our first guests.",
    event_start_time: "1:00 PM",
    event_end_time: "3:00 PM",
    start_date: "2025-11-18T13:00:00Z",
    end_date: "2025-11-18T15:00:00Z",
    created_at: "2025-11-01T09:00:00Z",
    updated_at: "2025-11-01T09:05:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    owned_by: 4,
    created_by: 4,
    updated_by: 4,
    status: "planned",
    name: "Kitchen Upgrade",
    description: "We are upgrading our kitchen facilities to serve you better. Expect improved service flow and an expanded menu starting this July.",
    event_start_time: "8:00 AM",
    event_end_time: "6:00 PM",
    start_date: "2025-12-01T08:00:00Z",
    end_date: "2025-12-01T18:00:00Z",
    created_at: "2025-11-02T07:30:00Z",
    updated_at: "2025-11-02T07:35:00Z",
    deleted_at: null,
  },
  {
    id: 3,
    owned_by: 1,
    created_by: 1,
    updated_by: 2,
    status: "archived",
    name: "Holiday Closure",
    description: "Pivot Culinary will be closed for business on July 4th in observance of Independence Day. Normal operations resume July 5th.",
    event_start_time: "12:00 AM",
    event_end_time: "11:59 PM",
    start_date: "2025-12-04T00:00:00Z",
    end_date: "2025-12-04T23:59:59Z",
    created_at: "2025-11-03T14:10:00Z",
    updated_at: "2025-11-03T14:15:00Z",
    deleted_at: null,
  },
  {
    id: 4,
    owned_by: 5,
    created_by: 5,
    updated_by: 5,
    status: "active",
    name: "Staff Training",
    description: "Mandatory staff training will take place on June 30th, focusing on new safety protocols and customer service enhancements. Attendance is required for all team members.",
    event_start_time: "10:00 AM",
    event_end_time: "2:00 PM",
    start_date: "2025-11-30T10:00:00Z",
    end_date: "2025-11-30T14:00:00Z",
    created_at: "2025-11-04T11:00:00Z",
    updated_at: "2025-11-04T11:10:00Z",
    deleted_at: null,
  },
  {
    id: 5,
    owned_by: 3,
    created_by: 3,
    updated_by: 3,
    status: "cancelled",
    name: "Wine Tasting Night",
    description: "Unfortunately, our Wine Tasting Night scheduled for June 21st has been cancelled due to unforeseen circumstances. We apologize for any inconvenience.",
    event_start_time: "6:00 PM",
    event_end_time: "9:00 PM",
    start_date: "2025-11-21T18:00:00Z",
    end_date: "2025-11-21T21:00:00Z",
    created_at: "2025-11-05T16:00:00Z",
    updated_at: "2025-11-06T12:00:00Z",
    deleted_at: "2025-11-06T12:01:00Z",
  }
];

const useDirectusEvents = () => {
  const directusEventsQuery = useQuery({
    queryKey: ["directusEvents"],
    queryFn: getMockDirectusEvents,
    staleTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    gcTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
  });

  return directusEventsQuery;
};

export default useDirectusEvents;

// TODO: Replace with a requests module with the actual Directus API call.
const getMockDirectusEvents = async (): Promise<Array<DirectusEvent>> => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    return mockDirectusEvents;
};
