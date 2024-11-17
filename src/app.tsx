import { MetaProvider, Title } from "@solidjs/meta";
import { Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./app.css";

export default function App() {

  return (
    <Router 
      root={(props) => (
        <MetaProvider>
          <Title>ndru</Title>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
