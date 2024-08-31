const express = require("express");
const user_route = express();
const session = require("express-session");
const config = require("../config/config");
const auth = require("../middleware/auth");
user_route.set('view engine','ejs');
user_route.set('views','./frontend/views/pages');
const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
const path = require("path");
user_route.use(express.static('public'));


user_route.use(session({
  secret:config.sessionSecret,
  resave: false, // Add this line to set the resave option
 saveUninitialized: false, // Add this line to set the saveUninitialized option
}));

const multer = require("multer"); // Add multer for image upload

user_route.use(express.static('uploads'));
// Configure the storage engine for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
  cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
   cb(null, new Date().toISOString().replace(/:/g, '-')+ file.originalname);
    }
});

// Initialize the multer middleware
const upload = multer({ storage: storage });

const userController = require("../controllers/userController");
const { error } = require("console");

user_route.get('/sign-up',auth.isLogout,userController.loadRegister);

user_route.post('/sign-up',upload.single("image"),userController.registerUserAndSendVerificationEmail );

user_route.get('/verify',userController.verifyMail);

user_route.get('/',auth.isLogout,userController.loadHome);
user_route.get('/login',auth.isLogout,userController.loginLoad);

user_route.post('/login',userController.authenticateUserAndRedirect);

 user_route.get('/home',auth.isLogout,userController.loadHome);
 user_route.get('/dashboard',upload.single("image"),auth.isLogin,userController.loadDashboard);
 user_route.get('/myaccountPage',upload.single("image"),auth.isLogin,userController.loadMyaccount);
 

user_route.get('/logout',auth.isLogin,userController.userLogout);

user_route.get('/forget',auth.isLogout,userController.forgetLoad);

user_route.post('/forget',userController.forgetVerify);

user_route.get('/forget-password',auth.isLogout,userController.renderForgotPasswordPage);

user_route.post('/forget-password',userController.resetPassword);

user_route.get('/verification',auth.isLogout,userController.verificationLoad);
user_route.post('/verification',userController.resendVerificationEmail);

user_route.get('/profile',userController.loadProfile);

user_route.get('/edit',auth.isLogin, userController.renderEditProfilePage);
user_route.post('/edit',upload.single("image"), userController.updateProfile);
 user_route.post('/myaccountPage',upload.single("image"), userController.updateProfile);
 user_route.post('/myaccountPage',userController.UpdatePassword);

 //Report Page Route
 user_route.get('/reportPage', auth.isLogin, userController.getReportPage);
 //About Us Page Route
 user_route.get('/aboutUsPage', userController.getAboutUsPage)
 //About Us Page Route
 user_route.get('/faqPage', userController.getFaqPage)
 //Wallet Page Route
 user_route.get('/walletPage', auth.isLogin, userController.getWalletPage)
 //Categories Page Route
 user_route.get('/categoriesPage', auth.isLogin, userController.getCategoriesPage)
 //Privacy Policy Page Route
 user_route.get('/privacyPolicyPage', userController.getPrivacyPolicyPage)
 //Contact Us Page Route
 user_route.get('/contactUsPage', auth.isLogin, userController.getContactUsPage)

 //Route for Sending mail from Contact Us
 user_route.post("/sendMail", userController.sendingMail);

 //Route for Report HTML file
 user_route.get('/report', userController.getReportHTML)
 //Route for Report PDF file
 user_route.get('/generate_report', auth.isLogin, userController.getreportPDF)

 //user_route.get('/myaccountPage',auth.isLogin,userController.renderPasswordUpdatePage);
// user_route.post('/reset-password',userController.UpdatePassword);


module.exports = user_route;
