# Setting Up Gather with Firebase ✨

Gather uses Firebase Realtime Database to power real-time voting and confirmations. Here's how to get it running in about 5 minutes.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Name it something like "Gather" (or anything you like)
4. Accept the defaults and click through
5. You'll land in the Firebase dashboard

## Step 2: Set Up Realtime Database

1. In the left sidebar, click **"Realtime Database"** (under "Build")
2. Click **"Create Database"**
3. Choose your location (doesn't matter much for testing)
4. **Important:** Start in **Test Mode** for now
   - Test Mode allows reads/writes without authentication
   - You can tighten security later
5. Click **"Enable"**

Your database is now ready! You'll see a URL like: `https://your-project-name.firebaseio.com`

## Step 3: Get Your Firebase Config

1. In the left sidebar, click the **⚙️ Settings icon** (next to "Project Overview")
2. Click **"Project settings"**
3. Scroll down to find your **Web apps** section
4. If you don't have a web app yet, click **"Add app"** and select the `</>` (Web) option
5. Copy the `firebaseConfig` object (it looks like the code below)

It should look something like this:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyD...",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcd1234"
};
```

## Step 4: Add Your Config to firebase-config.js

1. Open `firebase-config.js` in this folder
2. Replace the placeholder config with your actual values
3. Keep everything else in the file unchanged
4. Save!

That's it for Firebase setup.

## Step 5: Deploy or Run Locally

### Option A: Run Locally (Simple)

1. Open a terminal in this folder
2. Run a simple Python server:
   ```bash
   python3 -m http.server 8000
   ```
   (or `python -m SimpleHTTPServer 8000` if you have Python 2)
3. Open `http://localhost:8000` in your browser
4. Test it out! Host a gathering → vote → see the dashboard

### Option B: Deploy to Netlify (Free & Easy)

1. Create a GitHub repo and push this folder
2. Go to [Netlify](https://netlify.com)
3. Click **"New site from Git"** and connect your repo
4. Deploy! You'll get a live URL
5. Share that URL with your people

### Option C: Deploy to Firebase Hosting

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in:
   ```bash
   firebase login
   ```
3. Initialize Firebase in this folder:
   ```bash
   firebase init hosting
   ```
4. When asked for public directory, enter the current folder (`.`)
5. Deploy:
   ```bash
   firebase deploy
   ```

You'll get a live URL like `https://your-project.web.app`

## Step 6: Test It

1. Go to your deployed/local URL
2. Click **"Host a Gathering"**
3. Fill out the form and create a gathering
4. You'll get a vote link — copy it
5. Open the vote link in an incognito tab (or another browser)
6. Vote!
7. Go back to the host dashboard — you should see the votes live

If you see real votes appearing live, you're all set! 🎉

## Troubleshooting

### "Firebase not configured" message?
- Make sure you've filled in all the values in `firebase-config.js`
- Make sure the file is in the same folder as your HTML files
- Refresh the page

### Votes aren't saving?
- Check that your database is in **Test Mode** (not locked down)
- Open the browser console (F12) and look for error messages
- Make sure your database URL is correct

### Local testing working, but not after deploy?
- Make sure you deployed the `firebase-config.js` file too!
- Check that all your script paths are correct (they should be)

## Security Note

Right now, your database is in **Test Mode**, which means anyone can read and write data. This is fine for testing, but if you're sharing Gather with lots of people, you should add security rules.

When you're ready, go to your Realtime Database > Rules and add:

```json
{
  "rules": {
    "gatherings": {
      "$gatheringId": {
        ".read": true,
        ".write": true,
        "votes": {
          "$voteId": {
            ".validate": "newData.hasChildren(['name', 'selectedTimes', 'votedAt'])"
          }
        }
      }
    }
  }
}
```

This allows reads/writes to gatherings but validates the vote structure.

## Questions?

- **Firebase Docs**: https://firebase.google.com/docs
- **Realtime Database Guide**: https://firebase.google.com/docs/database
- Check browser console (F12) for any error messages

Happy gathering! 🌱
