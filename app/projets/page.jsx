import { PAGE_PROJETS } from "../../lib/contenu";

export const metadata = {
  title: "Projets — Odune",
  description: "Le travail parle mieux que nous. Restauration, horlogerie, menuiserie, IA, édition.",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: PAGE_PROJETS }} />;
}
