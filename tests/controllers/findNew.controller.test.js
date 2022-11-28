const UserModel = require('../../models/user.model');
const { mockRequest, mockResponse } = require('../interceptor')
const { connect, clearDatabase, closeDatabase } = require('../db');
const { findAll } = require('../../controllers/findAll.controller');

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

xdescribe('findall', () => {
    it('find without filters', async () => {
        // Arrange
        const req = mockRequest();
        const res = mockResponse();
        req.query = {};
        const spy = jest.spyOn(UserModel, 'find')
            .mockImplementation(() => ({
                exec: jest.fn().mockReturnValue(Promise.resolve([testPayload]))
            }));

        // Act
        await findAll(req, res);

        // Assert
        expect(spy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    userTypes: 'CUSTOMER',
                    name: "Test",
                    userId: "1",
                    email: 'test@relevel.com',
                    userStatus: 'PENDING',
                })])
        )
    })
})