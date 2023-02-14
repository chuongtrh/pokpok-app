import Navbar from "./navbar";
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>PokPok</title>
      </Head>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
