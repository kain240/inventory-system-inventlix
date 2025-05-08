# InveSTORE

An inventory management system designed to help businesses efficiently manage and track inventory. The app provides basic CRUD functionality for managing inventory items and features a user-friendly interface built with React and Django.

## Setup Instructions

#### Backend Setup (Django)

1. **Create Virtual Environment:**

   ```shell
   python -m venv .venv
   ```

2. **Activate Virtual Environment:**

   ```shell
   .\.venv\Scripts\activate
   ```

3. **Install Requirements:**

   ```shell
   pip install -r requirements.txt
   ```

4. **Database Setup:**

   - Set up your database (SQLite, PostgreSQL, or MySQL) and place it in the project directory if required.

5. **Configure Database in Project Directory Settings:**

   - Open settings.py and configure your database settings accordingly.

6. **Environment Variables:**

   - Insert a `.env` file with all the secret keys needed:

   ```
   SECRET_KEY=your_own_secret_key
   DEBUG=True
   ALLOWED_HOSTS=127.0.0.1, localhost
   ```

7. **Run Migrations:**

   ```shell
   python manage.py makemigrations
   ```

8. **Apply Migrations:**

   ```shell
   python manage.py migrate
   ```

9. **Run the Server:**
   ```shell
   python manage.py runserver
   ```

#### Frontend Setup (React)

1. **Install Dependencies:**

   ```shell
   npm install
   ```

2. **Environment Variables:**

- Create a `.env` file in the frontend directory.
- Insert the API base endpoint in the `.env` file as follows:

  ```
  VITE_REACT_BASE_URL='http://localhost:8000/api'
  ```

3. **Run the Client:**
   ```shell
   npm run dev
   ```

## Features Implemented

### Core Features:

Create: Add new inventory items with details like product name, SKU, quantity, price, and category.

Read: View a list of all inventory items.

Update: Edit details of existing inventory items.

Delete: Remove inventory items from the system.

### Additional Features:

Product Search/Filtering: Allows users to search for products by name, SKU, or category.

Pagination: Display inventory items across multiple pages for better navigation.

Admin Login/Authentication: Secure login for admin users to manage inventory items.

Image Upload: Ability to upload images for each product.

Stock Level Warnings: Notification for low stock items to ensure timely restocking.

Responsive UI: Mobile-friendly design for better accessibility on smartphones and tablets.
