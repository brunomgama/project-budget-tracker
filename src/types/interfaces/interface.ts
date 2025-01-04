// Interface representing a project entity containing an ID and name.
export interface Project {
    id: number;
    name: string;
}

// Interface for the API response containing a list of projects.
export interface APIProjectResponse {
    projects: Project[];
}

// Interface representing a budget entity, including details like project association and category.
export interface Budget {
    id: number;
    name: string;
    totalamount: number;
    projectid: number;
    categoryid: number;
}

// Interface for the API response containing a list of budgets.
export interface APIBudgetResponse {
    budgets: Budget[];
}

// Interface representing an expense entity, detailing the amount, description, date, and related budget and category IDs.
export interface Expense {
    id: number;
    amount: number;
    description: string;
    date: string;  // Recommended format: YYYY-MM-DD for consistency.
    budgetid: number;
    categoryid: number;
}

// Interface for the API response containing a list of expenses.
export interface APIExpenseResponse {
    expenses: Expense[];
}

// Interface representing a project manager entity with an ID and name.
export interface Manager {
    id: number;
    name: string;
}

// Interface for the API response containing a list of managers.
export interface APIManagerResponse {
    managers: Manager[];
}

// Interface representing an expense or budget category.
export interface Category {
    id: number;
    name: string;
}

// Interface for the API response containing a list of categories.
export interface APICategoryResponse {
    categories: Category[];
}