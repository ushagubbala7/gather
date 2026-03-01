# Gather - Real-time Gathering Coordination App

A beautiful, simple app for coordinating gatherings with friends. Host creates a poll, guests vote on times, everyone knows when to show up.

Now with **Firebase Realtime Database** for live voting and instant updates.

## What's New

This version of Gather has been integrated with Firebase Realtime Database to enable:

- **Real-time voting**: See votes appear instantly as guests vote
- **Live dashboard**: Host can watch results come in live
- **Shareable links**: Clean URLs for voting and dashboard
- **No backend needed**: Everything powered by Firebase

## Files

### Core Application
- **index.html** — Landing page with feature overview and host CTA
- **host.html** — Multi-step form for hosts to create gatherings
- **vote.html** — Voting page for guests (loads real data from URL param)
- **dashboard.html** — Host's view of live results and confirmations

### Firebase
- **firebase-config.js** — Firebase initialization and helper functions
  - `createGathering()` - Creates a new gathering
  - `getGathering()` - Fetches gathering data
  - `submitVote()` - Records a vote
  - `onGatheringUpdate()` - Real-time listener
  - + more helper functions

### Documentation
- **SETUP.md** — Complete setup guide (Firebase project → deployment)
- **QUICK_START.txt** — Quick reference for getting started
- **FIREBASE_INTEGRATION_SUMMARY.md** — Technical implementation details
- **DATA_FLOW.md** — Architecture diagrams and data flows
- **INTEGRATION_CHECKLIST.md** — Complete feature checklist
- **README.md** — This file

## How It Works

### 1. Host Creates a Gathering
1. Fills out multi-step form on `host.html`
2. Provides activity, location, and time options
3. Clicks next, gathering is saved to Firebase
4. Gets a real vote link and dashboard link
5. Shares vote link with guests

### 2. Guests Vote
1. Opens vote link from host's message
2. Selects which time(s) work for them
3. Enters name and email
4. Clicks vote
5. Vote is saved to Firebase instantly
6. Sees live vote counts as others vote

### 3. Host Monitors Results
1. Opens dashboard link
2. Watches votes appear in real-time
3. Sees who's voting and for which times
4. After 48 hours, poll closes automatically
5. Gets a ready-to-send confirmation message
6. Shares final time with group

## Getting Started

### Quick Start (5 minutes)
1. Read **SETUP.md** 
2. Create a Firebase project (free)
3. Copy config values into `firebase-config.js`
4. Deploy or run locally
5. Test the full flow

### Local Testing
```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

### Deploy Options
- **Netlify** — Push to GitHub, auto-deploy (see SETUP.md)
- **Firebase Hosting** — Deploy directly with Firebase CLI
- **Any static host** — Upload HTML files anywhere

## Key Features

✨ **Real-time Updates**
- Vote counts update instantly
- No page refresh needed
- Multiple people can vote simultaneously

🎯 **Simple Flow**
- 6-step host form
- One-click voting
- Live dashboard

🌐 **Share-friendly**
- Clean URLs with gathering ID
- Works on any device
- No login required

🎨 **Beautiful Design**
- Warm, inviting aesthetic
- Responsive mobile design
- Accessible to all users

⚡ **Smart Defaults**
- 48-hour poll deadline
- Auto-closing polls
- Prevents duplicate votes with localStorage

## Demo Mode

Don't have Firebase set up yet? No problem!
- All pages show demo data
- Demo toggle buttons appear
- Everything works exactly the same
- Perfect for testing locally

Once you add your Firebase config, the app automatically switches to real mode.

## Firebase Data Structure

All data is stored under `gatherings/{gatheringId}`:

```javascript
{
  hostName: "Sarah",
  activity: "Pottery class",
  location: "Color Me Mine",
  mode: "discovery",
  timeOptions: [
    { date: "2024-03-15", time: "14:00", label: "Fri, Mar 15 at 2:00 PM" },
    { date: "2024-03-16", time: "11:00", label: "Sat, Mar 16 at 11:00 AM" }
  ],
  createdAt: 1708099200000,
  pollDeadline: 1708272000000,
  votes: {
    vote001: { name: "Maya", selectedTimes: [0, 1], votedAt: 1708099500000 },
    vote002: { name: "Jordan", selectedTimes: [0], votedAt: 1708099600000 }
  },
  confirmations: {
    conf001: { name: "Maya", status: "confirmed", confirmedAt: 1708360000000 }
  }
}
```

## Architecture

```
host.html ─────> createGathering() ────┐
                                        ├──> Firebase Realtime DB
vote.html ─────> submitVote() ─────────┤
                                        │
dashboard.html ←─ onGatheringUpdate() ──┘
```

The app uses:
- **Firebase Compat SDK** (easier integration)
- **Realtime listeners** (instant updates)
- **localStorage** (prevent duplicate votes)
- **Client-side ID generation** (no server needed)

## Browser Support

Works on all modern browsers:
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Internet Explorer 11+ (with polyfills)

## Customization

### Change Poll Deadline
In `firebase-config.js`, update line with `48 * 60 * 60 * 1000`:
```javascript
const pollDeadline = now + (72 * 60 * 60 * 1000); // 72 hours
```

### Change Gathering ID Format
In `firebase-config.js`, customize `generateGatheringId()`:
```javascript
function generateGatheringId() {
  // Return your custom ID format
}
```

### Add More Modes
In `host.html`, add to `modeConfig` object and add UI radio buttons

## Troubleshooting

**Votes not saving?**
- Check Firebase is configured in `firebase-config.js`
- Check browser console for errors (F12)
- Verify database is in Test Mode

**Demo mode appearing?**
- Firebase not configured yet
- Check `firebase-config.js` placeholder values
- Refresh page after updating config

**Real-time updates not working?**
- Check Firebase security rules
- Verify database connection in browser console
- Check network tab for requests

See **SETUP.md** for more troubleshooting.

## Security

The app starts with Firebase in **Test Mode** (anyone can read/write).

For production, add security rules to `firebase-config.js` in Firebase Console:

```json
{
  "rules": {
    "gatherings": {
      "$gatheringId": {
        ".read": true,
        ".write": true,
        "votes": {
          "$voteId": {
            ".validate": "newData.hasChildren(['name', 'selectedTimes'])"
          }
        }
      }
    }
  }
}
```

See **SETUP.md** for production security details.

## Performance

- **Instant updates**: Real-time listeners push changes
- **Optimized queries**: Only fetch what's needed
- **Efficient storage**: 8-character IDs instead of full UUIDs
- **Client-side rendering**: No server round-trips

Firebase Realtime Database handles:
- Thousands of concurrent connections
- Automatic scaling
- Real-time synchronization

## Future Ideas

- [ ] Add confirmations (can you make it?)
- [ ] Export attendee list
- [ ] Integration with calendar apps
- [ ] Email reminders
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Photo/emoji support

## License

Built with care for bringing friends together.

---

**Questions?** Check SETUP.md or FIREBASE_INTEGRATION_SUMMARY.md

**Ready to set up?** Start with SETUP.md → Create Firebase Project → Add Config → Deploy!

Happy gathering! 🌱
