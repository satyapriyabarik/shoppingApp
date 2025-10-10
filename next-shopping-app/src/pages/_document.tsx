// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" data-scroll-behavior="smooth">
        <Head>
          {/* Minimal CSP - allow self, same for images and styles. Adjust for your needs. */}
          {/* <meta httpEquiv="Content-Security-Policy" content={`default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' https:`} /> */}
          {/* <meta
            httpEquiv="Content-Security-Policy"
            content="
    default-src 'self';
    img-src 'self' data: https:;
    style-src 'self' 'unsafe-inline' https:;
    script-src 'self' 'unsafe-inline' https:;
    connect-src 'self' https://my-json-server.typicode.com ws:;
  "
          /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
