# Project Budget Tracker

## Overview

The **Project Budget Tracker** is a web application designed to help project managers manage project budgets and expenses. The app includes features for tracking budgets, managing expenses, creating reports, and visualizing data across various categories and date ranges.

---

## **Table of Contents**

1. [Database Choice](#database-choice)
2. [Tech Stack](#tech-stack)
3. [Libraries Used](#libraries-used)
4. [Project Structure](#project-structure)
5. [Database Objects](#database-objects)
6. [Starting the Database](#starting-the-database)
7. [Starting the Server](#starting-the-server)
8. [Shadcn UI Overview](#shadcn-ui-overview)

---

## **Database Choice**

### **SQLite (File-based)**

#### **When to Use:**
A lightweight, embedded database with minimal setup.

#### **Pros:**
- Easy to set up and use.
- No separate server required.
- Suitable for small-scale projects.

#### **Cons:**
- Not ideal for concurrent writes in large-scale projects.
- Limited scalability.

#### **Recommendation:**
I've chosen SQLite because it offers simplicity and suits our needs for a lightweight, embedded database. It is ideal for small-scale applications that do not require extensive concurrency or scalability.

[Learn more about SQLite](https://www.sqlite.org/index.html)

### **Other Database Options Considered**

#### **PostgreSQL (Relational DB)**
- **Pros:**
    - Supports complex queries and relationships.
    - Highly reliable and scalable.
    - Open-source.
- **Cons:**
    - Requires more setup than SQLite.
    - Overkill for small-scale projects.
- **Reason Not Chosen:** The project does not require the advanced features of PostgreSQL.

#### **MongoDB (NoSQL)**
- **Pros:**
    - Flexible schema with JSON-like storage.
    - Good for hierarchical or unstructured data.
- **Cons:**
    - Less suited for relational data.
    - Complex queries can be challenging.
- **Reason Not Chosen:** The application’s data is better structured relationally.

#### **Firebase Realtime Database or Firestore (NoSQL, Cloud-based)**
- **Pros:**
    - Real-time updates.
    - Backend-as-a-service with minimal setup.
- **Cons:**
    - Cost increases with usage.
    - Limited for complex queries.
- **Reason Not Chosen:** Cost and real-time capabilities are not priorities for this project.

---

## **Tech Stack**

### **Frontend:**
- **Framework:** Next.js (v15.1.3), React (v19.0.0)
- **Styling:** Tailwind CSS, clsx, tailwind-merge
- **Form Validation:** react-hook-form, zod for schema validation
- **Icons:** lucide-react, react-icons
- **Charts:** recharts for data visualizations
- **Components:** Radix UI for accessible UI components

### **Backend:**
- **Database:** SQLite3
- **Query Builder:** Knex.js (v3.1.0)

### **Development Tools:**
- TypeScript for type safety
- ESLint for linting and code formatting

---

## **Libraries Used**

| Library             | Purpose                                          | Installation Command                  |
|---------------------|--------------------------------------------------|----------------------------------------|
| `sqlite3`           | SQLite client for Node.js                        | `npm install sqlite3`                  |
| `knex`              | SQL query builder for Node.js                    | `npm install knex`                     |
| `react-hook-form`   | Form handling for React                          | `npm install react-hook-form`          |
| `zod`               | Schema validation                                | `npm install zod`                      |
| `recharts`          | Data visualization library                       | `npm install recharts`                 |
| `tailwindcss`       | Utility-first CSS framework                      | `npm install tailwindcss`              |
| `radix-ui`          | UI primitives (dialog, popover, select, etc.)    | Included via individual Radix imports  |

---

## **Project Structure**

```bash
src/
├── app/
│   ├── api/                # API routes for CRUD operations
│   ├── budgets/            # Budget-related pages and components
│   ├── categories/         # Category-related pages and components
│   ├── expenses/           # Expense-related pages and components
│   ├── managers/           # Manager-related pages and components
│   └── projects/           # Project-related pages and components
├── components/             # Reusable UI components (e.g., buttons, tables, charts)
├── db/                     # Database connection and setup
│   ├── database.js         # SQLite setup
│   ├── migrations/         # Database schema migrations
│   └── seeds/              # Sample seed data (optional)
├── styles/                 # Global styles and Tailwind CSS configuration
└── types/interfaces/       # TypeScript interfaces and type definitions
```

## **Database Objects**

### **Project**
- `id`: Unique identifier.
- `name`: Name of the project.

### **Manager**
- `id`: Unique identifier.
- `name`: Name of the manager.

### **Budget**
- `id`: Unique identifier.
- `name`: Name of the budget.
- `totalAmount`: Total allocated amount for the budget.
- `projectId`: Foreign key linking to the associated project.
- `categoryId`: Foreign key linking to the associated category.

### **Expense**
- `id`: Unique identifier.
- `amount`: Expense amount.
- `description`: Description of the expense.
- `date`: Date when the expense was made.
- `budgetId`: Foreign key linking to the related budget.
- `categoryId`: Foreign key linking to the associated category.

### **Category**
- `id`: Unique identifier.
- `name`: Name of the category.
- `color`: Color associated with the category for visual representation.

---

## **Starting the Database**

1. Open a terminal in project directory
2. Run the following command to apply the migrations and create the database schema:
```bash
node src/db/migrations/createTables.js
```
3. (Optional) Seed the database with initial sample data.
```bash
node src/db/seeds/seedData.js
```
## **Starting the Server**

To run the development server:
```bash
npm run dev
```
Open your browser and navigate to http://localhost:3000.

## **Shadcn UI Overview**

The **Shadcn UI** is a set of highly customizable UI components built using Radix Primitives, providing accessible and composable UI elements for modern web applications.

### **Commonly Used Components:**

1. **Tabs**
    - Used to navigate between "Overview", "Analytics", and "Reports" sections.
    - [Documentation](https://www.radix-ui.com/docs/primitives/components/tabs)

2. **Card**
    - Displays summarized information such as "Total Projects", "Total Budgets", and "Total Expenses".
    - [Documentation](https://www.radix-ui.com/docs/primitives/components/card)

3. **Dialog**
    - Modal pop-up used for forms to create or update data (e.g., projects, budgets, categories, and expenses).
    - [Documentation](https://www.radix-ui.com/docs/primitives/components/dialog)

4. **Input**
    - Used for user inputs in forms (e.g., entering names, amounts, or descriptions).
    - [Documentation](https://www.radix-ui.com/docs/primitives/components/input)

5. **Select**
    - Dropdown component used for selecting categories, budgets, or project associations.
    - [Documentation](https://www.radix-ui.com/docs/primitives/components/select)

6. **Popover and Calendar**
    - Used in the date picker component for selecting date ranges.
    - [Documentation for Popover](https://www.radix-ui.com/docs/primitives/components/popover)
