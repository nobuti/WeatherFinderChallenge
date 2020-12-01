import { useReducer, useCallback } from "react";

export const useFetch = (request) => {
  const STATUS = {
    idle: "idle",
    fetching: "fetching",
    fetched: "fetched",
    errored: "errored"
  };

  const initialState = {
    data: null,
    error: null,
    status: STATUS.idle
  };

  const ACTIONS = {
    fetch: "fetch",
    error: "error",
    success: "success"
  };

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case ACTIONS.fetch: {
        if (action.options.keepPreviousData) {
          return { ...state, fetching: true };
        }

        return {
          status: STATUS.fetching,
          data: null,
          error: null
        };
      }

      case ACTIONS.error: {
        return {
          status: STATUS.errored,
          error: action.error,
          data: null
        };
      }

      case ACTIONS.success: {
        return {
          status: STATUS.fetched,
          error: null,
          data: action.data
        };
      }

      default:
        return state;
    }
  }, initialState);

  const fetch = useCallback(async (params = {}, options = { keepPreviousData: false }) => {
    dispatch({ type: ACTIONS.fetch, options });

    try {
      const response = await request(params);
      dispatch({ type: ACTIONS.success, data: response });
    } catch (error) {
      dispatch({ type: ACTIONS.error, error });
    }
  }, [ACTIONS.error, ACTIONS.fetch, ACTIONS.success, request]);

  return [state, fetch];
};

export default useFetch;
