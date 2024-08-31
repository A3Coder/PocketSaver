// middleware
const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is logged in, proceed to the next middleware/route
            next();
        } else {
            // User is not logged in, redirect to login page
            res.redirect('/login');
        }
    } catch (error) {
        console.error("isLogin Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (!req.session.user_id) {
            // User is not logged in, proceed to the next middleware/route
            next();
        } else {
            // User is logged in, redirect to home page
            res.redirect('/dashboard');
        }
    } catch (error) {
        console.error("isLogout Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    isLogin,
    isLogout
}
