import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

const container = document.getElementById("root");

if (!container) {
  console.error("Root container missing in index.html");
} else {
  const root = createRoot(container);

  root.render(
    <MantineProvider>
      <Notifications />
      <ModalsProvider>
        <App />
      </ModalsProvider>
    </MantineProvider>
  );
}
