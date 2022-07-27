const app = require("../../../app");
const request = require("supertest");

describe("Test GET /launches", () => {
  test("It should return all launches", async () => {
    const response = await request(app).get("/launches").expect(200);
  });
});

describe("Test POST /launches", () => {
  const dataWithDate = {
    mission_name: "FalconSat",
    launch_date: "2006-03-24 05:00:00",
    planet_name: "Earth",
    rocket_type: "Merlin A",
  };

  const dataWithoutDate = {
    mission_name: "FalconSat",
    planet_name: "Earth",
    rocket_type: "Merlin A",
  };

  test("add a launch should be successful and return 200", async () => {
    // making the request is a supertest function
    const response = await request(app)
      .post("/launches")
      .send(dataWithDate)
      .expect("Content-Type", /json/)
      .expect(200);

    const requestDate = new Date(dataWithDate.launch_date).valueOf();
    const responseDate = new Date(response.body.launch_date).valueOf();

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
