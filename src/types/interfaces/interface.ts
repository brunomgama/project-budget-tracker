export interface Project {
    id: number;
    name: string;
}

export interface APIProjectResponse {
    projects: Project[];
}

export interface Budget {
    id: number;
    name: string;
    totalamount: number;
    projectid: number;
    categoryid: number;
}

export interface APIBudgetResponse {
    budgets: Budget[];
}

export interface Expense {
    id: number;
    amount: number;
    description: string;
    date: string;
    budgetid: number;
    categoryid: number;
}

export interface APIExpenseResponse {
    expenses: Expense[];
}

export interface Manager {
    id: number;
    name: string;
}

export interface APIManagerResponse {
    managers: Manager[];
}

export interface Category {
    id: number;
    name: string;
}

export interface APICategoryResponse {
    categories: Category[];
}