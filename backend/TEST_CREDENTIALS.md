# Test Credentials

These credentials are seeded into the database for testing purposes.

## Quick Start Accounts (seed.js)

Run: `npm run seed`

| Role     | Email               | Password  |
|----------|---------------------|-----------|
| Customer | customer@test.com   | Test123!  |
| Vendor   | vendor@test.com     | Test123!  |
| Admin    | admin@test.com      | Test123!  |

## Detailed Accounts (seed-detailed.js)

Run: `npm run seed:detailed`

| Role     | Email                              | Password          |
|----------|------------------------------------|-------------------|
| Customer | john.wilson@example.com            | SecurePass123!@   |
| Customer | sarah.ahmed@example.com            | SecurePass123!@   |
| Vendor   | raj.adventuretravel@example.com    | VendorPass123!@   |
| Vendor   | emma.beachtravel@example.com       | VendorPass123!@   |
| Admin    | admin@travellr.com                 | AdminPass123!@    |

## Seeded Data Includes

When you run either seeding script, the database will be populated with:

- **Sample Trips**: 
  - Mountain Adventure Trek (Kathmandu, Nepal)
  - Beach Paradise Getaway (Male, Maldives)
  - Cultural Heritage Tour (Jaipur, India)
  
- **Vendor Profile**: Adventure Travel Co.

- **Available Dates**: Each trip has departure dates with available seats

## Usage

1. **Start MongoDB** (make sure it's running)
2. **Run seed command** in the backend directory:
   ```bash
   # Quick seed (3 accounts)
   npm run seed
   
   # OR Detailed seed (5 accounts + more trips)
   npm run seed:detailed
   ```
3. **Login** to the frontend using any of the credentials above

## Notes

- All passwords use bcrypt hashing for security
- Vendor accounts have verified status and approved businesses
- Admin account has full system access
- Seeding clears existing data in the database
