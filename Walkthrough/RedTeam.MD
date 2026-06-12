# Red Team Walkthrough
1. Open `http://<ip_address>:3075` , prepare burpsuite to look for hidden information.

2. Check the source-code, it should hint `robots.txt` .

3. Open `robots.txt`, you should see 2 API that are disallowed (which can be accessed directly).

4. Go back to `http://<ip_address>:3075` and click `Access Admin Dashboard` to login

5. A hidden cookie will be generated after logging in. Type any username and password, the system will return a hardcoded username and password.

6. Once in MFA, directly head towards `/dashboard` , the website does not explicitly checks for cookies, but user needs an admin cookie to access the final flag.
*Special Notes: You can brute force the OTP*

7. A feedback form is provided in the dashboard and is particularly weak against XSS (still hardcoded for now). Finding the valid XSS exploit will leak the admin cookie (hint: check burpsuite).

8. Access `/dashboard` again with the leaked cookie, the final flag will be showned.

9. Check burpsuite during the whole process, there will be unexpected flags just lying around waiting to be found.
