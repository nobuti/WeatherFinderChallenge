import React from 'react'
import { fireEvent, waitFor, render, screen } from '@testing-library/react'
import { createServer, Response } from "miragejs";

import App from './App'

describe('App', () => {
  let server;

  beforeEach(() => {
    server = createServer({
      routes() {
        this.get("http://api.openweathermap.org/data/2.5/weather", () => {
          return {
            "weather": [
              {
                "description": "clear sky"
              }
            ],
            "main": {
              "temp": 24,
              "humidity": 80
            },
            "sys": {
              "country": "ES",
            },
            "name": "Málaga"
          };
        });
      }
    });
    server.logging = false
  });

  afterEach(() => {
    server.shutdown();
  });

  test('render properly', () => {
    render(<App />)

    expect(screen.getByText(/Get Weather/)).toBeInTheDocument()
  })

  test('should show weather conditions properly', async () => {
    render(<App />)
    fireEvent.click(screen.getByText(/Get Weather/))

    await waitFor(() => expect(screen.getByText(/Get Weather/)).toBeEnabled())

    expect(screen.getByText(/Location/)).toBeInTheDocument()
    expect(screen.getByText(/Description/)).toBeInTheDocument()
    expect(screen.getByText(/Temperature/)).toBeInTheDocument()
    expect(screen.getByText(/Humidity/)).toBeInTheDocument()
  })

  test('should show location properly if country is missing', async () => {
    server.get("http://api.openweathermap.org/data/2.5/weather", () => {
      return {
        "weather": [
          {
            "description": "clear sky"
          }
        ],
        "main": {
          "temp": 24,
          "humidity": 80
        },
        "name": "Málaga"
      };
    });

    render(<App />)
    fireEvent.click(screen.getByText(/Get Weather/))

    await waitFor(() => expect(screen.getByText(/Get Weather/)).toBeEnabled())

    expect(screen.getByText(/Location/)).toBeInTheDocument()
  })

  test('should not show description if it is missing in the payload', async () => {
    server.get("http://api.openweathermap.org/data/2.5/weather", () => {
      return {
        "main": {
          "temp": 24,
          "humidity": 80
        },
        "name": "Málaga"
      };
    });

    render(<App />)
    fireEvent.click(screen.getByText(/Get Weather/))

    await waitFor(() => expect(screen.getByText(/Get Weather/)).toBeEnabled())

    expect(screen.queryByText(/Description/)).not.toBeInTheDocument()
  })

  test('should not show humidity if it is missing in the payload', async () => {
    server.get("http://api.openweathermap.org/data/2.5/weather", () => {
      return {
        "main": {
          "temp": 24
        },
        "name": "Málaga"
      };
    });

    render(<App />)
    fireEvent.click(screen.getByText(/Get Weather/))

    await waitFor(() => expect(screen.getByText(/Get Weather/)).toBeEnabled())

    expect(screen.queryByText(/Humidity/)).not.toBeInTheDocument()
  })

  test('should show error properly', async () => {
    server.get("http://api.openweathermap.org/data/2.5/weather", () => {
      return new Response(
        422,
        { "Content-Type": "application/json" },
        { code: 422, message: `Invalid api key` }
      );
    });

    render(<App />)
    fireEvent.click(screen.getByText(/Get Weather/))

    await waitFor(() => expect(screen.getByText(/Invalid api key/)).toBeInTheDocument())
  })
})