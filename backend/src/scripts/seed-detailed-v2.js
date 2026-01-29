const dns = require('dns');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars from backend/ root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const Trip = require('../models/Trip');
const Vendor = require('../models/Vendor');
const User = require('../models/User');

// DNS Fix from config/database.js
if (process.env.NODE_ENV !== 'test') {
    try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch (err) {
        console.warn('Failed to set custom DNS servers', err.message);
    }
}

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not found in environment');
        }

        const options = {
            maxPoolSize: 10,
            minPoolSize: 5,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        };

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log('MongoDB Connected for Seeding');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

const seedData = async () => {
    // ... rest of logic same as before ...
    await connectDB();

    try {
        console.log('Clearing existing trips...');
        await Trip.deleteMany({});

        // Find a vendor to assign trips to (or create one)
        let vendor = await Vendor.findOne();
        if (!vendor) {
            console.log('No vendor found. Please run basic seed first or create a vendor.');
            const user = await User.findOne();
            if (user) {
                vendor = await Vendor.create({
                    user: user._id,
                    businessName: "Travellr Official",
                    isVerified: true,
                    address: { city: 'Mumbai', country: 'India' },
                    email: user.email,
                    phone: user.phone || '9999999999',
                    verificationStatus: 'approved'
                });
            } else {
                console.error("No users found to attach trips to.");
                // Try creating a dummy user + vendor
                const newUser = await User.create({
                    name: "Admin Vendor",
                    email: "admin@travellr.com",
                    password: "password123",
                    role: "vendor",
                    isEmailVerified: true
                });
                vendor = await Vendor.create({
                    user: newUser._id,
                    businessName: "Travellr Official",
                    isVerified: true,
                    address: { city: 'Mumbai', country: 'India' },
                    email: newUser.email,
                    phone: '9999999999',
                    verificationStatus: 'approved'
                });
            }
        }

        console.log(`Seeding data for vendor: ${vendor.businessName}`);

        const baseTrip = {
            vendor: vendor._id,
            isActive: true,
            status: 'published',
            dates: [{ startDate: new Date(Date.now() + 86400000), endDate: new Date(Date.now() + 86400000 * 5), price: 5000, availableSeats: 10, status: 'available' }],
            requirements: ['ID Proof'],
            inclusions: ['Accommodation'],
            exclusions: ['flights']
        };

        // --- Budget Friendly Stays ---
        const budgetStays = [
            {
                title: 'Zostel Rinchenpong (Pelling)',
                slug: 'zostel-rinchenpong',
                price: { amount: 509, currency: 'INR' },
                location: { city: 'Rinchenpong', state: 'Sikkim', country: 'India' },
                description: 'Budget friendly stay with amazing mountain views.',
                images: [{ url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', isPrimary: true }],
                stats: { rating: 4.8 },
                tags: ['budget-stay'],
                category: 'other',
                duration: { days: 1, nights: 1 }
            },
            {
                title: 'Zostel Kalpa',
                slug: 'zostel-kalpa',
                price: { amount: 849, currency: 'INR' },
                location: { city: 'Kalpa', state: 'Himachal Pradesh', country: 'India' },
                description: 'Stay amidst the apple orchards of Kinnaur.',
                images: [{ url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', isPrimary: true }],
                stats: { rating: 4.9 },
                tags: ['budget-stay'],
                category: 'other',
                duration: { days: 1, nights: 1 }
            },
            {
                title: 'Zostel Jaipur',
                slug: 'zostel-jaipur',
                price: { amount: 649, currency: 'INR' },
                location: { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
                description: 'Colorful backpacker hostel in the Pink City.',
                images: [{ url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80', isPrimary: true }],
                stats: { rating: 4.7 },
                tags: ['budget-stay'],
                category: 'other',
                duration: { days: 1, nights: 1 }
            },
            {
                title: 'Zostel Bundi',
                slug: 'zostel-bundi',
                price: { amount: 499, currency: 'INR' },
                location: { city: 'Bundi', state: 'Rajasthan', country: 'India' },
                description: 'Heritage havelli stay in Bundi.',
                images: [{ url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80', isPrimary: true }],
                stats: { rating: 4.6 },
                tags: ['budget-stay'],
                category: 'other',
                duration: { days: 1, nights: 1 }
            },
            {
                title: 'Zostel Leh',
                slug: 'zostel-leh',
                price: { amount: 699, currency: 'INR' },
                location: { city: 'Leh', state: 'Ladakh', country: 'India' },
                description: 'Backpacker haven at the top of the world.',
                images: [{ url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80', isPrimary: true }],
                stats: { rating: 4.8 },
                tags: ['budget-stay'],
                category: 'other',
                duration: { days: 1, nights: 1 }
            },
        ];

        // --- Weekend Escapes ---
        const weekendEscapes = [
            { name: 'Bir', state: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1533240332313-0dbdd3199061?w=800&q=80' },
            { name: 'Coorg', state: 'Karnataka', image: 'https://images.unsplash.com/photo-1590603784837-de409fd71ba9?w=800&q=80' },
            { name: 'Rishikesh', state: 'Uttarakhand', image: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=800&q=80' },
            { name: 'Panchgani', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80' }
        ].map((loc, i) => ({
            title: `Weekend in ${loc.name}`,
            slug: `weekend-${loc.name.toLowerCase()}`,
            description: `Perfect weekend getaway to ${loc.name}.`,
            location: { city: loc.name, state: loc.state, country: 'India' },
            price: { amount: 3000 + (i * 500), currency: 'INR' },
            images: [{ url: loc.image, isPrimary: true }],
            tags: ['weekend-escape'],
            category: 'adventure',
            duration: { days: 3, nights: 2 },
            stats: { rating: 4.5 }
        }));

        // --- Trending Now (Destinations -> Trips) ---
        const trending = [
            { name: 'Jaipur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80' },
            { name: 'Jodhpur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80' },
            { name: 'Srinagar', state: 'Jammu & Kashmir', image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80' },
            { name: 'Pondicherry', state: 'Puducherry', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80' }
        ].map((loc, i) => ({
            title: `Explore ${loc.name}`,
            slug: `trending-${loc.name.toLowerCase()}`,
            description: `Experience the trending vibes of ${loc.name} this season.`,
            location: { city: loc.name, state: loc.state, country: 'India' },
            price: { amount: 5000 + (i * 1000), currency: 'INR' },
            images: [{ url: loc.image, isPrimary: true }],
            tags: ['trending'],
            category: 'cultural',
            duration: { days: 4, nights: 3 },
            isFeatured: true,
            stats: { rating: 4.7, bookingsCount: 100 + i }
        }));

        // --- Winter Wanderlist ---
        const winter = [
            { name: 'Shimla', state: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80' },
            { name: 'Pahalgam', state: 'Jammu & Kashmir', image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80' },
            { name: 'Tirthan', state: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80' }
        ].map((loc, i) => ({
            title: `Winter in ${loc.name}`,
            slug: `winter-${loc.name.toLowerCase()}`,
            description: `Snowy adventures in ${loc.name}.`,
            location: { city: loc.name, state: loc.state, country: 'India' },
            price: { amount: 6000 + (i * 1000), currency: 'INR' },
            images: [{ url: loc.image, isPrimary: true }],
            tags: ['winter'],
            category: 'mountain',
            duration: { days: 5, nights: 4 },
            stats: { rating: 4.8 }
        }));

        // Combine all
        const allTrips = [...budgetStays, ...weekendEscapes, ...trending, ...winter].map(t => ({ ...baseTrip, ...t }));

        await Trip.create(allTrips);
        console.log(`Seeded ${allTrips.length} trips successfully.`);

        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
