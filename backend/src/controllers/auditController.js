const AuditLog =
    require("../models/AuditLog");


const getAuditLogs =
    async (req, res) => {
        try {
            const page =
                Math.max(
                    Number.parseInt(
                        req.query.page,
                        10
                    ) || 1,
                    1
                );


            const limit =
                Math.min(
                    Math.max(
                        Number.parseInt(
                            req.query.limit,
                            10
                        ) || 50,
                        1
                    ),
                    100
                );


            const filter = {};


            if (
                req.query.action
            ) {
                filter.action =
                    req.query.action;
            }


            if (
                req.query.status
            ) {
                filter.status =
                    req.query.status;
            }


            if (
                req.query.role
            ) {
                filter.role =
                    req.query.role;
            }


            const [
                logs,
                total,
            ] =
                await Promise.all([
                    AuditLog.find(
                        filter
                    )
                        .sort({
                            createdAt: -1,
                        })
                        .skip(
                            (page - 1) *
                            limit
                        )
                        .limit(
                            limit
                        )
                        .lean(),

                    AuditLog.countDocuments(
                        filter
                    ),
                ]);


            return res
                .status(200)
                .json({
                    logs,

                    pagination: {
                        page,
                        limit,
                        total,

                        totalPages:
                            Math.ceil(
                                total /
                                limit
                            ),
                    },
                });

        } catch (error) {
            console.error(
                "Get audit logs error:",
                error.message
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to load audit logs",
                });
        }
    };


module.exports = {
    getAuditLogs,
};