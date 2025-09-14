# E-Commerce Website

A Node.js e-commerce application built with Express, Bookshelf ORM, and MySQL.

## Local Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file for local development:
   ```
   # Database Configuration
   DB_DRIVER=mysql2
   DB_USER=root
   DB_PASSWORD=your_password
   DB_DATABASE=your_database
   DB_HOST=localhost
   DB_PORT=3306
   
   # Application
   PORT=3003
   
   # Cloudinary (for image uploads)
   CLOUDINARY_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   CLOUDINARY_UPLOAD_PRESET=
   
   # Stripe (for payments)
   STRIPE_PUBLISHABLE_KEY=
   STRIPE_SECRET_KEY=
   STRIPE_SUCCESS_URL=
   STRIPE_CANCEL_URL=
   ```

3. Run database migrations:
   ```bash
   npm run migrate up
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Railway Deployment

This application is configured for Railway deployment:

- Database: Uses Railway's MySQL service with automatic environment variables
- Migrations: Run automatically on deployment via `npm run deploy`
- Configuration: Automatically switches to production settings when `NODE_ENV=production`

### Railway Environment Variables

Railway automatically provides these MySQL variables:
- `MYSQL_URL` (connection string)
- `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLHOST`, `MYSQLPORT`

Add these additional variables in Railway dashboard:
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_PRESET`
- `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL`