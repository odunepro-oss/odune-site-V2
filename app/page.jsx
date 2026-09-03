import { PAGE_ACCUEIL } from "../lib/contenu";

export const metadata = {
  title: "Odune — Studio-conseil à Paris",
  description: "Studio-conseil parisien. Stratégie, image de marque, communication, pensées à partir de la psychologie de votre client.",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: PAGE_ACCUEIL }} />;
}
