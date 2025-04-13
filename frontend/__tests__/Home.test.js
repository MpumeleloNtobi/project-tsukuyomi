import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home Page", () => {
  it("renders the 'Welcome the Storify platform' text", () => {
    render(<Home />);
    expect(screen.getByText(/Welcome the Storify platform/i)).toBeInTheDocument;
  });
});
