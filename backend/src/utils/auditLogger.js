const AuditLog =
    require("../models/AuditLog");


// ======================================================
// GET CLIENT IP ADDRESS
// ======================================================

const getClientIp = (req) => {
    const forwardedFor =
        req.headers[
        "x-forwarded-for"
        ];


    if (forwardedFor) {
        return String(
            forwardedFor
        )
            .split(",")[0]
            .trim();
    }


    return (
        req.ip ||
        req.socket
            ?.remoteAddress ||
        ""
    );
};


// ======================================================
// CREATE SAFE TARGET USER DATA
//
// Never save passwords or password hashes.
// ======================================================

const buildTargetUserDetails = (
    targetUser
) => {
    if (!targetUser) {
        return null;
    }


    return {
        id:
            targetUser._id
                ?.toString?.() ||
            targetUser.id ||
            null,

        firstName:
            targetUser.firstName ||
            "",

        lastName:
            targetUser.lastName ||
            "",

        fullName:
            `${targetUser.firstName || ""} ${targetUser.lastName || ""}`
                .trim(),

        username:
            targetUser.username ||
            "",

        email:
            targetUser.email ||
            "",

        role:
            targetUser.role ||
            "",

        status:
            targetUser.status ||
            "",

        accountStatus:
            targetUser.accountStatus ||
            "",
    };
};


// ======================================================
// WRITE AUDIT LOG
//
// user = person performing the operation
// targetUser = person affected by the operation
// ======================================================

const writeAuditLog = async ({
    req,

    user = null,

    username = "",

    role = "unknown",

    action,

    status,

    targetUser = null,

    details = {},
}) => {
    try {
        const safeDetails = {
            ...details,
        };


        // ==================================================
        // ADD TARGET USER INFORMATION
        // ==================================================

        const targetDetails =
            buildTargetUserDetails(
                targetUser
            );


        if (targetDetails) {
            safeDetails.targetUser =
                targetDetails;
        }


        // ==================================================
        // CREATE LOG
        // ==================================================

        await AuditLog.create({
            // Person who performed action
            user:
                user?._id ||
                user?.id ||
                null,

            username:
                String(
                    user?.username ||
                    username ||
                    ""
                )
                    .trim()
                    .toLowerCase(),

            role:
                user?.role ||
                role ||
                "unknown",

            action,

            status,

            ipAddress:
                getClientIp(
                    req
                ),

            userAgent:
                req.get(
                    "user-agent"
                ) || "",

            details:
                safeDetails,
        });

    } catch (error) {
        /*
            Audit logging should never break
            the main application operation.
        */

        console.error(
            "Audit log write error:",
            error.message
        );
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    writeAuditLog,
};