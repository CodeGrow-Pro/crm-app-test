const { mockRequest, mockResponse } = require("../interceptor")
const { createTicket, getAllTickets, getTicketById, updateTicket } = require('../../controllers/ticket.controller')
const User = require("../../models/user.model");
const Ticket = require("../../models/ticket.model");
const client = require("../../utils/NotificationClient").client;
const db = require('../db')

beforeAll(async () => await db.connect())
afterEach(async () => await db.clearDatabase())
afterAll(async () => await db.closeDatabase())

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

const userTestPayload = {
    userType: 'CUSTOMER',
    password: '1234',
    name: "Test",
    userId: "1",
    email: 'test@relevel.com',
    userStatus: 'PENDING',
    ticketsCreated: [],
    ticketsAssigned: [],
    save: jest.fn()
}

describe('ticketController.createTicket', () => {
    it("should pass", async () => {
        // Arrange
        const userSpy = jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve(userTestPayload));
        const clientSpy = jest.spyOn(client, 'post').mockImplementation((url, args, cb) => cb("Test", null));
        const req = mockRequest();
        const res = mockResponse();
        req.body = ticketCreateTestPayload;
        req.userId = "1";

        // Act
        await createTicket(req, res);

        // Assert
        expect(userSpy).toHaveBeenCalled();
        expect(clientSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                assignee: "1",
                description: "Test",
                reporter: "1",
                status: "OPEN",
                ticketPriority: 4,
                title: "Test",
            })
        );
    })

    it("should fail", async () => {
        // Arrange
        const userSpy = jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve(userTestPayload));
        const ticketSpy = jest.spyOn(Ticket, 'create').mockImplementation(cb => cb(new Error('This is an error'), null));
        const req = mockRequest();
        const res = mockResponse();
        req.body = ticketCreateTestPayload;
        req.userId = 1;

        // Act
        await createTicket(req, res);

        // Assert
        expect(userSpy).toHaveBeenCalled();
        expect(ticketSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Error in creating ticket'
            })
        );
    })
})

describe('ticketController.updateTicket', () => {
    it('should pass', async () => {
        // Arrange
        const ticketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(() => ({
            exec: jest.fn().mockReturnValue(Promise.resolve(ticketCreateTestPayload))
        }))
        const userSpy = jest.spyOn(User, 'findOne').mockImplementation(() => ({
            exec: jest.fn().mockReturnValue(Promise.resolve(userTestPayload))
        }))
        const clientSpy = jest.spyOn(client, 'post').mockImplementation((url, args, cb) => cb("Test", null));
        const req = mockRequest();
        const res = mockResponse();
        req.body = ticketCreateTestPayload;
        req.userId = 1;
        ticketCreateTestPayload.save.mockReturnValue(ticketCreateTestPayload);

        // Act
        await updateTicket(req, res);

        // Assert
        expect(userSpy).toHaveBeenCalled();
        expect(ticketSpy).toHaveBeenCalled();
        expect(clientSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Test",
                ticketPriority: 4,
                description: "Test",
                status: "OPEN",
                reporter: "1",
                assignee: "1",
            })
        )
    })

    it('should fail', async () => {
        // Arrange
        const ticketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(() => ({
            exec: jest.fn().mockReturnValue(Promise.resolve(ticketCreateTestPayload))
        }));
        userTestPayload.userId = "2";
        const userSpy = jest.spyOn(User, 'findOne').mockImplementation(() => ({
            exec: jest.fn().mockReturnValue(Promise.resolve(userTestPayload))
        }))
        const req = mockRequest();
        const res = mockResponse();
        req.body = ticketCreateTestPayload;
        req.userId = 1;

        // Act
        await updateTicket(req, res);

        // Assert
        expect(userSpy).toHaveBeenCalled();
        expect(ticketSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            message: 'User is not authorized for update to the ticket'
        })
    })
})

describe('ticketController.getAllTickets', () => {
    it('success', async () => {
        // Arrange
        const userSpy = jest.spyOn(User, 'findOne').mockImplementation(() => ({
            exec: jest.fn().mockReturnValue(Promise.resolve(userTestPayload))
        }))
        const ticketSpy = jest.spyOn(Ticket, 'find').mockImplementation(() => ({
            exec: jest.fn().mockReturnValue(Promise.resolve([ticketCreateTestPayload]))
        }))
        const req = mockRequest();
        const res = mockResponse();
        req.query = {};

        // Act
        await getAllTickets(req, res);

        // Assert
        expect(userSpy).toHaveBeenCalled();
        expect(ticketSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
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
        )
    })
})

describe('ticketController.getOneTicket', () => {
    it('success', async () => {
        // Arrange
        const ticketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(() => ({
            exec: jest.fn().mockReturnValue(Promise.resolve(ticketCreateTestPayload))
        }))
        const req = mockRequest();
        const res = mockResponse();
        req.params = { id: "1" };

        // Act
        await getTicketById(req, res);

        // Assert
        expect(ticketSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Test",
                ticketPriority: 4,
                description: "Test",
                status: "OPEN",
                reporter: "1",
                assignee: "1",
            })
        )
    })
})