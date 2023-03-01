import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Meta from "@/components/Meta";
import Head from "next/head";
import type { ReactNode } from "react";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <Meta />
      </Head>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default DefaultLayout;
