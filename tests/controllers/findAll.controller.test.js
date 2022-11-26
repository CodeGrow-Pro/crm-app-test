const { mockRequest, mockResponse } = require('../interceptor');
const UserModel = require('../../models/user.model');
const { findAll } = require('../../controllers/findAll.controller');
const db = require('../db');

beforeAll(async () => db.connect());
beforeEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

const userTestPayload = [{
    name: 'Test',
    userId: '123',
    email: 'test@relevel.com',
    userType: 'CUSTOMER',
    userStatus: 'APPROVED'
}]

xdescribe("findAll", () => {
    it('should pass', async () => {
        // Arrange
        // Use mockimplemenation
        // return object using ({}) notation
        const userSpy = jest.spyOn(UserModel, 'find').mockImplementation(() => ({
            exec: jest.fn().mockReturnValue(Promise.resolve(userTestPayload))
        }))
        const req = mockRequest();
        const res = mockResponse();
        req.query = {};

        // Act
        await findAll(req, res);

        // Assert
        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Test',
                    userId: '123',
                    email: 'test@relevel.com',
                    userTypes: 'CUSTOMER',
                    userStatus: 'APPROVED'
                })
            ])
        )
    })

    it('should pass without data', async () => {
        // Arrange
        // Use mockimplemenation
        // return object using ({}) notation
        const userSpy = jest.spyOn(UserModel, 'find').mockImplementation(() => ({
            exec: jest.fn().mockReturnValue(Promise.resolve(null))
        }))
        const req = mockRequest();
        const res = mockResponse();
        req.query = {};

        // Act
        await findAll(req, res);

        // Assert
        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(
            {
                message: `User not present`
            }
        )
    })
})