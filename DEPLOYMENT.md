# Deploying cagayanhomes to cagayanhomes.gacs.me (beginner guide)

Take it slowly. Do **one step at a time**, and don't move on until the "You should see" part matches.
If something looks different, stop and ask. Nothing here is rushed.

## How to read this guide

Every step starts with where you do it:

- **[YOUR PC]**: in the PowerShell / terminal on your Windows computer.
- **[DROPLET]**: in the terminal that is connected to your DigitalOcean server (you connect in Part 3).
- **[BROWSER]**: in Chrome, on a website (GoDaddy, DigitalOcean, GitHub).

Anything in `<ANGLE BRACKETS>` is something you replace with your own value. Don't type the brackets.

## What we are building (the big picture)

```
Visitor -> https://cagayanhomes.gacs.me -> Nginx -> your Node app (port 5000) -> Postgres database
```

- **Droplet** = your rented computer on the internet (already exists, already runs cgyballers.gacs.me).
- **Nginx** = the "receptionist": it receives visitors and sends them to the right site.
- **PM2** = keeps your Node app running, and starts it again after a crash or reboot.
- **Postgres** = the database (listings, messages, text content).
- Your other site, `cgyballers.gacs.me`, **stays untouched**.

## Parts

1. Put the latest code on GitHub
2. Point the subdomain to the droplet (DNS)
3. Connect to the droplet
4. Install what the server needs
5. Create the database
6. Download and build the site
7. Start it with PM2
8. Connect it to the web with Nginx
9. Turn on HTTPS (the padlock)
10. Final test checklist

Afterwards: updating the site, backups, troubleshooting.

---

## Part 1. Put the latest code on GitHub

Your code is in the repo `https://github.com/noelou/cagayanhomes`. The droplet will download it from there, so GitHub must have the newest version.

### 1.1 [YOUR PC] Commit your latest changes

Ask Claude to commit them, or run:
```
cd C:\Users\ACER\Desktop\noel\project\cagayanhomes
git add -A
git commit -m "prepare for deployment"
git push
```
**You should see:** the push finishes without errors, and your newest commit appears at
https://github.com/noelou/cagayanhomes

(Before `git add -A`, run `git status`. You should **not** see a `.env` file in the list. It is
ignored on purpose because it holds passwords.)

### 1.2 [BROWSER] Is the repo private or public?

Open `https://github.com/noelou/cagayanhomes` in a **private/incognito window** (so you are logged out).
- It opens normally = **public**. Skip the token step in 6.1.
- It shows "404" or asks you to sign in = **private**. You will need a token in step 6.1. That is fine, and it is the safer option.

---

## Part 2. Point the subdomain to the droplet (DNS)

### 2.1 [BROWSER] Find the droplet's IP address

1. Go to https://cloud.digitalocean.com and log in.
2. Click **Droplets** in the left menu.
3. Find the droplet that runs `cgyballers.gacs.me`.
4. Copy the number in the **IPv4** column (looks like `143.198.12.34`). Click it to copy.

Write it down. Everywhere below, `<DROPLET_IP>` means this number.

### 2.2 [BROWSER] Add the DNS record in GoDaddy

1. Log in at https://godaddy.com > **My Products**.
2. Find `gacs.me` > click **DNS**.
3. Click **Add New Record** and fill in:
   - **Type:** `A`
   - **Name:** `cagayanhomes`
   - **Value:** `<DROPLET_IP>`
   - **TTL:** the smallest option (10 minutes, or 600 seconds)
4. Click **Save**. Don't change or delete any other record.

### 2.3 [YOUR PC] Check that it worked

```
nslookup cagayanhomes.gacs.me
```
**You should see:** the line `Address: <DROPLET_IP>` at the bottom. If it says "can't find", wait 5 to 10
minutes and try again. You can keep going with Part 3 while you wait.

---

## Part 3. Connect to the droplet

### 3.1 [YOUR PC] Log in with SSH

