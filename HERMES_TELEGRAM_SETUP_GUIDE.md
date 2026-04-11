# Hermes Telegram Remote Configuration Guide

This guide will help you set up Hermes Agent to work remotely via Telegram, allowing you to interact with it from any device.

## Prerequisites

- Hermes Agent already installed ✓
- A Telegram account
- Your LLM provider API keys configured

---

## Step 1: Create Your Telegram Bot

Every Telegram bot requires a token from **@BotFather**:

### 1. Open Telegram and Search for BotFather
- Go to https://t.me/BotFather or search for `@BotFather` in Telegram

### 2. Create a New Bot
- Send the command: `/newbot`
- Choose a **display name** (e.g., "Hermes Assistant")
- Choose a **username** (must end in `bot`, e.g., `your_hermes_bot`)

### 3. Copy Your Bot Token
BotFather will reply with a token like this:
```
123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
```

**⚠️ Keep this token secret! Anyone with it can control your bot.**

### 4. Optional: Customize Your Bot
These commands improve user experience (send to @BotFather):

- `/setdescription` - "What can this bot do?" text
- `/setabouttext` - Short profile description
- `/setuserpic` - Upload bot avatar
- `/setcommands` - Define command menu (e.g., `help - Show help info`)

---

## Step 2: Find Your Telegram User ID

Hermes uses numeric user IDs for authorization (not usernames).

### Method 1: Use @userinfobot (Recommended)
1. Open Telegram
2. Search for @userinfobot
3. Send any message
4. It instantly replies with your numeric user ID like: `123456789`

### Method 2: Use @get_id_bot
1. Open Telegram
2. Search for @get_id_bot
3. Send any message
4. Copy the user ID number

**Save this number! You'll need it in the next step.**

---

## Step 3: Configure Hermes

You have two options: interactive setup (recommended) or manual configuration.

### Option A: Interactive Setup (Recommended)

Run the setup wizard:

```bash
hermes gateway setup
```

Follow the prompts:
1. Select **Telegram** when asked for platform
2. Paste your bot token from Step 1
3. Enter your user ID from Step 2
4. The wizard writes configuration for you

### Option B: Manual Configuration

Edit the Hermes environment file:

```bash
# Open the config file
nano ~/.hermes/.env

# Add these lines (replace with your values)
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_ALLOWED_USERS=123456789
```

**For multiple users**, separate with commas:
```bash
TELEGRAM_ALLOWED_USERS=123456789,987654321,555555555
```

---

## Step 4: Test the Connection

### Quick Test Run

Start the gateway in foreground to verify everything works:

```bash
hermes gateway
```

You should see output like:
```
[Gateway] Starting Hermes Gateway...
[Gateway] Telegram adapter connected
[Gateway] Ready - send a message to your bot
```

### Test the Bot

1. Open Telegram
2. Find your bot (search for the username you chose)
3. Send a message like "Hello!"
4. You should get a response within a few seconds

If it works, press `Ctrl+C` to stop the test run.

---

## Step 5: Install as a Persistent Service

For remote access, you need Hermes to run 24/7 and survive reboots.

### Install the Service

```bash
hermes gateway install
```

This creates a background service:
- **Linux:** systemd user service
- **macOS:** launchd service (plist)

### Start the Service

```bash
hermes gateway start
```

### Verify It's Running

```bash
hermes gateway status
```

Expected output:
```
✓ Gateway service is running
```

### Service Management Commands

```bash
# Start the gateway
hermes gateway start

# Stop the gateway
hermes gateway stop

# Check status
hermes gateway status

# Restart the gateway
hermes gateway restart
```

### View Logs

**Linux:**
```bash
journalctl --user -u hermes-gateway -f
```

**macOS:**
```bash
tail -f ~/.hermes/logs/gateway.log
```

---

## Step 6: Configure Advanced Features (Optional)

### Set a Home Channel

A **home channel** is where scheduled tasks deliver results. Without one, cron jobs have nowhere to send output.

**Method 1:** Use the `/sethome` command in any Telegram group/DM with your bot

**Method 2:** Set it manually in `~/.hermes/.env`:

```bash
TELEGRAM_HOME_CHANNEL=-1001234567890
TELEGRAM_HOME_CHANNEL_NAME="My Notifications"
```

To find a group ID, add @userinfobot to the group.

### Configure Tool Progress Display

Control how much detail the bot shows when using tools. Edit `~/.hermes/config.yaml`:

```yaml
display:
  tool_progress: new    # Options: off | new | all | verbose
```

| Mode | What You See |
|-------|-------------|
| `off` | Clean responses only - no tool activity |
| `new` | Brief status for each new tool call (recommended) |
| `all` | Every tool call with details |
| `verbose` | Full tool output including command results |

### Set Up a Personality

Customize how the bot communicates by editing `~/.hermes/SOUL.md`:

