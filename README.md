# Agent Distribution System - Admin Dashboard

A comprehensive MERN stack application for managing agents and distributing CSV lists efficiently across your team.

## Features

### 🔐 Authentication
- Admin login with JWT authentication
- Secure password hashing with bcryptjs
- Token-based session management

### 👥 Agent Management
- Create and manage agents with contact details
- Email, phone, and password for each agent
- Delete agents and their assigned lists
- Beautiful card-based agent list view

### 📊 CSV Upload & Distribution
- Upload CSV, XLSX, or XLS files
- Drag & drop file upload interface
- Automatic validation of CSV format
- Intelligent distribution algorithm
  - Divides items equally among all agents
  - Remainder items distributed sequentially

### 📈 Distribution Viewer
- View all uploaded distributions
- Expandable agent sections showing assigned items
- Track upload history with timestamps
- Beautiful accordion-based interface

## Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **TanStack Query** - Data fetching
- **Wouter** - Routing
- **Lucide React** - Icons

### Backend
- **Express** - Web framework
- **Node.js** - Runtime
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **XLSX** - CSV/Excel parsing

### Data Storage
- In-memory storage (MemStorage)
- Type-safe interfaces with TypeScript
- Shared schema validation with Zod

## Setup Instructions

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Installation

1. **Clone the repository** (if not already in Replit)

2. **Install dependencies** (already installed via packager)
   ```bash
   npm install
   ```

3. **Set environment variables**
   Create a `.env` file or set:
   ```
   SESSION_SECRET=your-secret-key-here
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser to `http://localhost:5000`
   - Default admin credentials:
     - Email: `admin@example.com`
     - Password: `admin123`

## Usage Guide

### 1. Login
- Navigate to the login page
- Use the test credentials provided above
- Successfully authenticated users are redirected to the dashboard

### 2. Manage Agents
- Click "Agents" in the sidebar
- Add new agents using the "Add Agent" button
- Fill in: Name, Email, Phone (with country code), and Password
- View all agents in card format
- Delete agents as needed

### 3. Upload CSV Files
- Click "Upload & Distribute" in the sidebar
- Drag and drop a CSV/XLSX/XLS file or browse to select
- CSV must have columns: **FirstName**, **Phone**, **Notes**
- Click "Upload & Distribute" to process
- Items are automatically distributed among all agents

### 4. View Distributions
- Click "Distributions" in the sidebar
- See all uploaded files with timestamps
- Expand each distribution to view agent assignments
- See detailed list of items per agent

## CSV File Format

Your CSV file should have the following columns:

```csv
FirstName,Phone,Notes
John,+1-555-0101,Follow up on product inquiry
Sarah,+1-555-0102,Interested in premium package
Michael,+1-555-0103,Requested callback on Monday
```

**Requirements:**
- `FirstName` - Required, text
- `Phone` - Required, text (can include country code)
- `Notes` - Optional, text

### Sample CSV File
A sample CSV file is provided in `attached_assets/sample_list.csv` with 25 test records.

## Distribution Algorithm

The system distributes list items equally among all available agents:

1. Calculate items per agent: `totalItems ÷ numberOfAgents`
2. Assign equal portions to each agent
3. Distribute remainder items sequentially to agents

**Example:**
- 25 items, 5 agents = 5 items each
- 27 items, 5 agents = 5 items to 3 agents, 6 items to 2 agents

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and auth
│   │   ├── pages/         # Page components
│   │   └── index.css      # Global styles
├── server/                # Backend Express application
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Data storage interface
│   └── index.ts           # Server entry point
├── shared/                # Shared code (types, schemas)
│   └── schema.ts          # Data models and validation
└── attached_assets/       # Static assets and test data
    └── sample_list.csv    # Sample CSV file
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Agents
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `DELETE /api/agents/:id` - Delete agent

### Distributions
- `GET /api/distributions` - Get all distributions with details
- `POST /api/distributions/upload` - Upload and distribute CSV

## Development

### Code Quality
- TypeScript for type safety
- Zod for runtime validation
- ESLint for code linting
- Modular, reusable components
- Clean separation of concerns

### Testing
- Test data included in `attached_assets/`
- Sample CSV with 25 records
- Default admin account for testing

## Features Roadmap

Future enhancements could include:
- Agent-level login to view their assigned lists
- Task completion tracking
- Export distributed lists as CSV
- Role-based access control
- Email notifications to agents
- Analytics dashboard
- Pagination for large datasets

## Support

For issues or questions, please review the code comments and documentation.

---

Built with ❤️ using the MERN stack
