// Firebase Configuration and Helper Functions
// ============================================
// This file initializes Firebase and provides helper functions for the Gather app.
//
// TO SET UP FIREBASE:
// 1. Create a free Firebase project at https://console.firebase.google.com
// 2. Enable Realtime Database
// 3. Copy your config values below
// 4. Update the security rules (see SETUP.md)

// ============= FIREBASE CONFIG =============
// Replace these with your actual Firebase config values
const firebaseConfig = {
   apiKey: "AIzaSyA5gzU47EMjXWP_5Z7R8RhgxkitcQboA5o",
authDomain: "gather-eff54.firebaseapp.com",
databaseURL: "https://gather-eff54-default-rtdb.firebaseio.com",
projectId: "gather-eff54",
storageBucket: "gather-eff54.firebasestorage.app",
messagingSenderId: "450750628948",
appId: "1:450750628948:web:356b3c01d58f0e12d6d9c1"
};

// Initialize Firebase
let db = null;
let firebaseInitialized = false;

try {
    // Initialize Firebase app
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    firebaseInitialized = true;
} catch (error) {
    console.warn('Firebase not fully configured. Running in demo mode.', error.message);
    firebaseInitialized = false;
}

// ============= HELPER FUNCTIONS =============

/**
 * Generate a short, URL-friendly ID for gatherings
 * Uses a combination of timestamp and random characters
 */
function generateGatheringId() {
    const timestamp = Date.now().toString(36).substring(5); // Last 5 chars of timestamp
    const random = Math.random().toString(36).substring(2, 8); // Random 6 chars
    return (timestamp + random).substring(0, 8); // Return 8 character ID
}

/**
 * Create a new gathering in Firebase
 * @param {Object} data - Gathering data {hostName, mode, activity, location, timeOptions, invitedCount}
 * @returns {Promise<string>} - Gathering ID
 */
async function createGathering(data) {
    if (!firebaseInitialized) {
        console.warn('Firebase not initialized. Using demo ID.');
        return generateGatheringId();
    }

    try {
        const gatheringId = generateGatheringId();
        const now = Date.now();
        const pollDeadline = now + (48 * 60 * 60 * 1000); // 48 hours from now

        const gatheringData = {
            hostName: data.hostName,
            mode: data.mode,
            activity: data.activity,
            location: data.location,
            timeOptions: data.timeOptions || [],
            createdAt: now,
            pollDeadline: pollDeadline,
            invitedCount: data.invitedCount || 0,
            votes: {},
            confirmations: {}
        };

        await db.ref(`gatherings/${gatheringId}`).set(gatheringData);
        return gatheringId;
    } catch (error) {
        console.error('Error creating gathering:', error);
        return generateGatheringId();
    }
}

/**
 * Fetch gathering data from Firebase
 * @param {string} gatheringId - The gathering ID
 * @returns {Promise<Object|null>} - Gathering data or null
 */
async function getGathering(gatheringId) {
    if (!firebaseInitialized) {
        console.warn('Firebase not initialized. Cannot fetch gathering.');
        return null;
    }

    try {
        const snapshot = await db.ref(`gatherings/${gatheringId}`).once('value');
        return snapshot.val();
    } catch (error) {
        console.error('Error fetching gathering:', error);
        return null;
    }
}

/**
 * Submit a vote for a gathering
 * @param {string} gatheringId - The gathering ID
 * @param {string} voterName - The voter's name
 * @param {Array<number>} selectedTimeIndices - Indices of selected time options
 * @param {string} email - Optional email address
 * @returns {Promise<boolean>} - Success status
 */
async function submitVote(gatheringId, voterName, selectedTimeIndices, email = null) {
    if (!firebaseInitialized) {
        console.warn('Firebase not initialized. Cannot submit vote.');
        return false;
    }

    try {
        const voteId = generateGatheringId();
        const voteData = {
            name: voterName,
            selectedTimes: selectedTimeIndices,
            votedAt: Date.now()
        };

        if (email) {
            voteData.email = email;
        }

        await db.ref(`gatherings/${gatheringId}/votes/${voteId}`).set(voteData);
        return true;
    } catch (error) {
        console.error('Error submitting vote:', error);
        return false;
    }
}

/**
 * Confirm or update attendance status for a voter
 * @param {string} gatheringId - The gathering ID
 * @param {string} voterName - The voter's name
 * @param {string} status - 'confirmed' | 'cant_make_it' | 'next_time'
 * @returns {Promise<boolean>} - Success status
 */
async function confirmAttendance(gatheringId, voterName, status) {
    if (!firebaseInitialized) {
        console.warn('Firebase not initialized. Cannot confirm attendance.');
        return false;
    }

    try {
        const confirmationId = generateGatheringId();
        const confirmationData = {
            name: voterName,
            status: status,
            confirmedAt: Date.now()
        };

        await db.ref(`gatherings/${gatheringId}/confirmations/${confirmationId}`).set(confirmationData);
        return true;
    } catch (error) {
        console.error('Error confirming attendance:', error);
        return false;
    }
}

/**
 * Listen for real-time updates to a gathering
 * @param {string} gatheringId - The gathering ID
 * @param {Function} callback - Function to call with updated data
 * @returns {Function} - Function to call to unsubscribe
 */
function onGatheringUpdate(gatheringId, callback) {
    if (!firebaseInitialized) {
        console.warn('Firebase not initialized. Cannot set up real-time listener.');
        return () => {}; // Return empty unsubscribe function
    }

    try {
        const ref = db.ref(`gatherings/${gatheringId}`);
        ref.on('value', (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });

        // Return unsubscribe function
        return () => {
            ref.off('value');
        };
    } catch (error) {
        console.error('Error setting up gathering listener:', error);
        return () => {};
    }
}

/**
 * Check if Firebase is properly configured
 * @returns {boolean} - True if Firebase is initialized
 */
function isFirebaseConfigured() {
    return firebaseInitialized;
}

// Export functions for use in other files
// (For modules, these would be proper exports; for browsers, they're global)
window.gatherFirebase = {
    createGathering,
    getGathering,
    submitVote,
    confirmAttendance,
    onGatheringUpdate,
    isFirebaseConfigured,
    generateGatheringId
};
