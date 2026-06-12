# Blue Team Walkthrough
1. SSH via port 2275 with credential `analyst:blue_team_rocks` \
`ssh -p 2275 analyst@<ip_address>`

2. Check the available files via `ls`, it should contain `nginx.conf-backup` that serves as the hint on where to look.

3. Head over to `/opt/admin/logs` as hinted, you will find 2 log files that will be used for digging information.
