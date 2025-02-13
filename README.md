# Fetch Frontend Take-Home Exercise

## About This Project

This project is a frontend web application built for a take-home assignment at Fetch. It aims to help dog-lovers find their perfect match from a database of shelter dogs. Users can search, filter, and sort through available dogs, favorite their top picks, and generate a match for adoption.

## Features

- **Login Page**:  
  Users log in with their name and email to authenticate with the backend service.

- **Dog Search Page**:  
  - Filter dogs by breed.  
  - Paginated results for browsing through the database.  
  - Sort results alphabetically by breed in ascending or descending order.  
  - View all fields of the Dog object (except for `id`).  
  - Select and favorite dogs from the search results.  
  - Generate a match by sending favorited dog IDs to the `/dogs/match` endpoint.  

- **Responsive Design**:  
  Ensures usability across various screen sizes and devices.

---

## Technologies Used

- **React**: Core library for building the user interface.  
- **React Router**: For navigation between pages (Login, Search, etc.).  
- **Fetch API**: For making HTTP requests to the backend service.  
- **CSS Modules**: For styling components with scoped styles.  
- **Deployed with Vercel**: The app is hosted and accessible online.

---

## Getting Started

Follow the steps below to set up the project locally.

### Prerequisites

Ensure you have the following installed on your machine:  
- **Node.js**: [Download Node.js](https://nodejs.org/) (LTS version recommended).  
- **npm** (comes with Node.js) or **yarn**: For dependency management.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sookim914/fetch.git
   cd fetch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   Or, if you prefer Yarn:
   ```bash
   yarn install
   ```

### Running the Application

Start the development server:  
Using npm:
```bash
npm start
```

Using Yarn:
```bash
yarn start
```

Open your browser and navigate to:  
[http://localhost:3000](http://localhost:3000)

Log in with a name and email to explore the app.

---

## Recommended Browsers

- **Use Chrome (non-incognito mode)**: For the best experience, it is encouraged to use Chrome in a regular browsing session.  
- **Avoid Safari and Chrome Incognito Mode**: Due to stricter cookie policies in these browsers, authentication using `fetch-access-token` in the `auth-cookie` may not work as intended. This may prevent certain API endpoints from being authorized.

---

## API Endpoints

This project interacts with the following backend API endpoints:

- **POST `/auth/login`**: To authenticate users.  
- **GET `/dogs/breeds`**: To fetch the list of dog breeds.  
- **GET `/dogs/search`**: To search for dogs based on filters, sorting, and pagination.  
- **POST `/dogs`**: To fetch detailed information about specific dog IDs.  
- **POST `/dogs/match`**: To generate a match based on favorited dog IDs.

---

## Deployed Version

The app is deployed and accessible at: **[Fetch Take-Home Exercise](https://fetch-soo-s-projects.vercel.app/login)**  

---

## Known Limitations

- **Cookie Policy**: The backend service requires active authentication via an HttpOnly cookie. Ensure that your browser allows cookies for proper functionality. For the best experience, I recommend using Google Chrome (in a standard browsing session). Other browsers, such as Safari or Chrome Incognito Mode, may encounter issues due to stricter cookie policies that could affect authentication and API functionality.
- **Maximum Query Limit**: The maximum number of dogs that can be matched by a single query is 10,000, as per the API documentation.  

---

## License

This project is for interview purposes only and is not licensed for production use.