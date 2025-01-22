import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import EventDetail from "./pages/EventDetail";
import RootLayout from "./layout/RootLayout";

export default function App() {
  return (
    <div className="font-inter text-[14px] text-white min-h-screen bg-pse-black overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="event-detail" element={<EventDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
