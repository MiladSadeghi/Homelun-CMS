import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  Routes as RouterRoutes,
  useLocation,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../feature/store";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../components/Login";
import axios from "axios";
import { isProfileCompleted, userLoggedIn } from "../feature/user/userSlice";
import Dashboard from "../pages/Dashboard";
import { TRole } from "../types/role";
import Agents from "../pages/Agents";
import Properties from "../pages/Properties";
import Users from "../pages/Users";
import Profile from "../pages/Profile";
import User from "../pages/User";
import axiosInstance from "../services/api";
import { toast } from "react-toastify";
import Property from "../pages/Property";
import Contact from "../pages/Contact Us";
import TourRequests from "../pages/TourRequests/TourRequests";

function Routes() {
  const location = useLocation();
  const isUserAuthenticated: Boolean = useSelector(
    (state: RootState) => state.userSlice.isAuthenticated
  );
  const userRole: TRole | null = useSelector(
    (state: RootState) => state.userSlice.role
  );

  const dispatch = useDispatch();
  const refreshToken: string | null = localStorage.getItem("kq_c");
  const navigate = useNavigate();

  useEffect(() => {
    const whoAmI = async () => {
      if (refreshToken) {
        try {
          const { data } = await axios.get("/auth/who-am-i", {
            headers: { authorization: `Bearer ${refreshToken}` },
          });
          dispatch(
            userLoggedIn({
              accessToken: data.accessToken,
              isAuthenticated: true,
              name: data.name,
              role: data.role,
            })
          );
        } catch (error: any) {}
      }
    };

    whoAmI();
  }, []);

  useEffect(() => {
    const isUserProfileComplete = async () => {
      try {
        if (userRole === "agent") {
          const { data } = await axiosInstance.get("agent/profile");
          if (data.profileCompleted) {
            dispatch(
              isProfileCompleted({
                status: true,
                id: data.profile._id,
                agentProfile: data.profile,
              })
            );
          } else {
            throw Error();
          }
        }
      } catch (error: any) {
        dispatch(isProfileCompleted({ status: false }));
        navigate("/profile");
        toast.error(error?.response?.data?.message);
      }
    };
    isUserProfileComplete();
  }, [isUserAuthenticated]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <RouterRoutes location={location} key={location.pathname}>
        <Route
          path="/"
          element={isUserAuthenticated ? <PrivateRoute /> : <Login />}
        >
          {/* Public Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:propertyId" element={<Property />} />
          <Route path="/tour" element={<TourRequests />} />

          {/* these routes are only available for the super admins and admin */}
          {userRole && userRole === ("super_admin" || "admin") && (
            <>
              <Route path="/agents" element={<Agents />} />
              <Route path="/agents/:agentSlug" element={<Profile />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:userId" element={<User />} />
              <Route path="/contact" element={<Contact />} />
            </>
          )}

          {/* these routes are only available for the super admins */}
          {userRole && userRole === "super_admin" && (
            <>
              <Route path="/users/add" element={<User />} />
              <Route path="/properties/add" element={<Property />} />
            </>
          )}

          {/* these routes are only available for the admins */}
          {userRole && userRole === "agent" && (
            <>
              <Route path="/profile" element={<Profile />} />
            </>
          )}
        </Route>
        <Route path="*" element={<Navigate to={"/"} />} />
      </RouterRoutes>
    </AnimatePresence>
  );
}

export default Routes;
