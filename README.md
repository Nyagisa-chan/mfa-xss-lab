# mfa-xss-lab
Cookies Reuse &amp; MFA Bypass Lab


# Run:
```
sudo docker build -t mfa-xss-lab .
sudo docker run -d -p 3075:3075 -p 2275:2275 --name mfa-xss-lab mfa-xss-lab
```

# To test the requirements:
1. HTTP: Navigate to http://<ip>:3075 in your browser.
2. SSH: Connect using the specified credentials: ssh -p 2275 analyst@localhost (password: blue_team_rocks).
3. Logs: Once SSH'd in, verify the logs exist by running cat /opt/admin/logs/access.log.

# Tested using:
- OS: Ubuntu 26.04 LTS \
- git: git version 2.53.0 \
- docker: Docker version 29.1.3, build 29.1.3-0ubuntu4.1
