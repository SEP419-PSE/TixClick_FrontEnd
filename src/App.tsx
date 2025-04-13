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
import PaymentPage from "./pages/payment/PaymentPage";
import ProfileForm from "./pages/profile/ProfileForm";
import SuperLogin from "./pages/superlogin/SuperLogin";
import TicketPage from "./pages/ticket/TicketPage";
import CreateEvent from "./components/CreateEvent/CreateEvent";
import ChatApp from "./pages/chat/ChatApp";
import ContractTemplate from "./pages/manager/components/Contracts/ContractTemplate";
import PaymentQueuePage from "./pages/payment/QueueLoading/QueueLoading";
import TicketBooking from "./pages/TicketBooking";
import TicketBookingNoneSeatmap from "./pages/TicketBookingNoneSeatmap";
import SearchPage from "./pages/consumer/SearchPage";
import OrganizerCenter from "./pages/organizer";
import Member from "./pages/consumer/components/Member/Member";
import Tasks from "./pages/consumer/components/Tasks/Tasks";
import Revenue from "./pages/consumer/components/Revenue/Revenue";
import Information from "./pages/consumer/components/Information/Information";
import EventManagement from "./pages/consumer/components/Event/EventManagement";
import SummaryRevenue from "./pages/consumer/components/Event/SummaryRevenue";
import Order from "./pages/consumer/components/Event/Order";
import CheckIn from "./pages/consumer/components/Event/CheckIn";

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

          <Route
            path="event-detail/:id/booking-ticket-no-seatmap"
            element={<TicketBookingNoneSeatmap />}
          />
          <Route path="/search" element={<SearchPage />} />

          <Route>
            <Route path="organizerCenter" element={<OrganizerCenter />} />
            {/* <Route path="managerContracts" element={<ContractsPage />} /> */}
            <Route path="payment" element={<PaymentPage />} />
            <Route path="payment/queue" element={<PaymentQueuePage />} />
            {/* <Route path="/payment-return" element={<PaymentReturnPage />} /> */}

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

            <Route path="company" element={<RootLayouts />}>
              <Route index element={<Consumer />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="policies" element={<Policy />} />e
              <Route path="members" element={<Member />} />
              <Route path="information" element={<Information />} />
            </Route>

            {/* Event Management */}
            <Route
              path="/company/events/:eventId"
              element={<EventManagement />}
            >
              <Route
                index
                path="summary-revenue"
                element={<SummaryRevenue />}
              />
              <Route path="orders" element={<Order />} />
              <Route path="revenue" element={<Revenue />} />
              <Route path="check-in" element={<CheckIn />} />
              <Route path="tasks" element={<Tasks />} />
            </Route>

            <Route />

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
          {/* <Route path="company" element={<CompanyDashBoard />}>
            <Route index element={<HomeCompany />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="members" element={<ManageMember />} />
            <Route path="contracts" element={<ManageContract />} />
            <Route path="profile" element={<ProfileCompany />} />
          </Route> */}

          <Route path="404" element={<ErrorPage />} />
          <Route path="vietqr" element={<VietQRGenerator />} />

          {/* Chat app */}
          <Route path="chat" element={<ChatApp />} />
          <Route path="template" element={<ContractTemplate />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
