const request = require('supertest');

const User = require('../../models/user.model');
const app = require("../../server");
var jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");
const client = require("../../utils/NotificationClient").client;

const db = require('../db')
beforeAll(async () => {
    await db.clearDatabase();
    await User.create({
        name: "Vishwa",
        userId: 1, // It should be atleat 16, else will throw error
        email: "Kankvish@gmail.com",  // If we don't pass this, it will throw the error
        userType: "ENGINEER",
        password: "Welcome1",
        userStatus: "APPROVED"

    });

})
afterAll(async () => {
    await db.closeDatabase();
    app.close();
})

const api_endpoint = "/crm/api/v1/";

const ticketCreateTestPayload = {
    title: "Test",
    ticketPriority: 4,
    description: "Test",
    status: "OPEN",
    reporter: "1",
    assignee: "1",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    save: jest.fn()
}

let updateId;

describe('Post ticket Endpoints', () => {
    jest.spyOn(client, 'post').mockImplementation((url, args, cb) => cb("Test", null));

    var token = 'Bearer ' + jwt.sign({ id: 1 }, config.secret, {
        expiresIn: 120 // 2 minutes
    });

    it('should create', async () => {
        const res = await request(app)
            .post(api_endpoint + 'tickets/')
            .set("authorization", token)
            .send(ticketCreateTestPayload);
        updateId = res.body.id;
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(
            expect.objectContaining({
                title: "Test",
                ticketPriority: 4,
                description: "Test",
                status: "OPEN",
                reporter: "1",
                assignee: "1",
            })
        );
    })
});

describe('Put ticket Endpoints', () => {
    jest.spyOn(client, 'post').mockImplementation((url, args, cb) => cb("Test", null));

    var token = 'Bearer ' + jwt.sign({ id: 1 }, config.secret, {
        expiresIn: 120 // 2 minutes
    });

    it('should update', async () => {
        const res = await request(app)
            .put(api_endpoint + 'tickets/' + updateId)
            .set("authorization", token)
            .send(ticketCreateTestPayload);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                title: "Test",
                ticketPriority: 4,
                description: "Test",
                status: "OPEN",
                reporter: "1",
                assignee: "1",
            })
        );
    })
});

describe('Get all ticket Endpoints', () => {

    var token = 'Bearer ' + jwt.sign({ id: 1 }, config.secret, {
        expiresIn: 120 // 2 minutes
    });

    it('should get all', async () => {
        const res = await request(app)
            .get(api_endpoint + 'tickets')
            .set("authorization", token)
            .send();
        updateId = res.body[0].id;
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "Test",
                    ticketPriority: 4,
                    description: "Test",
                    status: "OPEN",
                    reporter: "1",
                    assignee: "1",
                })
            ])
        );
    })
});

describe('Get one ticket Endpoints', () => {

    var token = 'Bearer ' + jwt.sign({ id: 1 }, config.secret, {
        expiresIn: 120 // 2 minutes
    });

    it('should get one', async () => {
        const res = await request(app)
            .get(api_endpoint + 'tickets/' + updateId)
            .set("authorization", token)
            .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                title: "Test",
                ticketPriority: 4,
                description: "Test",
                status: "OPEN",
                reporter: "1",
                assignee: "1",
            })
        );
    })
});