import { useState } from "react";
import { useUpdateRequestStatusMutation } from "../../redux/features/request/requestsApi";
import { getAuth } from "firebase/auth";

const RideRequestCard = ({ request }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(request.status);

    const auth = getAuth();
    const currentUserId = auth.currentUser?.uid;
   


    const isDriver = request.DriverId === currentUserId; // Check if current user is the driver
    const isRequester = request.userId === currentUserId; // Check if current user made the request

    const requesterName = request.requesterName || "User"; // Ensure we get the requester's name
    const driverName = request.driverName || "Driver"; // Ensure we get the driver's name
    const profileImg = request.profileImg || "https://via.placeholder.com/50"; // Default profile image
    // console.log(isDriver )
    // console.log(isRequester)
    // console.log(profileImg)
    // console.log(auth.currentUser)

    const [updateRequestStatus] = useUpdateRequestStatusMutation();


    // Handle Accept/Reject
    const handleAction = async (newStatus) => {
        setLoading(true);
        try {
            await updateRequestStatus({
                requestId: request.id,
                status: newStatus,
            }).unwrap();
            setStatus(newStatus);
            
        } catch (error) {
            console.error("Error updating request:", error);
        } finally {
            setLoading(false);
        }
    };
    const isExpired = new Date(request.date) < new Date(); // Check if ride date is in the past

    return (
        <div className="border rounded-lg p-4 shadow-md bg-white flex items-center justify-between w-full max-w-3xl mx-auto my-3">
            <div className="flex items-center gap-4">
                {isDriver && (
                    <img src={profileImg} alt="Profile" className="w-12 h-12 rounded-full" />
                )}
                <div className="flex-1">
                    {isDriver ? (
                        <h2 className="text-lg font-semibold">Requester: {requesterName}</h2>
                    ) : (
                        <h2 className="text-lg font-semibold">Driver: {driverName}</h2>
                    )}
                    <p className="text-sm text-gray-500">{request.date} | {request.time}</p>
                    <p><strong>From:</strong> {request.startLocation}</p>
                    <p><strong>To:</strong> {request.endLocation}</p>
                    <p><strong>Price:</strong> ₹{request.price}</p>
                </div>
            </div>

            { isDriver ? (
                status === "pending" ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAction("accepted")}
                            className="btn btn-success"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Accept"}
                        </button>
                        <button
                            onClick={() => handleAction("rejected")}
                            className="btn btn-error"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Reject"}
                        </button>
                    </div>
                ) : status === "accepted" ? (
                    <a
                        href={`https://wa.me/${request.phoneNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        Contact Requester
                    </a>
                ) : (
                    <p className="text-red-500 font-medium">Request Rejected ❌</p>
                )
            ) : isRequester ? (
                status === "pending" ? (
                    <p className="text-yellow-500 font-medium">Request Pending ⏳</p>
                ) : status === "accepted" ? (
                    <a
                        href={`https://wa.me/${request.phoneNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        Contact Driver
                    </a>
                ) : (
                    <p className="text-red-500 font-medium">Request Rejected ❌</p>
                )
            ) : null}
        </div>
    );
};

export default RideRequestCard;

