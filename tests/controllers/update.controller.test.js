const UserModel = require('../../models/user.model');
const { mockRequest, mockResponse } = require('../interceptor')
const { update } = require('../../controllers/update.controller');

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

xdescribe('update', () => {
    it('error case', async () => {
        // Arrange
        const req = mockRequest();
        const res = mockResponse();
        req.params.userId = "1";
        jest.spyOn(UserModel, 'findOneAndUpdate').mockImplementation(() => ({
            exec: jest.fn().mockImplementation(() => {throw new Error('Error occurred')})
        }))

        // Act
        await update(req, res);

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
        jest.spyOn(UserModel, 'findOneAndUpdate').mockImplementation(() => ({
            exec: jest.fn().mockImplementation(() => testPayload)
        }))

        // Act
        await update(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: `User record has been updated successfully`
            })
        )

    })
})