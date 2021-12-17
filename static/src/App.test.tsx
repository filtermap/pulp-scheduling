import { render, screen } from "@testing-library/react";
import React from "react";

test("renders test string", () => {
  render(<div>test</div>);
  const testElement = screen.getByText(/test/i);
  expect(testElement).toBeInTheDocument();
});
