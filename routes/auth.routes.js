const authController = require('../controllers/auth.controller');
const findAllController = require('../controllers/findAll.controller');
const findByIdController = require('../controllers/findById.controller');
const updateController = require('../controllers/update.controller');
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

    // Users
    router.get("/crm/api/v1/users", validator.verifyToken, isAdmin, findAllController.findAll);

    router.get("/crm/api/v1/users/:userId", validator.verifyToken, isAdmin, findByIdController.findById);

    router.put("/crm/api/v1/users/:userId", validator.verifyToken, isAdmin, updateController.update);

    // Tickets
    router.post("/crm/api/v1/tickets", validator.verifyToken, validateTicket.validateTicketRequestBody, ticketController.createTicket);

    router.get("/crm/api/v1/tickets", validator.verifyToken, ticketController.getAllTickets);

    router.get("/crm/api/v1/tickets/:id", validator.verifyToken, ticketController.getTicketById);

    router.put("/crm/api/v1/tickets/:id", validator.verifyToken, validateStatus, ticketController.updateTicket);
}

