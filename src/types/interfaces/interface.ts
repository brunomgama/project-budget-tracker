export interface Project {
    id: number;
    name: string;
}

export interface APIResponse {
    projects: Project[];
}