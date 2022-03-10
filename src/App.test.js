import React from "react";
import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { getHeroDetail } from "./api";

jest.mock("./api");

const SUPERMAN = {
  id: 1,
  name: "Superman",
  avatar:
    "https://cdn.theatlantic.com/thumbor/xuePShEYRyEQec_THgWcYFhYLnw=/540x0:2340x1800/500x500/media/img/mt/2016/01/superman/original.jpg",
  description:
    "Superman is a fictional superhero. The character was created by writer Jerry Siegel and artist Joe Shuster, and first appeared in the comic book Action Comics #1 (cover-dated June 1938 and published April 18, 1938).[1] The character regularly appears in comic books published by DC Comics, and has been adapted to a number of radio serials, movies, and television shows.",
};

const renderApp = () => {
  render(<App />);
  const getInput = () => screen.getByLabelText(/search/i);
  const getSubmitButton = () => screen.getByRole("button", { name: /submit/i });

  return {
    getInput,
    getSubmitButton,
    runSearchJourney: async (name, pendingCallback) => {
      userEvent.type(getInput(), name);
      userEvent.click(getSubmitButton()); //input
      if (pendingCallback) pendingCallback();
      await waitForElementToBeRemoved(() => screen.getByText("loading"));
    },
  };
};

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should display input and submit button", () => {
    const { getInput, getSubmitButton } = renderApp();
    // test input existence
    getInput(); //input
    getSubmitButton();
    // get vs query
    // query ใช้เมื่อต้องการเทสว่า component นั้นไม่ได้อยู่ในหน้าจอ
  });

  it("should call get hero detail with name when submited", async () => {
    getHeroDetail.mockResolvedValue(SUPERMAN);
    const { getInput, getSubmitButton } = renderApp();

    userEvent.type(getInput(), "superman");
    userEvent.click(getSubmitButton()); //input

    await waitFor(() => {
      expect(getHeroDetail).toHaveBeenCalledWith("superman");
    });
  });

  it("should render loading while calling api", async () => {
    const { runSearchJourney } = renderApp();

    await runSearchJourney("superman", () => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    expect(getHeroDetail).toHaveBeenCalledWith("superman");
  });

  it("should render avatar name & description from api", async () => {
    const { runSearchJourney } = renderApp();

    await runSearchJourney("superman");

    screen.getByText(SUPERMAN.name);
    screen.getByText(SUPERMAN.description);
    screen.getByAltText(`Avatar of ${SUPERMAN.name}`);
  });
});
