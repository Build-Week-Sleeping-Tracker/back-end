const request = require("supertest");
const server = require("../api/server.js");
const db = require("../data/dbConfig.js");

const testUser = {
    fname: "Test",
    lname: "Tester",
    email: "tester@testing.com",
    username: "tester",
    password: "1234"
}
let token = null;

describe("Sleep Entries Router", () => {
    

    it("creates test user", async () => {
        const res = await request(server).post("/api/auth/register")
                            .send(testUser);
        token = res.body.token;
    });

    describe("GET /api/sleep", () => {
        let res = {};
        beforeAll(async () => {
            res = (await request(server).get("/api/sleep").auth(token, {type: "bearer"}));
        });
        
        test("should return status 200 OK", () => {
            expect(res.status).toBe(200);
        });

        test("should return an array", () => {
            expect(res.body).toBeInstanceOf(Array);
        });

        test("Sleep Entry Array Should have length of 0", () => {
            expect(res.body).toHaveLength(0);
        });
    });

    describe("POST /api/sleep", () => {
        let res = {};
        beforeAll(async () => {
            res = (await request(server).post("/api/sleep")
                    .auth(token, {type: "bearer"})
                    .send({
                        "sleep_start": Date.now(),
                        "daytime_mood": 3,
                        "sleep_start_mood": 1
                    }));
        });

        test("should return status 201 Created", () => {
            expect(res.status).toBe(201);
        });

        test("should return sleep entry object with user_id 1", () => {
            expect(res.body.user_id).toEqual(1);
        });
    });

    describe("GET /api/sleep/1", () => {
        let res = {};
        beforeAll(async () => {
            res = (await request(server).get("/api/sleep/1").auth(token, {type: "bearer"}));
        });
        
        test("should return status 200 OK", () => {
            expect(res.status).toBe(200);
        });

        test("should return an object with sleep_start property", () => {
            expect(res.body).toHaveProperty("sleep_start");
        })
    });

    

    describe("PUT /api/sleep/1", () => {
        let res = {};
        beforeAll(async () => {
            res = (await request(server).put("/api/sleep/1")
                    .auth(token, {type: "bearer"})
                    .send({
                        "sleep_end": Date.now() + (1000 * 60 * 60 * 8),
                        "sleep_end_mood": 4,
                    }));
        });

        test("should return status 200 OK", () => {
            expect(res.status).toBe(200);
        });

        test("should return object with sleep_time_total property not null", () => {
            expect(res.body.sleep_time_total).not.toBeNull();
        })
    });

    describe("DELETE /api/sleep/1", () => {
        let res = {};
        beforeAll(async () => {
            res = (await request(server).delete("/api/sleep/1")
                    .auth(token, {type: "bearer"}));
        });

        test("should return status 204 No Content", () => {
            expect(res.status).toBe(204);
        });

        test("should return status 404 Not Found", async () => {
            const res = (await request(server).get("/api/sleep/1").auth(token, {type: "bearer"}));

            expect(res.status).toBe(404);
        });
    });
   
    it("Cleans the entries table", async () => await db("entries").truncate());
    it("Cleans the users table", async () => await db("users").truncate());

});