```
ssh root@<DROPLET_IP>
```
- The first time it asks "Are you sure you want to continue connecting?" Type `yes` and press Enter.
- It asks for a password (or uses your SSH key). You can find the root password in the email DigitalOcean
  sent you, or reset it in the droplet's page > **Access**. When you type a password, nothing shows on
  the screen. That is normal.

If you normally log in as a different user than `root`, use that name instead (and put `sudo` in front of
the commands that need it).

**You should see:** a prompt like `root@your-droplet:~#`. **From here on, everything marked [DROPLET] is
typed in this window.**

### 3.2 [DROPLET] Look around before changing anything

```
lsb_release -d
free -h
df -h /
node -v
which nginx pm2 psql git
sudo ss -tlnp | grep -E ':80|:443|:5000'
```
What it tells you:
- `lsb_release -d`: the Linux version (Ubuntu is ideal).
- `free -h`: memory. Look at the **Mem total** and **Swap** lines. If memory is about 1 GB and swap is 0B, do 3.3.
- `node -v`: Node version. You need **v20 or higher** (v22 is best).
- `which ...`: lists the tools that are installed. A missing one just doesn't print.
- the last line: shows which ports are in use. **If you see `:5000` in the list, port 5000 is taken**
  by your other site. Then use **5001** everywhere this guide says 5000.

**Copy the output and send it to Claude if anything is unclear.**

### 3.3 [DROPLET] Only if the droplet has 1 GB of memory and no swap: add swap

(Swap stops the server from crashing while installing and building.)
```
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```
**You should see:** Swap now shows about 2.0Gi.

---

## Part 4. Install what the server needs

### 4.1 [DROPLET] Install Node.js 22 (skip if `node -v` already showed v20 or higher)

```
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```
**You should see:** `v22.x.x`.

> Careful: your other site may need a particular Node version. If `node -v` already works and is v20+,
> **don't reinstall**. Skip this step.

### 4.2 [DROPLET] Install PostgreSQL and git (skip any that `which` already found)

```
sudo apt update
sudo apt install -y postgresql git
```
**You should see:** no red errors at the end.

### 4.3 [DROPLET] Check Nginx and PM2 exist

```
nginx -v
pm2 -v
```
**You should see:** a version number for each. (Your other site already uses them, so they should be there.)

---

## Part 5. Create the database

### 5.1 [DROPLET] Open the Postgres prompt

```
sudo -u postgres psql
```
**You should see:** a prompt that says `postgres=#`.

### 5.2 [DROPLET, inside psql] Create the user and the database

Choose a strong password and write it down. Replace `CHANGE_ME_STRONG` with it, and keep the quotes:
```
CREATE USER cagayan WITH PASSWORD 'CHANGE_ME_STRONG';
CREATE DATABASE cagayanhomes OWNER cagayan;
\q
```
**You should see:** `CREATE ROLE`, then `CREATE DATABASE`. `\q` takes you back to the normal prompt.

---

## Part 6. Download and build the site

### 6.1 [DROPLET] Download the code from GitHub

```
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/noelou/cagayanhomes.git cagayanhomes
```

**If the repo is private** (see step 1.2), `git clone` will ask for a username and password. GitHub does not
accept your normal password. Create a token first:
1. [BROWSER] GitHub > your profile picture > **Settings** > **Developer settings** > **Personal access tokens** >
   **Fine-grained tokens** > **Generate new token**.
2. Name: `droplet`. Expiration: 90 days. **Repository access:** only select `cagayanhomes`.
   **Permissions > Repository permissions > Contents: Read-only**. Click **Generate token** and copy it.
3. [DROPLET] When git asks: **Username** = `noelou`, **Password** = the token you copied.

**You should see:** `Cloning into 'cagayanhomes'...` and it finishes.

Then give your user ownership of the folder:
```
sudo chown -R $USER:$USER /var/www/cagayanhomes
cd /var/www/cagayanhomes
ls
```
**You should see:** `client`, `server`, `DEPLOYMENT.md` and other files.

