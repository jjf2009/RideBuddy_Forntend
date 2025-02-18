import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseURL'

const  baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}`,
})

const ridesApi = createApi({
    reducerPath:'ridesApi',
    baseQuery,
    tagTypes:["Rides"],
    endpoints:(builder) =>({
        fetchAllRides : builder.query({
            query: ()=>"/search",
            providesTags: ["Rides"]
        }),
        fetchRideById: builder.query({
            query: (id) => `/search/${id}`,
            providesTags: (result, error, id) => [{ type: "Rides", id }],
        }),
        addRide: builder.mutation({
            query: (newBook) => ({
                url: `/publish`,
                method: "POST",
                body: newBook
            }),
            invalidatesTags: ["Rides"]
        }),
    })

})

export const {useFetchAllRidesQuery, useFetchRideByIdQuery, useAddRideMutation,} = ridesApi;
export default ridesApi;