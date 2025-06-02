const isAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({
            status: 'error',
            message: 'אין לך הרשאות מנהל'
        });
    }
    next();
};

export default isAdmin;