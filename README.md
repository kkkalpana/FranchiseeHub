# FranchiseHub V2

A complete franchise management system built with MERN stack.

## Features

### For Applicants
- Submit franchise applications online
- Track application status

### For Admins
- View all applications
- Accept/Reject/Grant franchise applications
- View all active franchisees
- Dashboard with statistics

### For Franchisees
- Login to personal dashboard
- Add daily sales data
- View sales history and statistics

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Express Session
- CORS

**Frontend:**
- React + Vite
- React Router
- Axios
- Tailwind CSS
- Lucide Icons

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=2016
SESSION_SECRET=your_secret_key
```

4. Start server:
```bash
npm start
```

Backend will run on `http://localhost:2016`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Admin Routes (`/admin`)
- `POST /login` - Admin login
- `GET /allApplicants` - Get all applications
- `POST /acceptApplicant` - Accept application
- `POST /rejectApplicant` - Reject application
- `POST /grantApplicant` - Grant franchise
- `POST /saveFranchiseCred` - Create franchisee credentials

### Applicant Routes (`/applicant`)
- `POST /apply` - Submit franchise application

### Franchisee Routes (`/franchisee`)
- `POST /login` - Franchisee login
- `GET /profile` - Get franchisee profile
- `POST /addSales` - Add daily sales data
- `POST /getSales` - Get sales history

## Database Collections

- `applicants` - Franchise applications
- `admins` - Admin accounts
- `franchise_credentails` - Franchisee login credentials (typo intentional)
- `t_sales_data` - Daily sales data

## Deployment

### Backend (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Add environment variables
4. Deploy

### Frontend (Netlify)
1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy

## Default Credentials

**Admin:**
- Email: `admin@franchisehub.com`
- Password: `admin123`

## License

MIT
