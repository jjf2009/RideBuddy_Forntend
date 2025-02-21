import { useSelector } from "react-redux";
import RideRequestCard from "./RideRequestCard";

const RequestPage = () => {
    const rideRequests = useSelector(state => state.requests.rideRequests);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Ride Requests</h2>
            {rideRequests.length === 0 ? (
                <p className="text-gray-500">No ride requests available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {rideRequests.map((request) => (
                        <RideRequestCard key={request.id} request={request} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RequestPage;