### 6.2 [DROPLET] Create the database tables

```
PGPASSWORD='CHANGE_ME_STRONG' psql -h localhost -U cagayan -d cagayanhomes -f server/schema.sql
```
(Use the password from step 5.2.)

**You should see:** several lines of `CREATE TABLE`. This is the first time `schema.sql` runs on a fresh database.
**If you see an error, copy it and send it to Claude.**

### 6.3 [DROPLET] Build the website

```
cd /var/www/cagayanhomes/client
npm ci
npm run build
```
This takes a minute or two.

**You should see:** at the end, `✓ built in ...` and a new `client/dist` folder.

### 6.4 [DROPLET] Install the server's packages

```
cd /var/www/cagayanhomes/server
npm ci --omit=dev
```
**You should see:** it finishes with no red errors.

### 6.5 [DROPLET] Create the secret settings file (`.env`)

First generate a long random secret and **copy the output**:
```
openssl rand -hex 48
```
Then create the file:
```
nano .env
```
Type this (use your own database password from 5.2, and paste the random secret):
```
DB_USER=cagayan
DB_PASSWORD=CHANGE_ME_STRONG
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cagayanhomes
JWT_SECRET=PASTE_THE_RANDOM_SECRET_HERE
PORT=5000
NODE_ENV=production
```
(Use `PORT=5001` if port 5000 was taken in step 3.2.)

Save and exit nano: press **Ctrl+O**, then **Enter**, then **Ctrl+X**.

Then protect the file:
```
chmod 600 .env
```
**Never share this file or its contents with anyone, and don't paste it in a chat.**

### 6.6 [DROPLET] Create your admin login

Choose a strong password (not `Admin!`). The login field on the site is called "email", and it can be any text:
```
node --env-file=.env createAdmin.js you@example.com 'A-Long-Strong-Password'
```
**You should see:** `Admin created: you@example.com`

> Checkpoint for Part 6: `ls /var/www/cagayanhomes/client/dist` shows files, and the admin was created.

---

## Part 7. Start it with PM2

### 7.1 [DROPLET] Start the app

It is important to start it from the `server` folder:
```
cd /var/www/cagayanhomes/server
pm2 start index.js --name cagayanhomes --node-args="--env-file=.env"
pm2 save
pm2 status
```
**You should see:** a table with `cagayanhomes` and status **online**.

### 7.2 [DROPLET] Check that it answers

```
curl http://127.0.0.1:5000/api/properties
```
**You should see:** `[]` (an empty list, because there are no listings yet). If you used port 5001, change the number.

If the status is `errored` or you see "connection refused", look at the log:
```
pm2 logs cagayanhomes --lines 30
```
and send the output to Claude. The message usually says exactly what is wrong.

### 7.3 [DROPLET] Make it start after a reboot (skip if your other site's PM2 already does this)

```
pm2 startup
```
It prints one command that starts with `sudo env PATH=...`. **Copy that line, paste it, and press Enter.**
Then run `pm2 save` again.

---

## Part 8. Connect it to the web with Nginx

### 8.1 [DROPLET] Create the site file

```
sudo nano /etc/nginx/sites-available/cagayanhomes
```
Paste this (use port 5001 if you chose that):
```nginx
server {
    listen 80;
    server_name cagayanhomes.gacs.me;

    client_max_body_size 100m;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Save and exit: **Ctrl+O**, **Enter**, **Ctrl+X**.

### 8.2 [DROPLET] Turn it on

```
sudo ln -s /etc/nginx/sites-available/cagayanhomes /etc/nginx/sites-enabled/
sudo nginx -t
```
**You should see:** `syntax is ok` and `test is successful`. **If you see an error, don't continue.** Send it to Claude.

Only if the test is successful:
```
sudo systemctl reload nginx
```

### 8.3 [BROWSER] Open the site

Go to `http://cagayanhomes.gacs.me` (http for now, without the s).

