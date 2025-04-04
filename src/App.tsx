import { BrowserRouter, Route, Routes } from "react-router";
import EnterCode from "./components/OTP/EnterCode";
import OTPVerify from "./components/OTP/OTPVerify";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import SignInForm from "./components/SignInForm/SignInForm";
import SignUpForm from "./components/SingUpForm/SignUpForm";
import RootLayout from "./layout/RootLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminCompany from "./pages/admin/companies/AdminCompany";
import AdminEvent from "./pages/admin/events/AdminEvent";
import AccountsPage from "./pages/admin/ManagerAccPage";
import RevenuePage from "./pages/admin/revenue/Revenues";
import SignInPage from "./pages/auth/SignInPage";
import CompanyDashBoard from "./pages/company/CompanyDashBoard";
import HomeCompany from "./pages/company/components/HomeCompany";
import ManageContract from "./pages/company/components/ManageContract";
import ManageEvents from "./pages/company/components/ManageEvents";
import ManageMember from "./pages/company/components/ManageMember";
import CreateCompany from "./pages/company/CreateCompany";
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
import NotificationPage from "./pages/manager/components/Notifications/NotificationPage";
import PaymentsPage from "./pages/manager/components/payments/Payments";
import VietQRGenerator from "./pages/manager/components/VietQRGenerator";
import {
  default as OrganizerCenter,
} from "./pages/organizer";
import PaymentPage from "./pages/payment/PaymentPage";
import ProfileForm from "./pages/profile/ProfileForm";
import SuperLogin from "./pages/superlogin/SuperLogin";
import TicketPage from "./pages/ticket/TicketPage";

import CreateEvent from "./components/CreateEvent/CreateEvent";
import ChatApp from "./pages/chat/ChatApp";
import ProfileCompany from "./pages/company/components/ProfileCompany";
import TicketBooking from "./pages/TicketBooking";
import PaymentQueuePage from "./pages/payment/QueueLoading/QueueLoading";

export default function App() {
  return (
    <div className="font-inter text-[14px] text-white min-h-screen bg-pse-black overflow-x-hidden">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="event-detail/:id" element={<EventDetail />} />
            <Route
              path="event-detail/:id/booking-ticket"
              element={<TicketBooking />}
            />
            <Route path="create-event" element={<CreateEvent />} />
            {/* Authitencation route */}
            <Route path="auth" element={<SignInPage />}>
              <Route index path="signin" element={<SignInForm />} />
              <Route path="signup" element={<SignUpForm />} />
              <Route path="verify" element={<OTPVerify />} />
              <Route path="code" element={<EnterCode />} />
            </Route>
            {/* Organizer route */}
            <Route path="404" element={<ErrorPage />} />

            {/*Company route */}
            <Route path="create-company" element={<CreateCompany />} />
          </Route>

          <Route>
            <Route path="organizerCenter" element={<OrganizerCenter />} />
            {/* <Route path="managerContracts" element={<ContractsPage />} /> */}
            <Route path="payment" element={<PaymentPage />} />
            <Route path="payment/queue" element={<PaymentQueuePage />} />

            <Route path="manager-dashboard" element={<DashboardLayout />}>
              <Route index element={<ManagerOverview />} />
              <Route path="contracts" element={<ContractsPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route
                path="company-approvals"
                element={<CompanyApprovalsPage />}
              />
              <Route path="notifications" element={<NotificationPage />} />
            </Route>

            <Route path="profileForm" element={<ProfileForm />} />
            <Route path="superLogin" element={<SuperLogin />} />

            <Route path="consumerCenter" element={<RootLayouts />}>
              <Route index element={<Consumer />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="policies" element={<Policy />} />
            </Route>

            <Route path="ticketManagement" element={<TicketPage />} />

            <Route path="proAdmin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<AdminEvent />} />
              <Route path="companies" element={<AdminCompany />} />
              <Route path="managerManagement" element={<AccountsPage />} />
              <Route path="revenues" element={<RevenuePage />} />
            </Route>

            {/*             
            <Route path="managerManagement" element={<AccountsPage />} />
            <Route path="event" element={<EventsPage />} />
            <Route path="proAdmin/revenue" element={<RevenuePage />} /> */}
          </Route>

          {/* Account Company */}
          <Route path="company" element={<CompanyDashBoard />}>
            <Route index element={<HomeCompany />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="members" element={<ManageMember />} />
            <Route path="contracts" element={<ManageContract />} />
            <Route path="profile" element={<ProfileCompany />} />
          </Route>

          <Route path="404" element={<ErrorPage />} />
          <Route path="vietqr" element={<VietQRGenerator />} />

          {/* Chat app */}
          <Route path="chat" element={<ChatApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
