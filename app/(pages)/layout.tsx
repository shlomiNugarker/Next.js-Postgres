import Footer from "../layouts/partials/Footer";
import "../styles/main.scss";

import { GeistSans } from "geist/font/sans";
import Providers from "../layouts/partials/Providers";

let title = "Title";
let description = "Description";

export const metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  metadataBase: new URL("https://shlomi-nugarker-portfolio.vercel.app"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning={true} lang="en">
      <head>
        <meta name="theme-name" content="nextapp" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#000"
        />
      </head>
      <body suppressHydrationWarning={true} className={GeistSans.variable}>
        <Providers>
          <main className="min-h-custom ">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
