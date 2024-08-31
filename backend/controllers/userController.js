// Import required modules and libraries
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const config = require("../config/config");
const randomstring = require("randomstring");
const moment = require("moment"); // For handling timestamps
const puppeteer = require('puppeteer') //For PDF Generation
const path = require('path')

// Hashes a password using bcrypt
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

// Sends an email using Nodemailer
const sendEmail = async (name, email, subject, content) => {
  try {
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });

    // Email options
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: subject,
      html: content,
    };

    // Send the email and log the response
    const info = await transporter.sendMail(mailOptions);
    console.log("Email has been sent:", info.response);
  } catch (error) {
    console.log(error.message);
  }
};

// ... Other utility functions ...

// Email id verification mail send function
const sendVerifyMail = async (name, email, user_id) => {
  const subject = "For Verification mail";

  // Generate a random token for verification
  const randomToken = randomstring.generate();

  // Calculate the expiry time (e.g., 24 hours from now)
  const expiryTime = moment().add(2, "minutes");

  // Save the token and expiry time to the user's data
  await User.updateOne(
    { _id: user_id },
    {
      $set: {
        verificationToken: randomToken,
        verificationTokenExpiry: expiryTime,
      },
    }
  );

  const content = `<p>Hii ${name}, please click here to <a href="http://127.0.0.1:3000/verify?id=${user_id}&token=${randomToken}">Verify</a> your mail.</p>`;
  await sendEmail(name, email, subject, content);
};

// Password reset mail send function
const sendResetPasswordMail = async (name, email, randomToken) => {
  const subject = "For Reset Password";
  const content = `<p>Hii ${name}, please click here to <a href="http://127.0.0.1:3000/forget-password?token=${randomToken}">Reset</a> your password.</p>`;
  await sendEmail(name, email, subject, content);
};

// Strong password check fuction
const isStrongPassword = (password) => {
  const hasLetter = /[a-z]/.test(password);
  const hasCapitalLetter = /[A-Z]/.test(password);
  const hasSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasMinimumLength = password.length >= 8;

  return (
    hasLetter &&
    hasCapitalLetter &&
    hasSpecialCharacter &&
    hasNumber &&
    hasMinimumLength
  );
};

//User find by email id function
const getUserByEmail = async (email) => {
  return await User.findOne({ email: email });
};

//User Signup methods started here!

//Sign-up page loading code
const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error.message);
  }
};

// User Data save in Database after succsseful registration and check user's existed or not

const registerUserAndSendVerificationEmail = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    // const image = req.file.filename
    // const imageFile = req.file;
    const password = req.body.password;

    // Email validation check
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.match(emailPattern)) {
      return res.render("registration", {
        message: "Please enter a valid email address.",
      });
    }

    // Mobile number validation check
    const mobilePattern = /^\d{10}$/;
    if (!mobile.match(mobilePattern)) {
      return res.render("registration", {
        message:
          "Mobile number must be exactly 10 digits long and contain only numeric characters.",
      });
    }

    //validate password requirement
    if (!isStrongPassword(password)) {
      return res.render("registration", {
        message:
          "Password must contain at least one letter, one capital letter, one number, one special character, and be at least 8 characters long.",
      });
    }

    // Check if an image was uploaded
    // if (!imageFile) {
    //   return res.render("registration", {
    //     message: "Please upload an image.",
    //   });
    // }

    // Hash the password
    const spassword = await securePassword(req.body.password);

    // Create a new User instance
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      // image: imageFile.filename, // Save the image filename
      password: spassword,
      is_admin: 0,
    });

    // Check if the email is already registered
    const userData1 = await User.findOne({ email: req.body.email });
    if (userData1) {
      // res.status(200).send({success:false,msg:"This email is already exists"});
      res.render("registration", { message: "This email is already exist." });
    } else {
      // Save the user and send verification email
      const userData = await user.save();
      sendVerifyMail(req.body.name, req.body.email, userData._id); //   Verification mail send
      res.render("registration", {
        message:
          "Your registration has been successfully. Please verify your email.",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Mail verification link re-send function
// const verifyMail = async (req, res) => {
//   try {
//     const updateInfo = await User.updateOne(
//       { _id: req.query.id },
//       { $set: { is_varified: 1 } }
//     );

//     console.log(updateInfo);
//     res.render("login",{
//       message:"You Account is verified",
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

const verifyMail = async (req, res) => {
  try {
    const userId = req.query.id;
    const token = req.query.token;

    // Find the user based on the user_id
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.render("login", {
        message: "User not found",
      });
    }

    // Check if the token matches the user's verification token
    if (user.verificationToken !== token) {
      return res.render("login", {
        message: "Invalid token",
      });
    }

    // Check if the token has expired
    const currentTime = moment();
    const tokenExpiry = moment(user.verificationTokenExpiry);

    if (currentTime.isAfter(tokenExpiry)) {
      return res.render("login", {
        message: "The verification link has expired. Please request a new one.",
      });
    }

    // Update user's verification status
    const updateInfo = await User.updateOne(
      { _id: userId },
      { $set: { is_varified: 1 } }
    );

    console.log(updateInfo);

    return res.render("login", {
      message: "Your account has been verified",
    });
  } catch (error) {
    console.log(error.message);
    return res.render("login", {
      message: "An error occurred",
    });
  }
};



//Login user methods started

const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const authenticateUserAndRedirect = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await getUserByEmail(email);

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_varified === 0) {
          res.render("login", { message: "Please verify your mail." });
        } else {
          req.session.user_id = userData._id;

          res.redirect("/dashboard");
        }
      } else {
        res.render("login", { message: "Email and password is incorred" });
      }
    } else {
      res.render("login", { message: "Email and password is incorred" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Dashboard / home page Loading methods start here
const loadHome = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error.message);
  }
};
const loadDashboard = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    res.render("dashboard", { user: userData });
  } catch (error) {
    console.log(error.message);
  }
};

