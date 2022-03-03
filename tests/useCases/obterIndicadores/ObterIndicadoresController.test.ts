import request from "supertest";

import { app } from "../../../src/shared/infra/http/app";

describe("Integração obter indicadores", () => {
  it("deve retornar indicadores", async () => {
    const response = await request(app).get("/indicadores");

    expect(response.body).toHaveProperty("pais");
    expect(response.body).toHaveProperty("estados");
  });
});
