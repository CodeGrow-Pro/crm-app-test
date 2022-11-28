const authController = require('../controllers/auth.controller');
const findAllController = require('../controllers/findAll.controller');
const ticketController = require('../controllers/ticket.controller');
const validator = require('../utils/validateToken');
const {isAdmin} = require('../utils/isAdmin');
const validateTicket = require('../utils/validateTicketStatus');
const {validateStatus} = require('../utils/validateStatus');

module.exports = function(router){
    router.use((req, res, next) => {
        console.log(req.query)
        next()
    })
    router.post("/crm/api/v1/auth/signup", authController.signup);

    router.post("/crm/api/v1/auth/signin", authController.signin);

    // crm/api/v1/users?userType=CUSTOMER&userStatus=APPROVED&name=Test
    router.get("/crm/api/v1/users", validator.verifyToken, isAdmin, findAllController.findAll);

    router.post("/crm/api/v1/tickets", validator.verifyToken, validateTicket.validateTicketRequestBody, ticketController.createTicket);

    router.get("/crm/api/v1/tickets", validator.verifyToken, ticketController.getAllTickets);

    router.get("/crm/api/v1/tickets/:id", validator.verifyToken, ticketController.getTicketById);

    router.put("/crm/api/v1/tickets/:id", validator.verifyToken, validateStatus, ticketController.updateTicket);
}

