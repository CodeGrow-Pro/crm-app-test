const UserModel = require('../../models/user.model');
const { mockRequest, mockResponse } = require('../interceptor')
const { findById } = require('../../controllers/findById.controller');

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

xdescribe('findById', () => {
    it('error case', async () => {
        // Arrange
        const req = mockRequest();
        const res = mockResponse();
        req.params.userId = "1";
        jest.spyOn(UserModel, 'find').mockImplementation(() => ({
            exec: jest.fn().mockImplementation(() => { throw new Error('Error occurred') })
        }))

        // Act
        await findById(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Some internal error occured"
            })
        )

    })

    it('success case', async () => {
        // Arrange
        const req = mockRequest();
        const res = mockResponse();
        req.params.userId = "1";
        jest.spyOn(UserModel, 'find').mockImplementation(() => ({
            exec: jest.fn().mockImplementation(() => [testPayload])
        }))

        // Act
        await findById(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    userType: 'CUSTOMER',
                    name: "Test",
                    userId: "1",
                    email: 'test@relevel.com',
                    userStatus: 'PENDING',
                })
            ])

        )

    })

    it('empty case', async () => {
        // Arrange
        const req = mockRequest();
        const res = mockResponse();
        const mockId = "1";
        req.params.userId = mockId;
        jest.spyOn(UserModel, 'find').mockImplementation(() => ({
            exec: jest.fn().mockImplementation(() => null)
        }))

        // Act
        await findById(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: `User with this id [${mockId}] is not present`
            })

        )

    })
})