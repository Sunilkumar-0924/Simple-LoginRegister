const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const axios = require('axios');


const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

const cssRouter = express.Router();
cssRouter.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'styles.css'));
});

app.use(cssRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

const verificationTokens = {};

function generateToken(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}

app.post('/register', async (req, res) => {
    try {
      const { name, email, mobile_no, password } = req.body;

      const verificationToken = generateToken(email);
      verificationTokens[verificationToken] = { name, email, mobile_no, password };

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '201501052@rajalakshmi.edu.in',
          pass: 'wowo gvoa ljxg adzt'
        }
      });

      const mailOptions = {
        from: '201501052@rajalakshmi.edu.in',
        to: email,
        subject: 'Registration Confirmation',
        text: `Hello ${name},\n\nThank you for registering. Your registration was successful! Please click the following link to verify your email: http://localhost:${PORT}/verify?token=${verificationToken}`,
        html: `<p>Hello ${name},</p><p>Thank you for registering. Your registration was successful! Please click the following link to verify your email: <a href="http://localhost:${PORT}/verify?token=${verificationToken}">Verify Email</a></p>`
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Error sending email', details: error.message });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({ message: 'Registration successful. Check your email for confirmation.' });
        }
      });
    } catch (error) {
      console.error('Error sending data to webhook:', error.message);
      res.status(500).json({ error: 'Error sending data to webhook', details: error.message });
    }
  });

app.get('/verify', async (req, res) => {
  const { token } = req.query;
  const userData = verificationTokens[token];

  if (userData) {
    try {
      const { name, email, mobile_no, password } = userData;
      console.log(name, email, mobile_no, password);

      const webhookUrl = 'https://hook.eu2.make.com/04rhm5yxhe6jq6mnnbhtxk7lncjgj19v';
      const dataToSend = {
        name,
        mobile_no,
        password,
        is_verified: true,
        email,
      };

      await axios.post(webhookUrl, dataToSend, { headers: { 'Content-Type': 'application/json' } });
      res.redirect(`/verified?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&mobile_no=${encodeURIComponent(mobile_no)}&password=${encodeURIComponent(password)}`);

    } catch (error) {
      console.error('Error sending data to webhook:', error.message);
      res.status(500).json({ error: 'Error sending data to webhook', details: error.message });
    }
  } else {
    res.status(400).send('Invalid or expired token.');
  }
});

app.get('/verified', (req, res) => {
  const { name, email, mobile_no, password } = req.query;

  res.render('verified', {
    user: {
      name,
      email,
      mobile_no,
      password,
    },
  });
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const webhookUrl = 'https://hook.eu2.make.com/3n7ss8ooohi0adsmtvwa4f60b8yaragr';
    const dataToSend = { email, password };

    const response = await axios.post(webhookUrl, dataToSend, { headers: { 'Content-Type': 'application/json' } });
    console.log(response.data);
    if (response.data.includes('Your data has been found')) {
      const userData = response.data.split('\n').map(item => item.trim());
      console.log(userData);

      if (userData.length === 7) {
        const [unused1, name, userEmail, mobile_no, unused2, is_verified, unused3] = userData;
        const cleanedIsVerified = is_verified.trim().replace('.', '');
        const isVerifiedBoolean = cleanedIsVerified.toLowerCase() === 'true';
        console.log(name, userEmail, mobile_no)
      
        if (isVerifiedBoolean) {
          console.log('Redirecting to /verified with data:', name, userEmail, mobile_no);
          
          // After successful verification, send user details as JSON
          const userDetails = {
            name,
            email,
            mobile_no,
            password, // Assuming you want to include the password in the URL
          };

          res.status(200).json(userDetails);
        } else {
          res.status(400).send('Account not verified. Please check your email for confirmation.');
        }
      } else {
        res.status(400).send('Unexpected response format.');
      }
    } else if (response.data === 'Email and Password does not match') {
      res.status(400).send('Email and Password do not match.');
    } else if (response.data === 'User does not exist') {
      res.status(400).send('User details not found.');
    } else {
      console.error('Unexpected response from the webhook:', response.data);
      res.status(400).send('Unexpected response. Please check your credentials and try again.');
    }
  } catch (error) {
    console.error('Error handling login:', error.message);
    res.status(500).json({ error: 'Error handling login', details: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
