import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Layout } from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  // Simple convention: pages can set `Component.noLayout = true` if desired later
  // @ts-expect-error - optional custom prop
  const noLayout = Component.noLayout;

  if (noLayout) return <Component {...pageProps} />;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
