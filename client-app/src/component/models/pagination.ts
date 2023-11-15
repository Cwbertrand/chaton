export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T>{
    data: T;
    patination: Pagination

    constructor(data: T, pagination: Pagination) {
        this.data = data;
        this.patination = pagination;
    }
}

export class PagingParams {
    pageNumber;
    pageSize;

    constructor(pageNumber = 1, pageSize = 2){
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}
