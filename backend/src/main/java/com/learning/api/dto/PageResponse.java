package com.learning.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResponse<T> {
    long totalElements;
    int totalPages;
    List<T> content;
    int pageNumber;
    int pageSize;
    boolean isLastPage;
}
