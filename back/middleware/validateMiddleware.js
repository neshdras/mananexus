// Middleware générique de validation zod
function validateBody(schema){
    return (req, res, next) => {
        const result = schema.safeParse(req.body)
        if(!result.success)
            return res.status(422).json({
                title: "Data invalid",
                status: 422,
                invalidParams: result.error.issues.map(err => ({
                    path: err.path.join("."),
                    message: err.message
                }))
            })
        // Si on arrive ici, on a passé la validation on renvois les données sur body et on passe à la suite
        req.body = result.data
        next()
    }
}

module.exports = validateBody