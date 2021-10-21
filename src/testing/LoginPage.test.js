import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import Wrapper from "../custom-render";
import LoginPage from "../components/LoginPage";
import mockAxios from "../__mocks__/axios";

jest.mock("axios");
global.window = { location: { pathname: null } };

describe("LoginPage", () => {
  beforeEach(() => {
    mockAxios.get.mockImplementation((url) => {
      switch (url) {
        case "/group/":
          return Promise.resolve({
            data: [
              {
                id: 1,
                lab_group_name: "CS1",
                course: 1,
              },
            ],
          });
        case "/course/":
          return Promise.resolve({
            data: [
              {
                id: 1,
                course_code: "CZ3001",
                course_name: "Software Engineering",
              },
            ],
          });
      }
    });
    mockAxios.post.mockImplementationOnce(() => {
      Promise.resolve({
        data: [
          {
            username: username.value,
            password: password.value,
          },
        ],
      });
    });
  });

  afterEach(() => {
    cleanup();
  });

  test("change input fields", () => {
    const { getByTestId } = render(Wrapper(<LoginPage />));

    const username = getByTestId("login-page-username");
    const password = getByTestId("login-page-password");

    expect(username.value).toBe("");
    expect(password.value).toBe("");

    fireEvent.change(username, { target: { value: "admin" } });
    expect(username.value).toBe("admin");

    fireEvent.change(password, { target: { value: "admin123" } });
    expect(password.value).toBe("admin123");
  });

  test("fetch lab groups", async () => {
    render(Wrapper(<LoginPage />));

    await waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(2));
    expect(mockAxios.get).toHaveBeenCalledWith("/group/");
    expect(mockAxios.get).toHaveBeenCalledWith("/course/");
  });

  test("post credentials", () => {
    const { getByTestId } = render(Wrapper(<LoginPage />));
    const login_button = getByTestId("login-button");
    const username = getByTestId("login-page-username");
    const password = getByTestId("login-page-password");

    fireEvent.change(username, { target: { value: "admin" } });
    fireEvent.change(password, { target: { value: "admin123" } });
    fireEvent.submit(login_button);

    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith("/token/", {
      username: username.value,
      password: password.value,
    });
  });

  test("submit form", async() => {
    const { getByTestId, queryByTestId } = render(Wrapper(<LoginPage/>));

    const username = getByTestId("login-page-username");
    const password = getByTestId("login-page-password");

    fireEvent.change(username, { target: { value: "admin" } });
    fireEvent.change(password, { target: { value: "admin123" } });
    
    const login_button = getByTestId("login-button");
    fireEvent.submit(login_button)

    // const logout_button = getByTestId("login-page-username");
    // await waitFor(() => expect(getByTestId("logout-button")).toBeInTheDocument())
    await waitFor(() => expect(queryByTestId("datatable")).toBeTruthy());
    // await waitFor(() => expect(username.value).toBe(""));
  });

  // test("error inputs", () => {});
});

// jest.spyOn(window.localStorage.__proto__, "setItem");
// window.localStorage.__proto__.setItem = jest.fn();
