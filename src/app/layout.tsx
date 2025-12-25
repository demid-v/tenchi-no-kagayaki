import { Metadata } from "next";

import { Layout } from "~/components/dom/layout";

import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "天地の輝き",
  description: "Space exploration game.",
  authors: [{ name: "Demid Vasilyev", url: "https://t.me/demid_v" }],
  creator: "Demid Vasilyev",
  publisher: "Demid Vasilyev",
  keywords: [
    "universe",
    "space",
    "planets",
    "space exploration",
    "procedurally generated",
  ],
  robots: { index: true, follow: true },
};
