import { BrowserRouter, Route, Routes } from "react-router";
import EnterCode from "./components/OTP/EnterCode";
import OTPVerify from "./components/OTP/OTPVerify";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import SignInForm from "./components/SignInForm/SignInForm";
import SignUpForm from "./components/SingUpForm/SignUpForm";
import RootLayout from "./layout/RootLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProfessionalDashboard from "./pages/admin/ProfessionalStatistic";
import SignInPage from "./pages/auth/SignInPage";
import Consumer from "./pages/consumer/components/Consumer";
import Policy from "./pages/consumer/components/Policy/Policy";
import ReportsPage from "./pages/consumer/components/Report/Report";
import RootLayouts from "./pages/consumer/Layout";
import ErrorPage from "./pages/errors/ErrorPage";
import EventDetail from "./pages/EventDetail";
import HomePage from "./pages/HomePage";
import ManagerDashboardPage from "./pages/manager/ManagerDashboardPage";
import OrganizerCenter from "./pages/organizer";
import ProfileForm from "./pages/profile/ProfileForm";
import TicketPage from "./pages/ticket/TicketPage";
import OrganizerPage from "./pages/organizer";
import Stepper from "./components/CreateEvent/Stepper";
import CreateCompany from "./pages/company/CreateCompany";

export default function App() {
  return (
    <div className="font-inter text-[14px] text-white min-h-screen bg-pse-black overflow-x-hidden">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="event-detail" element={<EventDetail />} />
            <Route path="create-event" element={<Stepper />} />
            {/* Authitencation route */}
            <Route path="auth" element={<SignInPage />}>
              <Route index path="signin" element={<SignInForm />} />
              <Route path="signup" element={<SignUpForm />} />
              <Route path="verify" element={<OTPVerify />} />
              <Route path="code" element={<EnterCode />} />
            </Route>
            {/* Organizer route */}
            <Route path="organizer" element={<OrganizerPage />} />
            <Route path="404" element={<ErrorPage />} />

            <Route path="ticketManagement" element={<TicketPage />} />

            {/*Company route */}
            <Route path="create-company" element={<CreateCompany />} />
          </Route>
          <Route>
            <Route path="organizerCenter" element={<OrganizerCenter />} />
            <Route path="profileForm" element={<ProfileForm />} />
            <Route path="manager" element={<ManagerDashboardPage />} />
            {/* <Route path="manager" element={<ManagerDashboardPage />} /> */}

            <Route path="consumerCenter" element={<RootLayouts />}>
              <Route index element={<Consumer />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="policies" element={<Policy />} />
            </Route>
          </Route>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="proAdmin" element={<ProfessionalDashboard />} />
          <Route path="404" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
