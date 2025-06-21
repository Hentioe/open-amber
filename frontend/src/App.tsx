import { MetaProvider, Title } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Navigation from "./pages/Navigation";
import Site from "./pages/Site";
import Submit from "./pages/Submit";
import { metaState } from "./state";

export default () => {
  return (
    <MetaProvider>
      <Title>{metaState.title}</Title>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/sites/:siteId" component={Site} />
        <Route path="/navigation" component={Navigation} />
        <Route path="/join" component={Join} />
        <Route path="/submit" component={Submit} />
      </Router>
    </MetaProvider>
  );
};
