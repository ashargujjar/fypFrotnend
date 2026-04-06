import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminSignup from "./pages/auth/AdminSignup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import DashboardHome from "./pages/customer/DashboardHome";
import MyShipments from "./pages/customer/MyShipments";
import ShipmentDetails from "./pages/customer/ShipmentDetails";
import BookShipment from "./pages/customer/BookShipment";
import TrackShipment from "./pages/customer/TrackShipment";
import Payments from "./pages/customer/Payments";
import Complaints from "./pages/customer/Complaints";
import Profile from "./pages/customer/Profile";
import RiderDashboardHome from "./pages/rider/RiderDashboardHome";
import PickupTasks from "./pages/rider/PickupTasks";
import LinehaulTasks from "./pages/rider/LinehaulTasks";
import DeliveryTasks from "./pages/rider/DeliveryTasks";
import POD from "./pages/rider/POD";
import RiderProfile from "./pages/rider/RiderProfile";
import RiderAlerts from "./pages/rider/RiderAlerts";
import RiderRouteMap from "./pages/rider/RiderRouteMap";
import RiderAccess from "./pages/rider/components/RiderAccess";
import Notfound from "./pages/Notfound";
import PublicTrack from "./pages/public/PublicTrack";
import AdminProfile from "./pages/admin/AdminProfile";
import IoTCenter from "./pages/admin/IoTCenter";
import Riders from "./pages/admin/Riders";
import ShipmentDetailsAdmin from "./pages/admin/ShipmentDetailsAdmin";
import Shipments from "./pages/admin/Shipments";
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import Assignments from "./pages/admin/Assignments";
import RoleSelect from "./pages/auth/RoleSelect";
import AddRider from "./pages/admin/AddRider";
import AdminComplaints from "./pages/admin/AdminComplaints";
import CityZones from "./pages/admin/CityZones";
import Customers from "./pages/admin/Customers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/role" element={<RoleSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verifyEmail" element={<VerifyEmail />} />
        <Route path="/customer" element={<DashboardHome />} />
        <Route path="/customer/dashboard" element={<DashboardHome />} />
        <Route path="/customer/shipments" element={<MyShipments />} />
        <Route path="/customer/shipments/:id" element={<ShipmentDetails />} />
        <Route path="/customer/book" element={<BookShipment />} />
        <Route path="/customer/track" element={<TrackShipment />} />
        <Route path="/customer/track/:id" element={<ShipmentDetails />} />
        <Route path="/customer/payments" element={<Payments />} />
        <Route path="/customer/complaints" element={<Complaints />} />
        <Route path="/customer/profile" element={<Profile />} />
        <Route path="/customer/book-shipment" element={<BookShipment />} />

        <Route
          path="/rider"
          element={<Navigate to="/rider/dashboard" replace />}
        />
        <Route path="/rider/dashboard" element={<RiderDashboardHome />} />
        <Route
          path="/rider/pickups"
          element={
            <RiderAccess allow="pickup">
              <PickupTasks />
            </RiderAccess>
          }
        />
        <Route
          path="/rider/linehaul"
          element={
            <RiderAccess allow="linehaul">
              <LinehaulTasks />
            </RiderAccess>
          }
        />
        <Route
          path="/rider/deliveries"
          element={
            <RiderAccess allow="delivery">
              <DeliveryTasks />
            </RiderAccess>
          }
        />
        <Route path="/rider/route" element={<RiderRouteMap />} />
        <Route path="/rider/pod" element={<POD />} />
        <Route path="/rider/profile" element={<RiderProfile />} />
        <Route path="/rider/alerts" element={<RiderAlerts />} />
        <Route path="/track" element={<PublicTrack />} />
        <Route path="/track/:id" element={<PublicTrack />} />
        <Route path="*" element={<Notfound />} />
        <Route path="/admin/dashboard" element={<AdminDashboardHome />} />
        <Route path="/admin/shipments" element={<Shipments />} />
        <Route path="/admin/shipments/:id" element={<ShipmentDetailsAdmin />} />
        <Route path="/admin/riders" element={<Riders />} />
        <Route path="/admin/assignments" element={<Assignments />} />
        <Route path="/admin/iot" element={<IoTCenter />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/riders/add" element={<AddRider />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/cities" element={<CityZones />} />
        <Route path="/admin/customers" element={<Customers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
