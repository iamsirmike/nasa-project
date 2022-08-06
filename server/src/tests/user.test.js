const app = require("../../app");
const request = require("supertest");
const { mongoConnect, mongoDisconnect } = require("../services/mongo");

describe("Authentication API test", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test POST createUser", () => {
    test("Create user should pass", async () => {
      const userData = {
        userId: "20000",
        userName: "iniesta340",
        password: "12345",
      };
      const response = await request(app)
        .post("/auth/createUser")
        .send(userData)
        .expect(409);
    });
  });
});
