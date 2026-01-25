import dynamic from "next/dynamic";

const HomeClient = dynamic(() => import("./_client/HomeClient"), { ssr: false });

export default function Page() {
  return <HomeClient />;
}