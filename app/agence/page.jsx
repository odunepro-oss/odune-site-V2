import { PAGE_AGENCE } from "../../lib/contenu";

export const metadata = {
  title: "L'agence — Odune",
  description: "Un studio-conseil qui comprend comment votre client décide avant de créer. Ilona pilote chaque projet.",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: PAGE_AGENCE }} />;
}
