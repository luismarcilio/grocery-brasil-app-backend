import app from "../../src/presentation/express/app";
import * as request from "supertest";

describe("Express Functions", () => {
  describe("GET /secret", () => {
    it("return some secret", async () => {
      jest.setTimeout(30000);
      const path = "/secret/GEOLOCATION_API_KEY";
      const result = await request(app)
        .get(path)
        .set("Authorization", "Bearer " + "jwt");
      expect(result.status).toEqual(200);
      expect(result.body.secretValue).toMatch(/UNEKmxsDqwo/);
    });
  });
});
