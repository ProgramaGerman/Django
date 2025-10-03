# Project Overview

This project is the backend for a banking application, built with Django and Django REST Framework. It provides user authentication (login and registration) using JSON Web Tokens (JWT).

## Main Technologies

*   **Backend Framework:** Django
*   **API:** Django REST Framework
*   **Authentication:** djangorestframework-simplejwt (JWT)
*   **Database:** SQLite (default development database)
*   **CORS:** django-cors-headers to allow requests from the frontend.

## Project Structure

*   `servidor/`: Main Django project directory.
    *   `settings.py`: Contains all the project settings, including database configuration, installed apps, and middleware.
    *   `urls.py`: The main URL configuration for the project. It routes the `/api/` endpoints to the `login` app.
*   `login/`: A Django app that handles user authentication.
    *   `views.py`: Contains the `LoginView` and `RegisterView` for handling login and registration requests.
    *   `urls.py`: Defines the URLs for the login and registration endpoints (`/api/login/` and `/api/register/`).
    *   `models.py`: Defines the `Login` model for storing user credentials.
    *   `checkLogin.py`: Contains the business logic for user verification and registration.
*   `manage.py`: The command-line utility for Django.

# Building and Running

1.  **Install Dependencies:**
    ```bash
    uv pip install -r requirements.txt
    ```
    *(Note: A `requirements.txt` file is not present, but this is the standard command. Dependencies are listed in `pyproject.toml`)*

2.  **Apply Migrations:**
    ```bash
    python manage.py migrate
    ```

3.  **Run the Development Server:**
    ```bash
    python manage.py runserver
    ```
    The server will start on `http://127.0.0.1:8000`.

# Development Conventions

*   The project follows the standard Django project structure.
*   The frontend is expected to run on `http://localhost:5173` and make requests to this backend.
*   Authentication is handled via JWT, with the following endpoints:
    *   `POST /api/token/`: Obtain a new token pair (access and refresh).
    *   `POST /api/token/refresh/`: Refresh an expired access token.
*   User registration is done via `POST /api/register/`.
*   User login is done via `POST /api/login/`.
