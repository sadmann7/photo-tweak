import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>PhotoTweak</title>
      </Head>
      <main className="container mx-auto mt-32 flex max-w-7xl flex-col items-center justify-center px-6">
        <div className="grid max-w-xl place-items-center gap-4">
          <h1 className="text-center text-4xl font-bold leading-tight sm:text-6xl sm:leading-tight">
            Edit portraits from text commands
          </h1>
          <p className="mt-4 text-center text-lg text-gray-300 sm:text-xl">
            Want to edit portrait with only text commands? Upload your photo and
            add a text command to edit your portrait.
          </p>
        </div>
      </main>
    </>
  );
}
