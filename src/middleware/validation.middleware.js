exports.validate = (schema, target = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[target], { abortEarly: false, stripUnknown: true });
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.details.map((d) => ({ field: d.path.join('.'), message: d.message })),
            });
        }
        req[target] = value;
        next();
    };
};