const loadMyaccount = async (req, res) => {
  try {


    const userData = await User.findById({ _id: req.session.user_id });
    res.render("myaccountPage", { user: userData });
  } catch (error) {
    console.log(error.message);
  }
};

// user profile
const loadProfile = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    res.render("profile", { user: userData });
    //res.render('profile');
  } catch (error) {
    console.log(error.message);
  }
};

// user logout code here
const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

//Forget password code start

const forgetLoad = async (req, res) => {
  try {
    res.render("forget");
  } catch (error) {
    console.log(error.message);
  }
};

const forgetVerify = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await getUserByEmail(email);

    if (userData) {
      if (userData.is_varified === 0) {
        res.render("forget", { message: "Please verify your mail." });
      } else {
        const randomString = randomstring.generate();

        // Calculate the expiry time (5 minutes from now)
        const expiryTime = moment().add(5, "minutes");

        const updatedData = await User.updateOne(
          { email: email },
          { $set: { token: randomString, expiryToken: expiryTime } }
        );

        // Send the reset password email
        sendResetPasswordMail(userData.name, userData.email, randomString);

        // Render success message after sending the email
        res.render("forget", {
          message: "Please check your mail to reset your password.",
        });
      }
    } else {
      res.render("forget", { message: "User email is incorrect." });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const renderForgotPasswordPage = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });

    if (tokenData) {
      const currentTime = moment();
      if (
        tokenData.expiryToken &&
        currentTime.isBefore(tokenData.expiryToken)
      ) {
        res.render("forget-password", { user_id: tokenData._id });
      } else {
        res.render("404", { message: "Token has expired" });
      }
    } else {
      res.render("404", { message: "Token is invalid" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const user_id = req.body.user_id;

    if (!isStrongPassword(password)) {
      const userData = await User.findById({ _id: user_id });
      return res.render("forget-password", {
        user_id: user_id,
        user: userData,
        message:
          "Password must contain at least one letter, one capital letter, one number, one special character, and be at least 8 characters long.",
      });
    }

    const secure_password = await securePassword(password);

    const updatedData = await User.findOneAndUpdate(
      { _id: user_id },
      { $set: { password: secure_password, token: "" } }
    );

    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

//for verification send mail link

const verificationLoad = async (req, res) => {
  try {
    res.render("verification");
  } catch (error) {
    console.log(error.message);
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await getUserByEmail(email);

    if (userData) {
      sendVerifyMail(userData.name, userData.email, userData._id);
      res.render("verification", {
        message: "Resend verification mail sent your email id, please check. ",
      });
    } else {
      res.render("verification", { message: "This email is not exist." });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// user profile edit & update

const renderEditProfilePage = async (req, res) => {
  try {
    const id = req.query.id;

    const userData = await User.findById({ _id: id });

    if (userData) {
      res.render("edit", { user: userData });
    } else {
      res.redirect("/dashboard");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    if (req.file) {
      const userData = await User.findByIdAndUpdate(
        { _id: req.body.user_id },
        {
          $set: {
            name: req.body.name,
            mobile: req.body.mobile,
            image: req.file.filename,
          },
        }
      );
    } else {
      const userData = await User.findByIdAndUpdate(
        { _id: req.body.user_id },
        {
          $set: {
            name: req.body.name,

            mobile: req.body.mobile,
          },
        }
      );
    }
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// Render the password reset or update password page
const renderPasswordUpdatePage = async (req, res) => {
  try {
    const message = "";
    res.render("reset-password", { message });
  } catch (error) {
    console.log(error.message);
  }
};

// Handle password reset form submission
const UpdatePassword = async (req, res) => {
  try {
    const userId = req.session.user_id || "";
    const oldPassword = req.body.oldPassword || "";
    const newPassword = req.body.newPassword || "";
    const confirmPassword = req.body.confirmPassword || "";

    // Retrieve the user's data
    const user = await User.findById(userId);

    if (user) {
      // Check if the old password matches the stored password
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);

      if (passwordMatch) {
        // Validate the new passwords
        if (newPassword === confirmPassword) {
          if (!isStrongPassword(newPassword)) {
            return res.render("myaccountPage", {
              message:
                "Password must contain at least one letter, one capital letter, one number, one special character, and be at least 8 characters long.",
            });
          }

          // Hash the new password
          const newPasswordHash = await bcrypt.hash(newPassword, 10);

          // Update the user's password in the database
          await User.updateOne(
            { _id: userId },
            { $set: { password: newPasswordHash } }
          );
          req.session.destroy();
          res.render("login", {
            message: "Password updated successfully.",
          });

        } else {
          // res.render("myaccountPage", {
          //   message: "New passwords do not match.",
          // });
          res.redirect("/myaccountPage");
        }
      } else {
        // res.render("myaccountPage", { message: "Old password is incorrect." });
        res.redirect("/myaccountPage");
      }
    } else {
      res.redirect("/login"); // Handle the case where the user does not exist
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getReportPage = async (req, res) => {
  const userData = await User.findById({ _id: req.session.user_id });
  res.render("reportPage", { user: userData })
}

const getAboutUsPage = (req, res) => {
  res.render('aboutUsPage')
}

const getFaqPage = (req, res) => {
  res.render('faqPage')
}

const getWalletPage = async (req, res) => {
  const userData = await User.findById({ _id: req.session.user_id });
  res.render('walletPage', { user: userData })
}

const getCategoriesPage = async (req, res) => {
  res.render('categoriesPage')
}

const getPrivacyPolicyPage = async (req, res) => {
  res.render('privacyPolicyPage')
}

const getContactUsPage = async (req, res) => {
  res.render('contactUsPage')
}

const sendingMail = async (req, res) => {
  console.log(req.body);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abdultechnical.info@gmail.com",
      pass: "mgfunxyxxxxaqafd",
    },
  });
  const mailOption = {
    from: req.body.email,
    to: "aasifaliaadil786@gmail.com",
    subject: `New message from ${req.body.email}, ${req.body.name}`,
    // name: req.body.name,
    text: req.body.msg,
  };
  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error");
    } else {
      console.log("Email sent" + info.response);
      res.send("success");
    }
  });
}

const getReportHTML = async (req, res) => {
  // const user = {
  //   username: "Aasif Ali",
  //   emailId: "md.aasifaliaadil786@gmail.com"
  // }

  const user = {
    name: req.query.name,
    email: req.query.email
  }
  // const userData = await User.findById({ _id: req.session.user_id });
  res.render('reportPDF', { user: user })
}

const getreportPDF = async (req, res) => {
  try {
    // const ejs = fs.readFileSync(path.join(__dirname, 'views', 'reportPDF.ejs'), 'utf-8')
    const userData = await User.findById({ _id: req.session.user_id });

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(`${req.protocol}://${req.get('host')}/report?name=${userData.name}&email=${userData.email}`, {
      waitUntil: 'networkidle2'
    })

    await page.setViewport({ width: 1920, height: 1080 })

    const pdfName = new Date().getTime() + 'report.pdf'

    const pdfn = await page.pdf({ path: `${path.join(__dirname, '../../downloads', pdfName)}`, format: 'A4', printBackground: true, margin: { top: '10px', bottom: '10px' } })

    await browser.close()

    const pdfURL = `${path.join(__dirname, '../../downloads', pdfName)}`

    res.set({
      "Content-Type": "application/pdf",
    })

    console.log("Done")
    res.sendFile(pdfURL)
    // res.download(pdfURL)

  } catch (err) {
    console.log(err)
  }
}


// Export all the functions for use in other modules
module.exports = {
  loadRegister,
  registerUserAndSendVerificationEmail,
  verifyMail,
  loginLoad,
  authenticateUserAndRedirect,
  loadHome,
  userLogout,
  forgetLoad,
  forgetVerify,
  renderForgotPasswordPage,
  resetPassword,
  verificationLoad,
  resendVerificationEmail,
  loadProfile,
  renderEditProfilePage,
  updateProfile,
  loadDashboard,
  loadMyaccount,
  //renderPasswordUpdatePage,
  UpdatePassword,
  //renderReportPage
  getReportPage,
  //renderAboutUsPage
  getAboutUsPage,
  //renderFAQPage
  getFaqPage,
  //renderWalletPage
  getWalletPage,
  //renderCategoriesPage
  getCategoriesPage,
  //renderPrivacyPolicyPage
  getPrivacyPolicyPage,
  //renderContactUsPage
  getContactUsPage,
  //Sending Contact Us Mail
  sendingMail,
  //Route for Report HTML FILE
  getReportHTML,
  //Route for Report PDF file
  getreportPDF
};
