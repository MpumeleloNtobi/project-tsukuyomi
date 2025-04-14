import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home Page", () => {
  it("renders the 'Welcome to the Storify platform' text", () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to the Storify platform/i)).toBeInTheDocument();
  });
});
