# Remote Save
Remote save , a simple application on web that simply exists currently on development
```
Project Name: SHARE VER
Author: Samip Regmi
Initial Commit: Jan 1 2025
```
> [!CAUTION]
> Need to fix the redundant codes ASAP still ASAP , no i havent fixed the redundant codes
```
 ┣ 📂database
 ┃ ┣ 📂`<space1>`
 ┃ ┃ ┣ 📜`<space1 file>`
 ┣ 📂passwords
 ┃ ┣ 📂`<space1>`
 ┃ ┃ ┣ 📜`<space1 password>`
```
## Jan 8 Updates
- removed hosting from vercel
- reads credentials now from get and post files
- hosted locally on my pc

## To run and preview
> requires cloudfare to not have any CORS errors
Linux: [https://pkg.cloudflare.com/index.html](https://pkg.cloudflare.com/index.html)
```
sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null

echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared jammy main' | sudo tee /etc/apt/sources.list.d/cloudflared.list

sudo apt-get update && sudo apt-get install cloudflared
```
Running now
```
python3 get.py
python3 post.py
cloudflared tunnel --url http://localhost:8080
cloudflared tunnel --url http://localhost:5000
```
The ports and ip address shall be same on cloudfared tunnel as we have hardcoded on our server
```
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

```
```
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```
# Previews from 2025-Jan-4 Not latest
[Screencast from 01-04-2025 04:51:59 PM.webm](https://github.com/user-attachments/assets/89254e81-5269-4ec9-b151-009601041537)


