import { PAGE_MENTIONS } from "../../lib/contenu";

export const metadata = {
  title: "Mentions légales — Odune",
  description: "Mentions légales du site Odune.",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: PAGE_MENTIONS }} />;
}
