import { useState } from "react";
import { useDispatch } from "react-redux";
import {useUpdateRequestStatusMutation } from "../../redux/features/request/requestsApi";

const RideRequestCard = ({ request }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(null); // Track loading state
    const [status, setStatus] = useState(request.status); // Track updated status

    const handleAction = async (newStatus) => {
        setLoading(newStatus); // Set loading state for button
        try {
            await dispatch(useUpdateRequestStatusMutation({ requestId: request.id, status: newStatus }));
            setStatus(newStatus); // Update UI with new status
        } catch (error) {
            console.error("Error updating request:", error);
        } finally {
            setLoading(null);
        }
    };

    const isExpired = new Date(request.date) < new Date(); // Check if ride date is in the past

    return (
        <div className="border rounded-lg p-4 shadow-md bg-white">
            <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">{request.driverName}</h2>
                <p className="text-sm text-gray-500">{request.department}, Year {request.year}</p>
                <hr className="my-2" />
                <p><strong>From:</strong> {request.startLocation}</p>
                <p><strong>To:</strong> {request.endLocation}</p>
                <p><strong>Date:</strong> {request.date}</p>
                <p><strong>Time:</strong> {request.time}</p>
                <p><strong>Seats Available:</strong> {request.seatsAvailable}</p>
                <p><strong>Price:</strong> ₹{request.price}</p>

                {!isExpired ? (
                    status === "pending" ? (
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => handleAction("accepted")}
                                className="btn btn-success"
                                disabled={loading === "accepted"}
                            >
                                {loading === "accepted" ? "Accepting..." : "Accept"}
                            </button>
                            <button
                                onClick={() => handleAction("rejected")}
                                className="btn btn-error"
                                disabled={loading === "rejected"}
                            >
                                {loading === "rejected" ? "Rejecting..." : "Reject"}
                            </button>
                        </div>
                    ) : (
                        <p className={`mt-3 font-medium ${status === "accepted" ? "text-green-600" : "text-red-600"}`}>
                            Request {status === "accepted" ? "Accepted ✅" : "Rejected ❌"}
                        </p>
                    )
                ) : (
                    <a
                        href={`https://wa.me/${request.driverPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary mt-4"
                    >
                        Contact Driver
                    </a>
                )}
            </div>
        </div>
    );
};

export default RideRequestCard;
