# GlobeMate - AI-Powered GeoGuide

## Project Overview
GlobeMate is an AI-powered geo-guidance platform designed to enhance travel experiences by offering personalized recommendations, intelligent itinerary planning, and real-time insights using data from Google Calendar, Google Maps, UPI transactions, and more.

## Key Features
1. **Personalized POI Recommendations**: Uses Google Maps Timeline and user history (click rates, weather, crowd levels) to suggest relevant places.
2. **Smart Date Suggestor**: Analyzes Google Calendar to recommend suitable travel dates.
3. **Money Analysis & Expense Tracking**: Captures UPI notification data to provide expense insights and spending patterns.
4. **Collaborations with Tour Companies**: Displays travel packages from tourist companies.
5. **Community Building**: Allows users to create profiles, join travel communities, and plan group trips.
6. **Real-Time Updates**: Provides live weather and traffic updates for better planning.

## Tech Stack
- **Frontend:** React.js (for web and mobile app)
- **Backend:** Express.js (Node.js)
- **Database:** MongoDB (for storing user profiles, trips, and expenses)
- **AI/ML:** Python (for recommendation models and expense classification)
- **APIs:** Google Calendar, Google Maps, UPI Analysis via notification parsing
- **Cloud:** Google Cloud Platform (GCP) for hosting and data storage

## How It Works
- **Place Recommendations:** Fetches nearby POIs via Google Places API and filters based on user preferences.
- **Smart Dates:** Reads calendar events and free slots using Google Calendar API.
- **Expense Tracking:** Processes UPI messages using a mobile app and classifies transactions with an ML model.
- **Tour Packages:** Displays packages from third-party providers.

## Installation Guide
1. Clone the repository.
2. Install dependencies with `npm install`.
3. Set up Google Cloud credentials.
4. Start the backend with `node server.js`.
5. Run the frontend with `npm start`.

## Contributing
Contributions are welcome! Please submit a pull request with your feature additions or improvements.

## License
This project is licensed under the MIT License.

