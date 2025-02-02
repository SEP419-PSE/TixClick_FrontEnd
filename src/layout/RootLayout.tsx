import { Outlet, useLocation } from "react-router";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";

const RootLayout = () => {
  const location = useLocation();
  return (
    <>
      <header>{location.pathname !== "/signin" && <Header />}</header>
      <main>
        <Outlet />
      </main>
      <footer>{location.pathname !== "/signin" && <Footer />}</footer>
    </>
  );
};

export default RootLayout;
