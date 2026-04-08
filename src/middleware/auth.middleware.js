const jwtService = require("../services/jwt.service");

exports.authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];

        const payload = jwtService.verifyAccessToken(token);

        req.user = payload;
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        // console.log("Acquired role is : "+ req.user.role, "Passing roles are: ", roles);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};


exports.authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        const user = req.user;

        const roles = await user.$relatedQuery('roles');
        const roleNames = roles.map(r => r.name);

        const hasAccess = allowedRoles.some(r => roleNames.includes(r));
        // console.log("User: ", user);
        if (!hasAccess) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
}