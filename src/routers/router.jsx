import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/home/Home.jsx";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import PublishRide from "../components/PublishRide.jsx";
import NotFound from "../components/NotFound.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import SearchPage from "../pages/user/SearchPage.jsx";
import RequestPage from "../pages/request/RequestPage.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/search",
          element: (
            <PrivateRoute>
              <SearchPage />
            </PrivateRoute>
          ),
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/publish",
          element: (
            <PrivateRoute>
              <PublishRide />
            </PrivateRoute>
          ),
        },
        {
          path: "/requests",
          element: (
            <PrivateRoute>
              <RequestPage />
            </PrivateRoute>
          ),
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default router;
