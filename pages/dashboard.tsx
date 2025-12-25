import Head from "next/head";
import { Container } from "../components/Container";

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard — MySaaS</title>
      </Head>

      <Container>
        <section className="section">
          <h1 className="h1">Dashboard</h1>
          <p className="p">
            This is the app shell. Features will live here.
          </p>
        </section>
      </Container>
    </>
  );
}
