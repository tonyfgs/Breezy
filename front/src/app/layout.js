import "./globals.css";

export const metadata = {
  title: "Breezy",
  description: "Réseau social",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
