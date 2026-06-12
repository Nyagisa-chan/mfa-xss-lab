# mfa-xss-lab
Cookies Reuse &amp; MFA Bypass Lab


# Run:
```
docker build -t mfa-xss-lab .
docker run -d -p 3075:3075 -p 2275:2275 --name mfa-xss-lab mfa-xss-lab
```

# To test the requirements:
1. HTTP: Navigate to http://<ip>:3075 in your browser.
2. SSH: Connect using the specified credentials: ssh -p 2275 analyst@localhost (password: blue_team_rocks).
3. Logs: Once SSH'd in, verify the logs exist by running cat /opt/admin/logs/access.log.
