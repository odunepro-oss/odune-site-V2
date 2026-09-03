import "./globals.css";
import { NAV } from "../lib/contenu";

export const metadata = {
  title: "Odune — Studio-conseil à Paris",
  description: "Odune — studio-conseil à Paris. Stratégie, image de marque, communication.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icone-tuile.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500&family=Geist:wght@400&display=swap" />
      </head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: NAV }} />
        {children}
        <script src="/site.js" defer></script>
      </body>
    </html>
  );
}
