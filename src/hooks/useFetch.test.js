import { renderHook, act } from "@testing-library/react-hooks";
import { createServer, Response } from "miragejs";

import useFetch from "./useFetch";

let server;
const apiClient = async () => {
  const response = await fetch("/api/users");
  const json = await response.json();
  if (response.ok) {
    return json;
  }

  return Promise.reject(json);
};

beforeEach(() => {
  server = createServer({
    routes() {
      this.namespace = "api";

      this.get("/users", () => {
        return ["Wadus", "John Doe", "Jane Wallaby"];
      });
    }
  });
  server.logging = false
});

afterEach(() => {
  server.shutdown();
});

it("should return initial state properly", () => {
  const { result } = renderHook(() => useFetch(apiClient));

  const [state] = result.current;
  expect(state).toEqual({
    status: "idle",
    data: null,
    error: null
  });
});

it("should return fetching state properly", async () => {
  const { result } = renderHook(() => useFetch(apiClient));
  const [, request] = result.current;

  act(() => request());

  expect(result.current[0]).toEqual({
    status: "fetching",
    data: null,
    error: null
  });
});

it("should return response state properly", async () => {
  const { result } = renderHook(() => useFetch(apiClient));
  const [, request] = result.current;

  await act(async () => await request());

  expect(result.current[0]).toEqual({
    status: "fetched",
    data: ["Wadus", "John Doe", "Jane Wallaby"],
    error: null
  });
});

it("should return error state properly", async () => {
  server.get("/users", () => {
    return new Response(
      422,
      { "Content-Type": "application/json" },
      { error: `Unknown error from database` }
    );
  });

  const { result } = renderHook(() => useFetch(apiClient));
  const [, request] = result.current;

  await act(async () => await request());

  expect(result.current[0]).toEqual({
    status: "errored",
    data: null,
    error: { error: `Unknown error from database` }
  });
});
