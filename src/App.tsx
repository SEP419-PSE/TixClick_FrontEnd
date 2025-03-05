import { BrowserRouter, Route, Routes } from "react-router";
import Stepper from "./components/CreateEvent/Stepper";
import EnterCode from "./components/OTP/EnterCode";
import OTPVerify from "./components/OTP/OTPVerify";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import SignInForm from "./components/SignInForm/SignInForm";
import SignUpForm from "./components/SingUpForm/SignUpForm";
import RootLayout from "./layout/RootLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AccountsPage from "./pages/admin/ManagerAccPage";
import RevenuePage from "./pages/admin/revenue/Revenues";
import SignInPage from "./pages/auth/SignInPage";
import Consumer from "./pages/consumer/components/Consumer";
import Policy from "./pages/consumer/components/Policy/Policy";
import ReportsPage from "./pages/consumer/components/Report/Report";
import RootLayouts from "./pages/consumer/Layout";
import ErrorPage from "./pages/errors/ErrorPage";
import EventDetail from "./pages/EventDetail";
import HomePage from "./pages/HomePage";
import CompanyApprovalsPage from "./pages/manager/components/Companies/Companies";
import ContractsPage from "./pages/manager/components/Contracts/ContractsPage";
import EventsPage from "./pages/manager/components/Events/EventsPage";
import DashboardLayout from "./pages/manager/components/ManagerLayout";
import ManagerOverview from "./pages/manager/components/ManagerOverview";
import PaymentsPage from "./pages/manager/components/payments/Payments";
import ManagerDashboardPage from "./pages/manager/ManagerDashboardPage";
import { default as OrganizerCenter, default as OrganizerPage } from "./pages/organizer";
import PaymentPage from "./pages/payment/PaymentPage";
import ProfileForm from "./pages/profile/ProfileForm";
import TicketPage from "./pages/ticket/TicketPage";

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
          </Route>
          <Route>
            <Route path="organizerCenter" element={<OrganizerCenter />} />
            <Route path="profileForm" element={<ProfileForm />} />
            <Route path="manager" element={<ManagerDashboardPage />} />
            {/* <Route path="managerContracts" element={<ContractsPage />} /> */}
            <Route path="payment" element={<PaymentPage />} />


            <Route path="manager-dashboard" element={<DashboardLayout />}>
              <Route index element={<ManagerOverview />} />
              <Route path="contracts" element={<ContractsPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="company-approvals" element={<CompanyApprovalsPage />} />


            </Route>


            {/* <Route path="manager" element={<ManagerDashboardPage />} /> */}


            <Route path="consumerCenter" element={<RootLayouts />}>
              <Route index element={<Consumer />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="policies" element={<Policy />} />
            </Route>

            <Route path="proAdmin" element={<AdminDashboard />} >
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="managerManagementss" element={<AccountsPage />} />
              <Route path="revenues" element={<RevenuePage />} />
            </Route>

            
            <Route path="managerManagement" element={<AccountsPage />} />
            <Route path="event" element={<EventsPage />} />

            <Route path="proAdmin/revenue" element={<RevenuePage />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}
