import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}`,
});

const ridesApi = createApi({
    reducerPath: 'ridesApi',
    baseQuery,
    tagTypes: ["Rides"],
    endpoints: (builder) => ({
        fetchAllRides: builder.query({
            query: () => "/search",
            providesTags: ["Rides"]
        }),
        fetchRideById: builder.query({
            query: (id) => `/search/${id}`,
            providesTags: (result, error, id) => [{ type: "Rides", id }],
        }),
        addRide: builder.mutation({
            query: (newRide) => ({
                url: "/publish",
                method: "POST",
                body: newRide
            }),
            invalidatesTags: ["Rides"]
        }),
        updateRide: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/update/${id}`,
                method: "PUT",
                body: updatedData
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Rides", id }],
        }),
        deleteRide: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Rides"]
        }),
    })
});

export const { 
    useFetchAllRidesQuery, 
    useFetchRideByIdQuery, 
    useAddRideMutation, 
    useUpdateRideMutation, 
    useDeleteRideMutation 
} = ridesApi;
export default ridesApi;
