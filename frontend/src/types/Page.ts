export interface PaginatedResponse<T> {
    content: T[];
    page: Page;
}


export interface Page {
    size: number;
    number: number;
    totalPages: number;
    totalElements: number;
}