import { BrowserRouter, Route, Routes } from "react-router";
import EnterCode from "./components/OTP/EnterCode";
import OTPVerify from "./components/OTP/OTPVerify";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import SignInForm from "./components/SignInForm/SignInForm";
import SignUpForm from "./components/SingUpForm/SignUpForm";
import RootLayout from "./layout/RootLayout";
import SignInPage from "./pages/auth/SignInPage";
import ConsumerCenter from "./pages/consumer";
import MyEvents from "./pages/consumer/components/MyEvent";
import ErrorPage from "./pages/errors/ErrorPage";
import EventDetail from "./pages/EventDetail";
import HomePage from "./pages/HomePage";
import OrganizerCenter from "./pages/organizer";

export default function App() {
  return (
    <div className="font-inter text-[14px] text-white min-h-screen bg-pse-black overflow-x-hidden">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="event-detail" element={<EventDetail />} />
            <Route path="auth" element={<SignInPage />}>
              <Route index path="signin" element={<SignInForm />} />
              <Route path="signup" element={<SignUpForm />} />
              <Route path="verify" element={<OTPVerify />} />
              <Route path="code" element={<EnterCode />} />
            </Route>
            <Route path="404" element={<ErrorPage />} />
            <Route path="organizerCenter" element={<OrganizerCenter />} />
            <Route path="consumerCenter" element={<ConsumerCenter />} />
            <Route path="/my-events" element={<MyEvents />} />



          </Route>
        </Routes>
      </BrowserRouter>
      

    </div>
  );
}