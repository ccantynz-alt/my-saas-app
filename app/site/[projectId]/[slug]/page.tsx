import { getSeoPageBySlug } from "@/app/lib/seoKV";

export default async function SeoPage({
  params,
}: {
  params: { projectId: string; slug: string };
}) {
  const page = await getSeoPageBySlug(params.projectId, params.slug);

  if (!page) return null;

  return (
    <main>
      <h1>{page.h1}</h1>

      {page.sections.map((s, i) => (
        <section key={i}>
          <h2>{s.heading}</h2>
          <p>{s.content}</p>
        </section>
      ))}
    </main>
  );
}
