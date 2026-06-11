# Story - Daily Storytelling App

A minimal, phone-friendly app for Matthew Dicks' "Storyworthy" daily three-sentence story practice.

## Features

✅ **Write daily stories** in three sentences (with template structure)
✅ **Auto-saves** to your phone's local storage
✅ **View all stories** chronologically
✅ **Get Claude feedback** on any story (via API)
✅ **Export to spreadsheet** as CSV
✅ **Zero friction** — optimized for mobile

## How to Deploy (Free, 5 Minutes)

### Step 1: Create a GitHub Account (if you don't have one)
Go to [github.com](https://github.com) and sign up (free).

### Step 2: Create a Repository
1. Click the **+** icon in top right → **New repository**
2. Name it `story-app`
3. Click **Create repository**

### Step 3: Upload These Files
1. Click **Add file** → **Upload files**
2. Download all the files from this project folder (all of them)
3. Drag them into the upload area
4. Scroll down and click **Commit changes**

### Step 4: Deploy to Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Click **Sign up** → choose **GitHub**
3. Authorize Vercel to access GitHub
4. Click **Import Project**
5. Select `story-app` repository
6. Click **Deploy**
7. **Done!** You'll get a live URL like `https://story-app-xyz.vercel.app`

### Step 5: Bookmark on Your Phone
1. Open the URL on your phone
2. Tap **Share** → **Add to Home Screen**
3. It now appears as an app icon

## How to Use

**Every day:**
1. Open the app
2. Write three sentences (template: [Person/Place] + [What happened] + [How you felt])
3. Hit "Save Story"
4. Done

**Anytime:**
- View all your stories in chronological order
- Click "Get feedback" on any story to send it to Claude for review
- Export to spreadsheet when you want to download them

## Storage
- Stories are stored **locally on your phone** — they don't go to any server
- They sync only when you export (which creates a CSV file)
- Even if you clear your browser cache, if you use the same browser, your stories stay

## File Structure
```
story-app/
├── index.html           # Main HTML file
├── package.json         # Dependencies
├── vite.config.js      # Build config
├── tailwind.config.js  # Styling config
├── postcss.config.js   # CSS config
├── .gitignore          # Git ignore file
└── src/
    ├── main.jsx        # React entry point
    ├── App.jsx         # Main component
    └── index.css       # Styling
```

## Troubleshooting

**Stories not saving?**
- Make sure you're using the same browser
- Check if localStorage is enabled (it should be by default)
- Try a hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

**Claude feedback not working?**
- Make sure you have internet connection
- The app tries to connect to Claude's API — it should work without any API key needed

**Can't deploy to Vercel?**
- Make sure all files are in the repository
- Check that the repository is public (not private)

## Questions?
This is a simple, free, personal app. No data leaves your phone unless you export it.
