export interface TodoType {
    ID?: number;
    task: string;
    author: string;
    status: boolean;
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string;
    
}

export interface SettingsType {
    name: string;
    email: string;
    "primary-color": string;
    "secondary-color": string;
    "background-image": string;
}