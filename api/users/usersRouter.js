const router = require("express").Router();
const Users = require("./users-model.js");
const validate = require("../validate.js");

router.get("/me", (req, res, next) => {
    const [authType, token] = req.headers.authorization.split(" ");
    
    Users.findAll()
        .then(users => {
            const filtered = users.filter(user => user.id === req.jwt.subject);
            const user = {
                ...filtered[0],
                token: token
            }
            res.status(200).json(user);
        })
        .catch(err => next({ code: 500, message: "Error retrieving user", err }));
});

router.use("/:id", validate.user);

/* router.get("/", (req, res, next) => {
    Users.findAll()
        .then(users => res.status(200).json(users))
        .catch(err => next({ code: 500, message: "Error retrieving users", err }));
}); */



router.get("/:id", (req, res, next) => {
    const user = req.user;
    res.status(200).json(user);
});


// Validate user before put and delete, only allow logged on user to edit or delete
// Can only edit or delete their own data/account

router.put("/:id", validate.loggedon, (req, res, next) => {
    const { id } = req.params;

    if(Object.keys(req.body).length === 0) {
        next({ code: 400, message: "Missing user data to update"})
    } else {
        const changes = req.body;
        changes.id  = id;
    
        Users.update(changes, id)
        .then(updated => {
            res.status(200).json(updated);
        })
        .catch(err => next({ code: 500, message: "Error updating user data", err }));
    }

    
});

router.delete("/:id", validate.loggedon, (req, res, next) => {
    const { id } = req.params;

    Users.remove(id)
        .then(() => res.status(204).end())
        .catch(err => next({ code: 500, message: "Error removing user data", err }));
});

module.exports = router;
