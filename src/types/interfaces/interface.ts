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
}

export interface APIExpenseResponse {
    expenses: Expense[];
}