# Setting up the project

In the terminal, type:
1. mysql -u root < setup.sql
2. Create the following `.env` file:
    ```
    CLOUDINARY_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    CLOUDINARY_UPLOAD_PRESET=
    DB_DRIVER=mysql
    DB_USER=foo
    DB_PASSWORD=bar
    DB_DATABASE=organic
    DB_HOST=127.0.0.1
    STRIPE_PUBLISHABLE_KEY=
    STRIPE_SECRET_KEY=
    STRIPE_SUCCESS_URL=
    STRIPE_CANCEL_URL=
    ```

    For Cloudinary upload to work, you must provide the Cloudinary name,
    API Key, API Secret and the Upload Preset respectively
3. Install all dependencies with `yarn install`
4. Run all migration files with `npm run migrate up`
5. Run the application with `npm run start`
6. Go to `/users/register` in the browser and register a new user
7. Go to `/products/add-product` and add a couple of products