```markdown
# Your Custom Persona
You are a helpful technical assistant. Be concise and direct.
Use code blocks for any code.
Skip pleasantries - I prefer efficiency.
```

---

## Step 7: Access Remotely

Once configured, you can access Hermes from anywhere!

### From Any Device

1. Open Telegram on your phone, tablet, or computer
2. Find your bot
3. Send a message

The bot has full access to:
- **Terminal commands** - Run shell commands on your server
- **File operations** - Read, write, edit files
- **Web search** - Search the internet
- **Code execution** - Run scripts and code
- **All your skills** - Any custom skills you've created

### Example Remote Tasks

You can ask the bot to:

**Check server status:**
```
Check disk usage and memory on the server
```

**Deploy code:**
```
Deploy the Next.js app to Vercel
```

**Debug issues:**
```
Check the logs for the Nginx server and find any errors
```

**Run scheduled tasks:**
```
Every day at 9am, check GitHub for new pull requests and send me a summary
```

---

## Security Best Practices

### 1. Always Restrict Access

Never set `GATEWAY_ALLOW_ALL_USERS=true` on a bot with terminal access.

### 2. Use DM Pairing for Teams

For team setups, DM pairing is more flexible than static allowlists:

1. Team member DMs your bot (they're not on allowlist yet)
2. Bot replies with a one-time pairing code
3. They send you the code via Slack, email, etc.
4. You approve it:
   ```bash
   hermes pairing approve telegram XKGH5N7P
   ```
5. They're immediately granted access

**Manage paired users:**
```bash
# List all paired users
hermes pairing list

# Revoke access
hermes pairing revoke telegram 987654321
```

### 3. Protect Your Bot Token

- Never share it publicly
- If it leaks, revoke immediately via `/revoke` in BotFather
- Generate a new token via `/token` or `/newbot`

### 4. Use Docker for Terminal Commands (Recommended)

Run commands in a container instead of on your host system:

```bash
# In ~/.hermes/.env
TERMINAL_BACKEND=docker
TERMINAL_DOCKER_IMAGE=nikolaik/python-nodejs:python3.11-nodejs20
```

This protects your host system even if someone gets unauthorized access.

---

## Troubleshooting

### Bot Not Responding

**Check logs:**
```bash
# Linux
journalctl --user -u hermes-gateway -n 50

# macOS
tail -50 ~/.hermes/logs/gateway.log
```

**Common causes:**
- Wrong bot token
- Service not running
- User ID not in allowlist
- Network connectivity issues

### Bot Responds "Unauthorized"

Your user ID is not in `TELEGRAM_ALLOWED_USERS`. Double-check with @userinfobot.

### Bot Ignores Group Messages

**Privacy mode** is likely ON. To fix:

1. Message @BotFather
2. `/mybots` → select your bot
3. Bot Settings → Group Privacy → Turn OFF
4. **Remove and re-add bot to the group**

**Alternative:** Make bot a group admin (admins always see all messages).

### Voice Messages Not Transcribed

Check your STT configuration:
- Local: Install `faster-whisper`
- Groq: Set `GROQ_API_KEY` in `~/.hermes/.env`
- OpenAI: Set `VOICE_TOOLS_OPENAI_KEY` in `~/.hermes/.env`

### Gateway Won't Start

Check if another instance is running:
```bash
hermes gateway status
```

If it's already running, stop it first:
```bash
hermes gateway stop
hermes gateway start
```

---

## Next Steps

Now that Hermes is running on Telegram, you can:

1. **Schedule automated tasks** - Daily reports, health checks, reminders
2. **Use it for team collaboration** - Multiple team members can access it
3. **Set up project context** - Create `~/.hermes/AGENTS.md` with project details
4. **Add custom skills** - Automate recurring workflows
5. **Enable voice features** - Send voice messages, receive audio responses

### Learn More

- **Scheduled Tasks:** Use `/help cron` in Telegram or check docs
- **Skills:** Create reusable workflows with `hermes skill create`
- **Context:** Project details in `~/.hermes/AGENTS.md`
- **Personalality:** Customize bot behavior in `~/.hermes/SOUL.md`

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `hermes gateway setup` | Interactive configuration wizard |
| `hermes gateway start` | Start the gateway service |
| `hermes gateway stop` | Stop the gateway service |
| `hermes gateway status` | Check if gateway is running |
| `hermes gateway install` | Install as a background service |
| `hermes pairing list` | List all paired users |
| `hermes pairing approve <code>` | Approve a pairing request |
| `hermes pairing revoke <user_id>` | Revoke user access |

---

**Status:** 📖 Ready to use once configured
**Estimated Time:** 10-15 minutes
**Difficulty:** Easy

---

**Need Help?**

Check Hermes logs for errors:
```bash
# Linux
journalctl --user -u hermes-gateway -f

# macOS
tail -f ~/.hermes/logs/gateway.log
```
