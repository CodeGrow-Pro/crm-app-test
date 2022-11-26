const { signin, signup } = require('../../controllers/auth.controller');
const UserModel = require('../../models/user.model');
const { mockRequest, mockResponse } = require('../interceptor')
const { connect, clearDatabase, closeDatabase } = require('../db');
var bcrypt = require("bcryptjs");

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

beforeAll(async () => await connect());
beforeEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

xdescribe('signup', () => {
    it('success', async () => {
        // Arrange
        const req = mockRequest();
        const res = mockResponse();
        req.body = testPayload;

        // Act
        await signup(req, res);

        // Assert
        expect(res.status).toBeCalledWith(201);
        expect(res.send).toBeCalledWith(
            expect.objectContaining({
                userType: 'CUSTOMER',
                name: "Test",
                userId: "1",
                email: 'test@relevel.com',
                userStatus: 'PENDING',
            })
        )
    })

    it('return error', async () => {
        // Arrange
        const req = mockRequest();
        const res = mockResponse();
        req.body = testPayload;
        const spy = jest.spyOn(UserModel, 'create').mockImplementation(() => { throw new Error('Error occurred'); })

        // Act
        await signup(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(spy).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(
            {
                message: "Some internal error while inserting the element"
            }
        )
    })
})

xdescribe('signin', () => {
    it('successful login', async () => {
        // Arrange
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            userId: 'test',
            password: 'pwd'
        };
        testPayload.userStatus = 'APPROVED';
        const spy = jest.spyOn(UserModel, 'findOne').mockReturnValue(Promise.resolve(testPayload));
        const bcryptSpy = jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
        // Act
        await signin(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(spy).toHaveBeenCalled();
        expect(bcryptSpy).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                userTypes: 'CUSTOMER',
                name: "Test",
                userId: "1",
                email: 'test@relevel.com',
                userStatus: 'APPROVED',
            })
        )
    })
})