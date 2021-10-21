import React from "react";
import { AppProvider } from "./components/Context";
import App from "./App"

const Wrapper = (component) => {
  return (
    <AppProvider>
      <App>
        {component}
      </App>
    </AppProvider>
  );
};

export default Wrapper