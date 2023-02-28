import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>TextTweak</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center py-2">
        <h1 className="text-6xl font-bold">TextTweak</h1>
      </main>
    </>
  );
}
