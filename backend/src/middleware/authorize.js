const authorize = (
    ...allowedRoles
) => {
    return (
        req,
        res,
        next
    ) => {
        /*
            =========================================
            USER MUST FIRST BE AUTHENTICATED
            =========================================
        */

        if (!req.user) {
            return res.status(401).json({
                code:
                    "AUTHENTICATION_REQUIRED",

                message:
                    "Authentication required",
            });
        }


        /*
            =========================================
            VERIFY ROLE

            Example:

            authorize("admin")

            Trainer:
                trainer !== admin
                => 403

            Trainee:
                trainee !== admin
                => 403

            Admin:
                admin === admin
                => allowed
            =========================================
        */

        if (
            !allowedRoles.includes(
                req.user.role
            )
        ) {
            return res.status(403).json({
                code:
                    "ROLE_ACCESS_DENIED",

                message:
                    "Access denied. Your account does not have permission to access this area.",
            });
        }


        next();
    };
};


module.exports = authorize;