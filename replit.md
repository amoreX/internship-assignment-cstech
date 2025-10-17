# Agent Distribution System

## Overview
A full-stack admin dashboard for managing agents and distributing CSV lists intelligently across a team. Built with React, TypeScript, Express, and Node.js.

## Current State
**Status:** MVP Complete - Ready for Testing

### Completed Features ✅
- Data models defined for Users, Agents, ListItems, and Distributions
- Design system configured with Inter font and professional color scheme
- Complete authentication flow with JWT and protected routes
- Agent management UI (list, create, delete)
- CSV upload component with drag-drop and file validation
- Distribution viewer with expandable agent details
- Dark mode support with theme toggle
- Sample CSV file with 25 test records
- Comprehensive README with setup instructions
- Complete backend API with all endpoints
- JWT authentication middleware
- CSV parsing with XLSX library
- Intelligent distribution algorithm
- Password hashing with bcrypt
- Seed data with admin user and 5 test agents
- Frontend-backend integration complete
- Error handling and loading states throughout

### Testing 🧪
- Ready for end-to-end testing
- All user journeys implemented

## Project Architecture

### Frontend (`client/`)
- **Pages:** Login, Dashboard, NotFound
- **Components:** 
  - AppSidebar - Navigation
  - AgentList - View and manage agents
  - AgentForm - Create new agents
  - CsvUpload - File upload with validation
  - DistributionViewer - View distributed lists
  - ThemeToggle - Dark/light mode
- **Auth:** JWT-based authentication with protected routes
- **Styling:** Tailwind CSS with Shadcn UI components

### Backend (`server/`)
- **Storage:** In-memory storage implementing full CRUD interface
- **Routes:** RESTful API endpoints (to be implemented)
- **Authentication:** JWT token generation and validation
- **File Processing:** Multer for uploads, XLSX for parsing

### Shared (`shared/`)
- **Schema:** Complete data models with Zod validation
  - Users (admin authentication)
  - Agents (team members)
  - ListItems (CSV rows)
  - Distributions (upload tracking)

## Key Technologies
- React 18 + TypeScript
- Express + Node.js
- TanStack Query for data fetching
- Wouter for routing
- Zod for validation
- bcryptjs for password hashing
- jsonwebtoken for JWT auth
- XLSX for CSV/Excel parsing
- Tailwind CSS + Shadcn UI
- Lucide React icons

## Data Model

### Users (Admin)
- id, email, password
- For admin authentication

### Agents
- id, name, email, phone, password, createdAt
- Team members who receive distributed items

### ListItems
- id, firstName, phone, notes, agentId, distributionId, createdAt
- Individual CSV rows assigned to agents

### Distributions
- id, fileName, totalItems, createdAt
- Tracks each CSV upload

## Distribution Algorithm
Lists are distributed equally among all agents:
1. Divide total items by number of agents
2. Each agent gets equal portion
3. Remainder items distributed sequentially

Example: 25 items ÷ 5 agents = 5 items each

## Test Data
- Sample CSV: `attached_assets/sample_list.csv` (25 records)
- Default admin: admin@example.com / admin123
- CSV columns: FirstName, Phone, Notes

## Next Steps
1. Implement all backend API endpoints
2. Add CSV parsing and distribution logic
3. Connect frontend to backend
4. Test complete user flow
5. Add error handling and loading states

## User Preferences
- Professional, clean design
- Readable, well-refactored code
- Comprehensive test data
- Proper functionality throughout

## Recent Changes (Latest First)
- **2025-01-17:** Created complete frontend with all components and pages
- **2025-01-17:** Defined data schemas and storage interface
- **2025-01-17:** Configured design system with Inter font
- **2025-01-17:** Created sample CSV file with 25 test records
- **2025-01-17:** Added comprehensive README with setup instructions
