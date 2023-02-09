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

describe("GET /games", () => {

    const routePath = "/games";

    it("should respond with status 200 and empty array on body", async () => {
        const { body, statusCode } = await server.get(routePath);

        expect(body).toEqual([]);
        expect(statusCode).toBe(httpStatus.OK);
    });

    it("should respond with status 200 and one game in array on body", async () => {
        const { id } = await createConsole();
        await createGame(id);

        const games = await findManyGames()

        const { body, statusCode } = await server.get(routePath);

        expect(body).toEqual(games);
        expect(statusCode).toBe(httpStatus.OK);
    });
});

describe("GET /games:id", () => {

    const routePath = "/games/";

    it("should respond with status 404", async () => {
        const { statusCode } = await server.get(routePath + '0');

        expect(statusCode).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and game object on body", async () => {
        const { id } = await createConsole();
        const game = await createGame(id);

        const { body, statusCode } = await server.get(routePath + game.id);

        expect(body).toEqual(game);
        expect(statusCode).toBe(httpStatus.OK);
    });
});

describe("POST /games", () => {

    const routePath = "/games";

    it("should respond with status 409", async () => {

        const { id } = await createConsole();
        const { title } = await createGame(id);

        const { statusCode } = await server.post(routePath).send({
            consoleId: id, 
            title
        });

        expect(statusCode).toBe(httpStatus.CONFLICT);
    });

    it("should respond with status 422", async () => {
        const { id } = await createConsole();

        const { statusCode } = await server.post(routePath).send({
            consoleId: id, 
        });

        expect(statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("should respond with status 201", async () => {
        const { id } = await createConsole();

        const { statusCode } = await server.post(routePath).send({
            consoleId: id, 
            title: [faker.animal.bear(), faker.color.human()].join(" ")
        });

        expect(statusCode).toBe(httpStatus.CREATED);
    });
});