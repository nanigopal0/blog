package com.boot.spring.blogify.dto;

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
    private long totalElements;
    private int totalPages;
    private List<T> content;
    private int pageNumber;
    private int pageSize;
    private boolean isLastPage;
}
