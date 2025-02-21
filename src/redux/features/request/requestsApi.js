import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}`,
});

const rideRequestsApi = createApi({
    reducerPath: 'rideRequestsApi',
    baseQuery,
    tagTypes: ['RideRequests'],
    endpoints: (builder) => ({
        fetchAllRequests: builder.query({
            query: () => '/requests',
            providesTags: ['RideRequests'],
        }),
        fetchRequestById: builder.query({
            query: (id) => `/requests/${id}`,
            providesTags: (result, error, id) => [{ type: 'RideRequests', id }],
        }),
        addRideRequest: builder.mutation({
            query: (newRequest) => ({
                url: '/requests',
                method: 'POST',
                body: newRequest,
            }),
            invalidatesTags: ['RideRequests'],
        }),
        updateRequestStatus: builder.mutation({
            query: ({ requestId, status }) => ({
                url: `/requests/${requestId}`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: (result, error, { requestId }) => [
                { type: 'RideRequests', id: requestId },
            ],
        }),
    }),
});

export const {
    useFetchAllRequestsQuery,
    useFetchRequestByIdQuery,
    useAddRideRequestMutation,
    useUpdateRequestStatusMutation,
} = rideRequestsApi;
export default rideRequestsApi;
