const { mockRequest, mockResponse } = require('../interceptor');
const { signin, signup } = require('../../controllers/auth.controller');
const UserModel = require('../../models/user.model');
var bcrypt = require("bcryptjs");
const db = require('../db');

beforeAll(async () => db.connect());
beforeEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());


const testPayload = {
    userType: 'CUSTOMER',
    password: '1234',
    name: "Test",
    userId: "1",
    email: 'test@relevel.com',
    userStatus: 'PENDING',
    ticketsCreated: [],
    ticketsAssigned: []
}

describe('signup', () => {
    it('should pass', async () => {
        // Arrange
        const req = mockRequest();
        const res = mockResponse();
        req.body = testPayload;

        // Act
        await signup(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                userType: 'CUSTOMER',
                name: "Test",
                userId: "1",
                email: 'test@relevel.com',
                userStatus: 'PENDING',
            })
        )
    })

    it('should return error', async () => {
        // Arrange
        // throw a new error in mock implementation
        const spy = jest.spyOn(UserModel, 'create').mockImplementation(() => { throw new Error("This is an error.") });
        const req = mockRequest();
        const res = mockResponse();
        req.body = testPayload;

        // Act
        await signup(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            message: "Some internal error while inserting the element"
        });
    })

    // Try "Unit test for update pass" : exec()
    // expect.arrayContaining()
    // Promise.reject, Promise.resolve()
})