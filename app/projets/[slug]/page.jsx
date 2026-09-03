import { PAGE_PROJETS, SLUGS, NOMS } from "../../../lib/contenu";

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const nom = NOMS[slug] || "Projet";
  return {
    title: nom + " — Odune",
    description: "Étude de cas " + nom + " par Odune, studio-conseil à Paris.",
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const html = PAGE_PROJETS.replace(
    'id="r-projets" data-actif>',
    'id="r-projets" data-actif data-projet="' + slug + '">'
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
