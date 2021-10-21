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

describe("LoginPage", () => {
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

  test("press login button", async () => {
    const { getByTestId } = render(Wrapper(<LoginPage />));

    const button = getByTestId("login-page-button");
    const username = getByTestId("login-page-username");
    const password = getByTestId("login-page-password");
    global.window = { location: { pathname: null } };

    fireEvent.change(username, { target: { value: "admin" } });
    fireEvent.change(password, { target: { value: "admin123" } });

    mockAxios.get.mockResolvedValueOnce(() => {
      {
        data: [
          {
            id: 1,
            lab_group_name: "CS1",
            course: 1,
          },
        ];
      }
    });

    mockAxios.get.mockResolvedValueOnce(() => {
      {
        data: [
          {
            id: 1,
            course_code: "CZ3001",
            course_name: "Software Engineering",
          },
        ];
      }
    });

    mockAxios.post.mockResolvedValueOnce(() => {
      {
        data: [
          {
            username: username.value,
            password: password.value,
          },
        ];
      }
    });

    jest.spyOn(window.localStorage.__proto__, "setItem");
    window.localStorage.__proto__.setItem = jest.fn();

    fireEvent.click(button);

    // expect(username.value).toBe("");
    // expect(password.value).toBe("");
    await waitFor(() => expect(global.window.location.pathname).toBe("/home"));
  });

  test("error inputs", () => {});
});
