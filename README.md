## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API USAGE](#apiusage)
- [Docker Setup](#dockersetup)
- [Contributing](#contributing)
- [License](#license)

## Introduction
Welcome to Toota, your ultimate solution for seamless transportation and logistics services.

With Toota, you can effortlessly connect with a diverse fleet of vehicles and experienced drivers to meet all your transportation needs. Whether you're moving goods, Toota ensures a reliable, efficient, and hassle-free experience every time.

Join Toota today and experience the future of transportation!

## Features
- **Diverse Fleet Options**: Choose from a variety of trucks including:
  - 1 ton Truck
  - 1.5 ton Truck
  - 2 ton Truck
  - 4 ton Truck
  - Bakkie
  - 8 ton Truck
- **Experienced Drivers**: Connect with professional and experienced drivers for reliable transportation.
- **User-Friendly Interface**: Enjoy a clean and intuitive user interface for a seamless booking experience.
- **Responsive Design**: Access the platform from both desktop and mobile devices.
- **Efficient Logistics**: Ensure reliable and efficient transportation services for all your needs.
- **Hassle-Free Experience**: Benefit from a streamlined process that makes booking and managing rentals easy and stress-free.

## Installation
To get started with Toota, follow these steps:

### Backend (Django)
1. Clone the repository:
    ```bash
    git clone https://github.com/MfundoDon/toota.git
    ```
2. Navigate to the backend directory:
    ```bash
    cd server 
    ```
3. Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```
4. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5. Apply migrations and start the server:
    ```bash
    python manage.py migrate
    python manage.py runserver
    ```
6. Access the Swagger API documentation:
    - Open your browser and go to `http://127.0.0.1:8000/swagger/` to view the API documentation.

### Frontend (React + vite )
1. Navigate to the frontend directory:
    ```bash
    cd client
    ```
2. Install the required dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```

You can now access the application on your local machine at `http://localhost:5176`.
## Usage
To use Toota, follow these steps:

1. **Navigate to the website**:
   - Go to [Toota App](https://www.tootapp.co.za/) to see the application in action.

2. **Book a Vehicle**:
   - Select the type of truck you need.
   - Provide the necessary details for your trip.
   - Confirm your booking.

3. **Manage Bookings**:
   - Track your booking status.
   - Communicate with the driver if needed.
### API Usage
- Access the Swagger API documentation locally:
  - Open your browser and go to `http://127.0.0.1:8000/swagger/`.
  - 
### Docker Setup
To run the project using Docker, follow these steps:

1. Ensure Docker is installed on your machine.
2. Clone the repository:
    ```bash
    git clone https://github.com/MfundoDon/toota.git
    ```
3. Navigate to the project directory:
    ```bash
    cd toota
    ```
4. Build and run the Docker containers:
    ```bash
    docker-compose up --build
    ```

This will set up the backend and frontend services in Docker containers.

- The backend will be accessible at `http://localhost:8000`.
- The frontend will be accessible at `http://localhost:3000`.

The Swagger API documentation will be available at `http://localhost:8000/swagger/`.

