package com.learning.api.util;

import com.learning.api.dto.PageResponse;
import org.springframework.data.domain.Page;

public class PageResponseUtil<T> {
    public PageResponse<T> convertPageToPageResponse(Page<T> page) {
        PageResponse<T> pageResponse = new PageResponse<>();
        pageResponse.setPageNumber(page.getNumber());
        pageResponse.setPageSize(page.getSize());
        pageResponse.setTotalElements(pageResponse.getTotalElements());
        pageResponse.setTotalPages(page.getTotalPages());
        pageResponse.setLastPage(page.isLast());
        pageResponse.setContent(page.getContent());
        return pageResponse;
    }
}
