// @refresh reload
import { MetaProvider, Title, Link, Meta } from "@solidjs/meta"
import { createHandler, StartServer } from "@solidjs/start/server";
import "./app.css"

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <MetaProvider>
        <html lang="en">
          <head>
            <Meta charset="utf-8" />
            <Meta name="viewport" content="width=device-width, initial-scale=1" />
            <Title>n dru</Title>
            <Link rel="preload" href="/fonts/audiowide-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            {assets}
          </head>
          <body>
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      </MetaProvider>
    )}
  />
), {
  mode: "stream"
});
