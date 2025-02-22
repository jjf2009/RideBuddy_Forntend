import { useFetchAllRequestsQuery } from "../../redux/features/request/requestsApi";
import { getAuth } from "firebase/auth";
import RideRequestCard from "./RideRequestCard";

const RequestPage = () => {
    const { data: rideRequests = [], isLoading, isError } = useFetchAllRequestsQuery(undefined, {
        pollingInterval: 1000, // Auto-fetch every 10 seconds
      });
    
    // Get the current user's ID
    const auth = getAuth();
    const currentUserId = auth.currentUser?.uid;

    // Filter requests where the current user is either the driver or the requester
    const filteredRequests = rideRequests.filter(
        (request) => request.userId === currentUserId || request.DriverId === currentUserId
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Ride Requests</h2>

            {isLoading && <p className="text-blue-500">Loading ride requests...</p>}
            {isError && <p className="text-red-500">Failed to load ride requests.</p>}

            {!isLoading && !isError && filteredRequests.length === 0 ? (
                <p className="text-gray-500">No ride requests available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredRequests.map((request) => (
                        <RideRequestCard key={request.id} request={request} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RequestPage;
