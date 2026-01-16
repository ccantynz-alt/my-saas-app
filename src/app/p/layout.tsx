export const runtime = "nodejs";

export const metadata = {
  title: "Published Site",
  description: "Public published site",
};

export default function PublicPublishedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // IMPORTANT:
  // This layout MUST NOT call auth(), currentUser(), protect(), or redirect().
  // It keeps /p/* public and prevents redirect loops.
  return <>{children}</>;
}