**You should see:** the website. If you see your *other* site, DNS isn't ready yet (Part 2.3), so wait a few minutes.
Also check that `cgyballers.gacs.me` still works.

---

## Part 9. Turn on HTTPS (the padlock)

Do this only after Part 8.3 works.

### 9.1 [DROPLET] Install and run Certbot

```
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d cagayanhomes.gacs.me
```
It asks a few questions:
- Your email (for expiry warnings): enter a real one.
- Agree to the terms: `Y`.
- Share your email with EFF: `N` is fine.
- Redirect HTTP to HTTPS: choose **2** (redirect).

**You should see:** "Congratulations! You have successfully enabled HTTPS".

If a firewall (`ufw`) is on, also run: `sudo ufw allow 'Nginx Full'`

### 9.2 [BROWSER] Check

Open `https://cagayanhomes.gacs.me`. **You should see:** a padlock. The certificate renews by itself.

---

## Part 10. Final test checklist

In the browser, on `https://cagayanhomes.gacs.me`:

- [ ] The home page loads with a padlock and the pages Buy, Rent, About and Contact all open
- [ ] Refresh the page while on `/buy`: it still works
- [ ] Go to `/admin/login` and log in with the admin from step 6.6
- [ ] Add a test listing **with photos**; check it on the Buy or Rent page and on its details page
- [ ] Send a test message from the Contact page, then find it in admin > Messages
- [ ] In admin > Content, change some text, save, and check it on the public page
- [ ] Open the site on your phone
- [ ] Delete the test listing and the test message
- [ ] [DROPLET] Run `pm2 restart cagayanhomes`, then reload the site (it should come back by itself)

When all boxes are ticked, you're live. Send Carl the link.

---

## Updating the site later

1. [YOUR PC] Make your changes, commit and `git push`.
2. [DROPLET]
```
cd /var/www/cagayanhomes
git pull
cd client && npm ci && npm run build
cd ../server && npm ci --omit=dev
pm2 restart cagayanhomes
```
If the update added new database tables or columns, tell Claude, because they need an extra database step.

## Backups (important!)

Your data lives in the database (listings, messages, text) and in the `server/uploads` folder (photos).
**Easiest:** in DigitalOcean, open the droplet > **Backups** > **Enable Backups** (about 20% of the droplet's price per month).

## Troubleshooting

| What you see | What to do |
|---|---|
| Browser shows **502 Bad Gateway** | The app isn't running. [DROPLET] `pm2 status`, then `pm2 logs cagayanhomes --lines 30` |
| Log says **JWT_SECRET is not set** | The `.env` file is missing or in the wrong place. It must be at `/var/www/cagayanhomes/server/.env`, and PM2 must be started from that folder (step 7.1) |
| Log says **EADDRINUSE** (port in use) | Another app uses that port. Change `PORT` in `.env` to 5001 and the number in the Nginx file, then `pm2 restart cagayanhomes` and `sudo systemctl reload nginx` |
| Log shows **database / password errors** | Check the `DB_...` lines in `.env` against step 5.2, and that step 6.2 ran |
| Photo upload fails | Check `client_max_body_size 100m;` is in the Nginx file (step 8.1) |
| Page not found after a refresh | `client/dist` wasn't built (step 6.3), or the app wasn't restarted |
| You see the other site instead of this one | DNS hasn't updated yet (step 2.3), or the `server_name` in the Nginx file has a typo |
| Login says "too many attempts" | Wait 15 minutes, or run `pm2 restart cagayanhomes` |
| You changed the site but the browser shows the old one | Hard refresh with **Ctrl+F5** |

If you get stuck anywhere: copy the **exact** message from the terminal and send it to Claude.

## Later (not needed to launch)

- An email to Carl when a message arrives.
- Cloudflare Turnstile ("I'm not a robot") if spam shows up.
- Copying your local test listings to the live site (not needed. Carl can add real ones in admin).
