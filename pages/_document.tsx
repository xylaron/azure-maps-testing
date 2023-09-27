import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://atlas.microsoft.com/sdk/javascript/indoor/0.2/atlas-indoor.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </Html>
  );
}
