import Meta from "@/components/Meta";
import { type ReactNode } from "react";

// external imports
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Meta />
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default DefaultLayout;
