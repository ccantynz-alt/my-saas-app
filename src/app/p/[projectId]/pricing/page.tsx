import { Metadata } from "next";
import CatchAllPublishedPage from "../[...path]/page";

type Props = {
  params: { projectId: string };
};

export const metadata: Metadata = {
  title: "Pricing",
  description: "Pricing information",
};

export default function PublishedPricingPage({ params }: Props) {
  return (
    <CatchAllPublishedPage
      params={{ projectId: params.projectId, path: ["pricing"] }}
    />
  );
}
