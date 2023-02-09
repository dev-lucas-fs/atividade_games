import prisma from "config/database";
import { faker } from "@faker-js/faker"

export function createGame(consoleId: number, title?: string) {
    return prisma.game.create({
        data: {
            title: title || faker.animal.rodent(),
            consoleId: consoleId
        }
    });
}

export function findManyGames() {
    return prisma.game.findMany({
        include: {
            Console: true
        }
    });
}

