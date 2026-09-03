import { PAGE_METHODE } from "../../lib/contenu";

export const metadata = {
  title: "La méthode — Odune",
  description: "Diagnostic, recommandation écrite, puis exécution. Comprendre comment votre client décide avant de produire quoi que ce soit.",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: PAGE_METHODE }} />;
}
