import { PAGE_SERVICES } from "../../lib/contenu";

export const metadata = {
  title: "Services et abonnements — Odune",
  description: "Par projet pour créer ou refondre une marque, par abonnement pour la faire vivre chaque mois. À partir de 3 000 € HT.",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: PAGE_SERVICES }} />;
}
