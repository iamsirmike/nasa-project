const request = require("supertest");
const app = require("../../../app");

describe("Test GET /planets", () => {
  test("It should return all planets", async () => {
    const response = await request(app).get("/planets").expect(200);
  });
});
