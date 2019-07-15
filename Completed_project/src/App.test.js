import React from "react";
import { cleanup, render, waitForElement } from "react-testing-library";
import "jest-dom/extend-expect";
import App from "./App";

global.API_URL = "https://some-cat-api.com";

jest.mock("axios", () => ({
  get: () =>
    Promise.resolve({
      data: [{ url: "https://some-cat-storage.com/cat1" }]
    })
}));

afterEach(cleanup);

test("it should render a spicy header", async () => {
  const { getByTestId } = render(<App />);
  const headerNode = await waitForElement(() => getByTestId("header"));
  expect(headerNode).toHaveTextContent("Docker UI Demo");
  expect(headerNode).toHaveTextContent("🐳");
  expect(headerNode).toHaveTextContent("🔥");
});
