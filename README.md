# 🚗 RideBuddy Frontend

**Simple and friendly, like a buddy for rides!**

RideBuddy is a modern ride-sharing/carpooling web application that connects drivers with passengers. Built with React and powered by Firebase authentication, this platform makes sharing rides easy, affordable, and environmentally friendly.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.10-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-38B2AC?logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-10.14.1-FFCA28?logo=firebase)

---

## 🎬 Demo Video

[![RideBuddy Demo](https://img.youtube.com/vi/5uDTt0_T6NM/0.jpg)](https://www.youtube.com/watch?v=5uDTt0_T6NM)

> Click the thumbnail above to watch the demo on YouTube.

---

## 📑 Table of Contents

- [Demo Video](#-demo-video)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Available Scripts](#-available-scripts)
- [API Integration](#-api-integration)
- [Authentication](#-authentication)
- [State Management](#-state-management)
- [Routing](#-routing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- 🔍 **Search & Browse Rides** - Find available rides by start and end location
- 📝 **Publish Rides** - Share your journey and offer seats to others
- 🎫 **Request Management** - Create, accept, or reject ride requests
- 💰 **Automatic Fare Calculation** - Smart pricing based on distance and fuel efficiency
- 🗺️ **Interactive Maps** - Visualize routes with Leaflet.js integration
- 👤 **User Profiles** - View driver and passenger information

### User Experience
- 🔐 **Secure Authentication** - Email/password and Google OAuth support
- 📱 **Responsive Design** - Seamless experience across all devices
- 🔄 **Real-time Updates** - Auto-refreshing ride requests
- 🎨 **Modern UI** - Clean interface with DaisyUI components
- ⚡ **Fast Performance** - Optimized with Vite and React

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.2** - Modern UI library with hooks
- **Vite 5.0** - Next-generation frontend build tool
- **React Router DOM 6.20** - Client-side routing

### Styling & UI
- **TailwindCSS 3.3** - Utility-first CSS framework
- **DaisyUI 4.4** - Component library (Retro theme)
- **Lucide React** - Beautiful icon set
- **React Icons** - Additional icon library

### State Management
- **Redux Toolkit 2.1** - State management
- **RTK Query** - Data fetching and caching
- **React Redux 9.0** - React bindings for Redux

### Backend Integration
- **Axios 1.6** - HTTP client
- **Firebase 10.14** - Authentication and storage
- **Supabase 2.39** - Database and backend services

### Maps & Location
- **Leaflet 1.9** - Interactive maps
- **Leaflet Routing Machine 3.2** - Route planning and visualization

### Forms & Validation
- **React Hook Form 7.54** - Performant form handling
- **SweetAlert2 11.16** - Beautiful alerts and modals

### Additional Libraries
- **Swiper 11.2** - Touch-enabled carousel
- **dotenv 16.3** - Environment variable management

---

## 📁 Project Structure

```
RideBuddy_Frontend/
├── public/                    # Static assets
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.jsx       # Navigation header
│   │   ├── Footer.jsx       # Site footer
│   │   ├── Login.jsx        # Login form
│   │   ├── Register.jsx     # Registration form
│   │   ├── PublishRide.jsx  # Ride publishing interface
│   │   ├── PublishForm.jsx  # Ride form component
│   │   ├── Loading.jsx      # Loading spinner
│   │   └── NotFound.jsx     # 404 page
│   │
│   ├── pages/               # Page components
│   │   ├── home/           
│   │   │   ├── Home.jsx    # Landing page
│   │   │   ├── Banner.jsx  # Hero section
│   │   │   └── Help.jsx    # Help section
│   │   ├── request/        
│   │   │   ├── RequestPage.jsx      # Ride requests dashboard
│   │   │   └── RideRequestCard.jsx  # Request card component
│   │   └── user/           
│   │       ├── SearchPage.jsx  # Ride search interface
│   │       ├── Search.jsx      # Search form
│   │       ├── Card.jsx        # Ride card
│   │       └── Drawer.jsx      # Navigation drawer
│   │
│   ├── context/             # React Context providers
│   │   └── AuthContext.jsx # Authentication context
│   │
│   ├── firebase/            # Firebase configuration
│   │   └── firebase.config.js
│   │
│   ├── redux/               # Redux store and slices
│   │   ├── store.js        # Store configuration
│   │   ├── features/       
│   │   │   ├── rides/      # Ride management
│   │   │   └── requests/   # Request management
│   │
│   ├── routers/            # Route definitions
│   │   ├── router.jsx      # Main router config
│   │   └── PrivateRoute.jsx # Protected route wrapper
│   │
│   ├── utils/              # Utility functions
│   │   └── baseURL.js      # API base URL
│   │
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Application entry point
│   ├── App.css             # App-specific styles
│   └── index.css           # Global styles
│
├── .gitignore              # Git ignore rules
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jjf2009/RideBuddy_Forntend.git
   cd RideBuddy_Forntend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_PROJECT_ID=your_firebase_project_id
VITE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_firebase_app_id

# Optional: Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important Notes:**
- Replace the placeholder values with your actual Firebase credentials
- Get Firebase credentials from [Firebase Console](https://console.firebase.google.com/)
- Never commit the `.env` file to version control
- The backend API URL is configured in `src/utils/baseURL.js`

### Running the Application

**Development Mode** (with hot reload)
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

**Production Build**
```bash
npm run build
```

**Preview Production Build**
```bash
npm run preview
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## 🌐 API Integration

RideBuddy Frontend connects to a backend API hosted on Render.

**Backend Repository:** [RideBuddy Backend](https://github.com/jjf2009/RideBuddy_Backend)

**Base URL:** `https://ridebuddy-backend.onrender.com`

### API Endpoints

#### Rides
- `GET /rides` - Fetch all available rides
- `GET /rides/:id` - Fetch specific ride details
- `POST /rides` - Create a new ride
- `PUT /rides/:id` - Update ride information
- `DELETE /rides/:id` - Delete a ride

#### Ride Requests
- `GET /requests` - Fetch all ride requests
- `GET /requests/:id` - Fetch specific request
- `POST /requests` - Create new ride request
- `PATCH /requests/:id` - Update request status (accept/reject)

### Fare Calculation
The app automatically calculates ride fares based on:
- **Distance:** Calculated using Leaflet Routing Machine
- **Fuel Efficiency:** 15 km/liter
- **Petrol Price:** ₹96.62 per liter
- **Per-Person Fare:** Total cost divided by available seats

---

## 🔐 Authentication

RideBuddy uses **Firebase Authentication** with the following features:

### Supported Methods
1. **Email/Password Authentication**
   - User registration with name, email, password
   - Secure login with Firebase

2. **Google OAuth**
   - One-click sign-in with Google account
   - Automatic profile creation

### Authentication Flow
```
User Input → Firebase Auth → Auth Context → Protected Routes
```

### Context API
The `AuthContext` provides:
- `currentUser` - Currently logged-in user object
- `loading` - Authentication loading state
- `registerUser(email, password, name)` - Register new user
- `loginUser(email, password)` - Login existing user
- `signInWithGoogle()` - Google OAuth sign-in
- `logout()` - Sign out user

### Protected Routes
Routes requiring authentication:
- `/search` - Search and browse rides
- `/publish` - Publish new ride

Unauthenticated users are redirected to the login page.

---

## 🗄️ State Management

RideBuddy uses **Redux Toolkit** with **RTK Query** for efficient state management and API caching.

### Redux Store Structure

```javascript
{
  ridesApi: {
    queries: { /* Cached ride data */ },
    mutations: { /* Ride CRUD operations */ }
  },
  rideRequestsApi: {
    queries: { /* Cached request data */ },
    mutations: { /* Request operations */ }
  }
}
```

### Available Hooks

**Rides:**
- `useFetchAllRidesQuery()` - Get all rides
- `useFetchRideByIdQuery(id)` - Get ride by ID
- `useAddRideMutation()` - Create new ride
- `useUpdateRideMutation()` - Update ride
- `useDeleteRideMutation()` - Delete ride

**Requests:**
- `useFetchAllRequestsQuery()` - Get all requests
- `useFetchRequestByIdQuery(id)` - Get request by ID
- `useAddRideRequestMutation()` - Create request
- `useUpdateRequestStatusMutation()` - Update status

### Benefits
- ✅ Automatic caching and invalidation
- ✅ Built-in loading and error states
- ✅ Optimistic updates
- ✅ Reduced boilerplate code

---

## 🧭 Routing

RideBuddy uses **React Router v6** with the following routes:

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | Home | Public | Landing page with app overview |
| `/register` | Register | Public | User registration |
| `/login` | Login | Public | User login |
| `/search` | SearchPage | **Private** | Search and browse rides |
| `/publish` | PublishRide | **Private** | Publish new ride |
| `/requests` | RequestPage | **Private** | View ride requests |
| `*` | NotFound | Public | 404 error page |

### Route Protection
- **Public Routes:** Accessible to all users
- **Private Routes:** Require authentication (enforced by `PrivateRoute` component)
- Unauthenticated users attempting to access private routes are redirected to `/login`

---

## 🌍 Deployment

### Deployed Application
The application can be deployed on various platforms:

**Recommended Platforms:**
- **Vercel** - Optimized for React/Vite apps
- **Netlify** - Easy deployment with CI/CD
- **GitHub Pages** - Free hosting for static sites

### Build for Production

1. **Create production build**
   ```bash
   npm run build
   ```
   This creates an optimized build in the `dist/` directory.

2. **Important:** The `postinstall` script automatically creates a `404.html` for SPA routing:
   ```json
   "postinstall": "npm run build && cp dist/index.html dist/404.html"
   ```

### Environment Variables
Ensure all environment variables are configured in your deployment platform:
- Firebase credentials
- Supabase keys (if used)
- Backend API URL

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Use ESLint for code quality
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 👨‍💻 Developer

**jjf2009**
- GitHub: [@jjf2009](https://github.com/jjf2009)
- LinkedIn: [Connect on LinkedIn](https://linkedin.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React library
- **Vite Team** - For the blazing fast build tool
- **Firebase** - For authentication and storage services
- **Leaflet** - For interactive mapping capabilities
- **DaisyUI** - For beautiful UI components

---

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on [GitHub Issues](https://github.com/jjf2009/RideBuddy_Forntend/issues)
- Contact the developer via social media links in the footer

---

**Built with ❤️ using React and Vite**
