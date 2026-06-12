const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3075;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.set('X-Powered-By', 'SCENARIO75{Node.js}');
  next();
});

const users = { "admin": "admin123" };

const simpleWAF = (req, res, next) => {
    const payload = req.body.feedback || '';
    const lowerPayload = payload.toLowerCase();
    
    if (lowerPayload.includes('<script>')) {
        return res.status(403).send(`
            <h2 style="color:red;">WAF ALERT</h2>
            <p>Malicious payload detected: <code>&lt;script&gt;</code> tags are strictly prohibited. SCENARIO75{403}</p>
        `);
    }
    if (lowerPayload.includes('document.cookie')) {
        return res.status(403).send(`
            <h2 style="color:red;">WAF ALERT</h2>
            <p>Malicious payload detected: Accessing document.cookie is blocked. SCENARIO75{window['docu'+'ment']['coo'+'kie']}</p>
        `);
    }
    
    next();
};

// ROUTE
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    // res.redirect('/login');
});

app.get('/login', (req, res) => {
    const errorMsg = req.query.error 
        ? '<p style="color:red">Login Failed. Debug hint: Check database for user "admin" with password "admin123".</p>' 
        : '';

    res.sendFile(__dirname + '/login.html', { error: errorMsg });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (users[username] && users[username] === password) {
        res.cookie('pre_mfa_session', 'pending_mfa_verification', { httpOnly: false });
        res.cookie('SCENARIO75{pre_mfa_session}', 'SCENARIO75{pending_mfa_verification}', { httpOnly: false });
        res.redirect('/mfa');
    } else {
        res.redirect('/login?error=1');
    }
});

app.get('/mfa', (req, res) => {
    res.sendFile(__dirname + '/mfa.html');
});

app.post('/api/verify-mfa', (req, res) => {
    if (req.body.otp === "123456") {
        res.cookie('mfa_verified', 'true', { httpOnly: false });
        res.cookie('adm_sess_cookie', 'adm_sess_access', { httpOnly: false });
        res.redirect('/dashboard');
    } else {
        res.status(401).send("Invalid OTP");
    }
});

app.get('/dashboard', (req, res) => {
    // if (!req.cookies['pre_mfa_session']) {
    //     return res.status(401).send("Unauthorized. Please log in.");
    // }
    
    let feedbackHTML = '<p class="no-feedback">No feedback submissions yet.</p>';
    
    let cookieMessage = '';
    if (req.cookies['adm_sess_cookie'] && req.cookies['adm_sess_cookie'] === 'adm_sess_access') {
        cookieMessage = `<div class="cookie-alert"><p style="color: #ff6b6b; font-weight: bold; padding: 1rem; background: #ffe0e0; border-radius: 8px; margin-bottom: 1rem;">🚨 SCENARIO75{RED_C00k13_MFA_Byp4ss_0wn3d}</p></div>`;
        res.set('X-Admin-Session', 'SCENARIO75{adm_sess}');
        res.set('X-Skip-MFA', 'SCENARIO75{/api/verify-mfa}');
    }
    
    const dashboardTemplate = fs.readFileSync(path.join(__dirname, 'dashboard.html'), 'utf8');
    const html = dashboardTemplate
        .replace('{{FEEDBACK_LIST}}', feedbackHTML)
        .replace('{{COOKIE_MESSAGE}}', cookieMessage);
    
    res.send(html);
});

app.post('/feedback', simpleWAF, (req, res) => {
    res.set('X-XSS-Success', 'SCENARIO75{<svg>}');
    res.redirect('/dashboard');
});

app.listen(PORT, () => console.log(`Lab running on port ${PORT}`));
