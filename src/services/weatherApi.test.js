import { createServer, Response } from "miragejs";

import weatherApi from "./weatherApi";

let server;

describe('weatherApi', () => {
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

  test("should fetch weather properly", async () => {
    const result = await weatherApi({ city: 'Madrid', country: 'es' });

    expect(result.weather).toBeDefined();
  });

  test("should catch errors properly", async () => {
    server.get("http://api.openweathermap.org/data/2.5/weather", () => {
      return new Response(
        422,
        { "Content-Type": "application/json" },
        { error: `Unknown error from database` }
      );
    });

    try {
      await weatherApi({ city: 'Wadus', country: 'es' });
    } catch (result) {
      expect(result.weather).not.toBeDefined();
      expect(result.error).toMatch(/error/);
    }
  });
})