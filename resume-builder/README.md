# AI Resume Builder

An AI-powered resume + cover letter builder. Built with Next.js + Anthropic Claude.

---

## Deploy to Vercel in 5 steps

### 1. Get your Anthropic API key
- Go to https://console.anthropic.com
- Click **API Keys** → **Create Key**
- Copy the key (starts with `sk-ant-...`)

### 2. Push this project to GitHub
- Go to https://github.com/new and create a new repo (e.g. `ai-resume-builder`)
- Upload this entire folder to it (drag and drop works)

### 3. Deploy on Vercel
- Go to https://vercel.com and sign up (free)
- Click **Add New Project** → import your GitHub repo
- Click **Deploy** (it auto-detects Next.js)

### 4. Add your API key as an environment variable
- In Vercel dashboard → your project → **Settings** → **Environment Variables**
- Add: `ANTHROPIC_API_KEY` = your key from step 1
- Click **Save**, then go to **Deployments** and **Redeploy**

### 5. Your app is live!
- Vercel gives you a URL like `https://ai-resume-builder-xyz.vercel.app`
- Share it anywhere

---

## Run locally (optional)

```bash
npm install
cp .env.example .env.local
# Add your API key to .env.local
npm run dev
# Open http://localhost:3000
```

---

## Make money with it

| Feature | How |
|---|---|
| Cover letter paywall | Add Stripe, charge $4.99 per cover letter |
| Premium templates | Charge $9/mo for PDF export + design templates |
| Unlimited mode | Free: 1 resume. Pro ($9/mo): unlimited |

Want help adding Stripe payments? Ask Claude!
