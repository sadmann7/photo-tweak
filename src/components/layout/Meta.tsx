import Head from "next/head";

type MetaProps = {
  title?: string;
  description?: string;
  image?: string;
};

const Meta = ({
  title = "PhotoTweak",
  description = "Edit photos with text command",
  image = "https://phototweak.vercel.app/api/og?title=PhotoTweak&description=Edit%20photos%20with%20text%20command",
}: MetaProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />

      <meta property="og:site_name" content="PhotoTweak" />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};

export default Meta;
