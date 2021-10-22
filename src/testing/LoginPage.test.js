import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  within,
  screen,
} from "@testing-library/react";
import Wrapper from "../custom-render";
import LoginPage from "../components/LoginPage";
import mockAxios from "../__mocks__/axios";
import LoginDataService from "../service/login-http";

jest.mock("axios");

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

  test("initialization", async () => {
    render(Wrapper(<LoginPage />));

    await waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(2));
    expect(mockAxios.get).toHaveBeenCalledWith("/group/");
    expect(mockAxios.get).toHaveBeenCalledWith("/course/");
  });

  test("successful login", async () => {
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
    const { getByTestId } = render(Wrapper(<LoginPage />));

    const username = getByTestId("login-page-username");
    const password = getByTestId("login-page-password");
    const login_button = getByTestId("login-button");

    fireEvent.change(username, { target: { value: "admin" } });
    fireEvent.change(password, { target: { value: "admin123" } });
    fireEvent.click(login_button);

    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith("/token/", {
      username: username.value,
      password: password.value,
    });
  });

  test("invalid username", async () => {
    mockAxios.post.mockRejectedValue(
      new Error(
        JSON.stringify({
          data: {
            detail: "No active account found with the given credentials",
          },
        })
      )
    );
    const { getByTestId } = render(Wrapper(<LoginPage />));

    const username = getByTestId("login-page-username");
    const password = getByTestId("login-page-password");

    fireEvent.change(username, { target: { value: "admindoesnotexist" } });
    //invalid username
    fireEvent.change(password, { target: { value: "admin123" } });
    try {
      LoginDataService.postToken({
        username: username.value,
        password: password.value,
      });
    } catch (e) {
      expect(e.toString()).toMatch(
        JSON.stringify({
          data: {
            detail: "No active account found with the given credentials",
          },
        })
      );
    }

    expect(mockAxios.post).toHaveBeenCalledTimes(1);
  });

  test("invalid password", async () => {
    mockAxios.post.mockRejectedValue(
      new Error(
        JSON.stringify({
          data: {
            detail: "No active account found with the given credentials",
          },
        })
      )
    );
    const { getByTestId } = render(Wrapper(<LoginPage />));

    const username = getByTestId("login-page-username");
    const password = getByTestId("login-page-password");

    fireEvent.change(username, { target: { value: "admin" } });
    //invalid password
    fireEvent.change(password, { target: { value: "admin12" } });
    try {
      LoginDataService.postToken({
        username: username.value,
        password: password.value,
      });
    } catch (e) {
      expect(e.toString()).toMatch(
        JSON.stringify({
          data: {
            detail: "No active account found with the given credentials",
          },
        })
      );
    }

    expect(mockAxios.post).toHaveBeenCalledTimes(1);
  });

  test('admin ui', () => {
    
  })

});
