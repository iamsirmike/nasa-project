const app = require("../../../app");
const request = require("supertest");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API test", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("It should return all launches", async () => {
      const response = await request(app).get("/launches").expect(200);
    });
  });

  describe("Test POST /launches", () => {
    const dataWithDate = {
      missionName: "We move to moon",
      launchDate: "2020-01-01T00:00:00.000Z",
      rocket: "FalconSat",
      target: "Kepler-1652 b",
    };

    const dataWithoutDate = {
      missionName: "We move to moon",
      rocket: "FalconSat",
      target: "Kepler-1652 b",
    };

    test("add a launch should be successful and return 200", async () => {
      // making the request is a supertest function
      const response = await request(app)
        .post("/launches")
        .send(dataWithDate)
        .expect("Content-Type", /json/)
        .expect(200);

      const requestDate = new Date(dataWithDate.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      //expect in this format is a jest matcher
      expect(requestDate).toBe(responseDate);

      expect(response.body).toMatchObject(dataWithDate);
    });
    test("catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(dataWithoutDate)
        .expect(400);

      //Expect the responsebody to strictly match the object
      expect(response.body).toStrictEqual({
        error: "Invalid data",
      });
    });
    test("catch invalid dates", () => {});
  });
});
