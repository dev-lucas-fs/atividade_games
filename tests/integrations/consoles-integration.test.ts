import httpStatus from "http-status";
import supertest from "supertest";
import app from "../../src/app";
import { createConsole } from "../factories/console-factory";
import { createGame, findManyGames } from "../factories/game-factory";
import { faker } from "@faker-js/faker"
import { cleanDb } from "../helpers";

const server = supertest(app);

beforeAll(async () => {
    await cleanDb();   
})

beforeEach(async () => {
    await cleanDb();  
})

describe("GET /consoles", () => {

    const routePath = "/consoles";

    it("should respond with status 200 and empty array on body", async () => {
        const { body, statusCode } = await server.get(routePath);

        expect(body).toEqual([]);
        expect(statusCode).toBe(httpStatus.OK);
    });

    it("should respond with status 200 and one console in array on body", async () => {
        const console = await createConsole();

        const { body, statusCode } = await server.get(routePath);

        expect(body).toEqual([console]);
        expect(statusCode).toBe(httpStatus.OK);
    });
});

describe("GET /consoles:id", () => {

    const routePath = "/consoles/";

    it("should respond with status 404", async () => {
        const { statusCode } = await server.get(routePath + '0');

        expect(statusCode).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and console object on body", async () => {
        const console = await createConsole();

        const { body, statusCode } = await server.get(routePath + console.id);

        expect(body).toEqual(console);
        expect(statusCode).toBe(httpStatus.OK);
    });
});

describe("POST /consoles", () => {

    const routePath = "/consoles";

    it("should respond with status 409", async () => {

        const { name } = await createConsole();

        const { statusCode } = await server.post(routePath).send({
            name
        });

        expect(statusCode).toBe(httpStatus.CONFLICT);
    });

    it("should respond with status 422", async () => {
        const { statusCode } = await server.post(routePath).send({});

        expect(statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("should respond with status 201", async () => {
        const { statusCode } = await server.post(routePath).send({
            name: [faker.animal.bear(), '5000'].join(" ")
        });

        expect(statusCode).toBe(httpStatus.CREATED);
    });
});