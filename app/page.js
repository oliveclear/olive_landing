import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Istok+Web:wght@400;700&family=Outlet&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          backgroundColor: "#1c1c1c",
          height: "100vh",  // Ensures the div takes up the full viewport height
          display: "flex",
          alignItems: "center",  // Centers vertically
          justifyContent: "center",  // Centers horizontally
        }}
      >
        <h1
          className="text-4xl font-semibold"
          style={{
            color: "#cedf9f",
            fontFamily: "'Outlet', 'Istok Web', sans-serif",
            fontSize: "4rem",
          }}
        >
          Coming Soon...
        </h1>
      </div>
    </>
  );
}
