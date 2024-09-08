# Study With Me

This full-stack web application is a productivity tool aimed at enhancing focus during study sessions by offering personalized "Study With Me" videos. Users can securely register and log in, and the app remembers their favorite videos and preferences for seamless future sessions. Using the YouTube API, the app retrieves study videos based on user-selected moods, offering an array of atmospheres from relaxed to intense. This ensures users have the perfect environment for productivity.

## Live Demo

You can access the live version of the app here:  
[Frontend (React) - GitHub Pages](https://Cynthiawzy.github.io/study-with-me-tester-frontend)

The backend is hosted on Heroku:  
[Backend (Django) - Heroku](https://study-with-me-tester-52875f580cdc.herokuapp.com)

## Tech Stack

**Frontend:**
- React
- Vite
- Axios

**Backend:**
- Django
- Django REST Framework
- Heroku (for deployment)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Cynthiawzy/study-with-me-tester-frontend.git
   git clone https://github.com/yourusername/study-with-me-tester.git
   ```

2. Install Dependencies:
   
   For the Frontend
   ```bash
   cd study-with-me-tester-frontend
   npm install
   ```

   For the Backend
   ```bash
   cd study-with-me-tester
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   pip install -r requirements.txt
   ```

3. Setup Environment Variables:

   Create a .env file in the root directory your study-with-me-tester-frontend directory with the following content:
   ```bash
   VITE_API_URL=https://study-with-me-tester-52875f580cdc.herokuapp.com
   VITE_YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
   ```
   Replace YOUR_YOUTUBE_API_KEY with your actual YouTube API key, which you can obtain from the YouTube Developer Console.

   Obtaining Your API Key
   To get your YouTube API key:
   
   Go to the Google Cloud Console.
   Create a new project or select an existing one.
   Navigate to the API & Services > Credentials page.
   Click on "Create Credentials" and select "API Key".
   Copy the API key and use it in your .env file.
   
5. Start the development server:
 
   ```bash
   npm run dev
   ```

6. Run the Application:
   
   For the Backend
   ```bash
   python manage.py runserver
   ```
   The backend will be available at http://localhost:8081/

   For the Frontend
   ```bash
   npm start
   ```
   The frontend will be available at http://localhost:5176/


