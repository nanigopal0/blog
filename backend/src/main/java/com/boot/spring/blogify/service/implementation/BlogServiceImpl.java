package com.boot.spring.blogify.service.implementation;

import com.boot.spring.blogify.dto.blog.BlogDTO;
import com.boot.spring.blogify.dto.blog.BlogPostDTO;
import com.boot.spring.blogify.dto.blog.BlogSummaryDTO;
import com.boot.spring.blogify.dto.blog.UpdateBlogRequest;
import com.boot.spring.blogify.entity.blog.BlogData;
import com.boot.spring.blogify.entity.blog.Category;
import com.boot.spring.blogify.entity.user.User;
import com.boot.spring.blogify.exception.BlogNotFoundException;
import com.boot.spring.blogify.exception.CategoryNotFoundException;
import com.boot.spring.blogify.exception.UserNotFoundException;
import com.boot.spring.blogify.repositories.BlogReactionRepo;
import com.boot.spring.blogify.repositories.BlogRepo;
import com.boot.spring.blogify.repositories.CategoryRepo;
import com.boot.spring.blogify.service.BlogService;
import com.boot.spring.blogify.service.UserService;
import com.boot.spring.blogify.util.GeneralMethod;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

import static com.boot.spring.blogify.util.GeneralMethod.getPageable;

@Service
@Slf4j
public class BlogServiceImpl implements BlogService {

    private final BlogRepo blogRepo;
    private final CategoryRepo categoryRepo;
    private final BlogReactionRepo blogReactionRepo;
    private final UserService userService;

    BlogServiceImpl(
            BlogRepo blogRepo,
            CategoryRepo categoryRepo,
            BlogReactionRepo blogReactionRepo,
            @Lazy UserService userService) {
        this.blogRepo = blogRepo;
        this.categoryRepo = categoryRepo;
        this.blogReactionRepo = blogReactionRepo;
        this.userService = userService;
    }


    @Transactional
    @Override
    public void createNewBlog(BlogPostDTO blog) throws UserNotFoundException {
        Category category = categoryRepo.findById(blog.getCategoryId()).orElseThrow(() ->
                new CategoryNotFoundException(" Id: " + blog.getCategoryId()));
        User user = userService.findById(blog.getUserId());
        BlogData blogData = new BlogData();
        blogData.setUser(user);
        blogData.setContent(blog.getContent());
        blogData.setCategory(category);
        blogData.setCreatedAt(LocalDateTime.now());
        blogData.setTitle(blog.getTitle());
        blogData.setCoverImage(blog.getCoverImage());

        blogRepo.save(blogData);
    }


    @Override
    public PagedModel<BlogSummaryDTO> getAllBlogsOfUser(Long userId, String sortBy, String sortOrder, int pageNumber, int pageSize) {
        GeneralMethod.validateSortByType(sortBy, BlogData.class);
        Pageable pageable = getPageable(sortBy, sortOrder, pageNumber, pageSize);
        return new PagedModel<>(blogRepo.findAllBlogsByUserId(userId, pageable));
    }

    @Override
    public BlogDTO getBlogById(Long blogId) {
        return blogRepo.findBlogById(blogId, GeneralMethod.getCurrentUser().getId());
    }

    @Override
    @Transactional
    public void updateBlog(Long blogId, UpdateBlogRequest request) {
        Long userId = GeneralMethod.findAuthenticatedUserId();
        BlogData blog = findBlogById(blogId);
        if (!Objects.equals(blog.getUser().getId(), userId))
            throw new AccessDeniedException("You are not authorized to update this blog!");

        if (request.content() != null) blog.setContent(request.content());
        if (request.title() != null) blog.setTitle(request.title());
        if (request.coverImage() != null) blog.setCoverImage(request.coverImage());
        blogRepo.save(blog);
    }

    @Override
    public Long countTotalBlogsByUserId(Long userId) {
        return blogRepo.countByUser_Id(userId);
    }

    @Override
    @Transactional
    public void deleteBlog(Long blogId) {
        findBlogById(blogId);
        blogReactionRepo.deleteAllByBlogId(blogId); //all blog reaction delete
        blogRepo.deleteById(blogId);
    }

    @Override
    public BlogData findBlogById(Long blogId) {
        return blogRepo.findById(blogId).orElseThrow(() -> new BlogNotFoundException(" Id: " + blogId));
    }

    @Override
    public void deleteAllBlogsByUserId(Long userId) {
        blogRepo.deleteAllByUserId(userId);
    }

    @Override
    public PagedModel<BlogSummaryDTO> searchBlogs(String title, String sortBy, String sortOrder, int pageNumber, int pageSize) {
        GeneralMethod.validateSortByType(sortBy, BlogData.class);
        Pageable pageable = getPageable(sortBy, sortOrder, pageNumber, pageSize);
        return new PagedModel<>(blogRepo.findByTitleStartsWith(title, pageable));
    }

    @Override
    public PagedModel<BlogSummaryDTO> getAllBlogsByCategory(
            Long categoryId, String sortOrder, String sortBy, int pageNumber, int pageSize
    ) {
        GeneralMethod.validateSortByType(sortBy, BlogData.class);
        Pageable pageable = getPageable(sortBy, sortOrder, pageNumber, pageSize);
        return new PagedModel<>(blogRepo.findAllByCategoryId(categoryId, pageable));
    }


    @Override
    public PagedModel<BlogSummaryDTO> getAllBlogs(int pageNumber, int pageSize, String sortBy, String sortOrder) {
        GeneralMethod.validateSortByType(sortBy, BlogData.class);
        Pageable pageable = getPageable(sortBy, sortOrder, pageNumber, pageSize);
        return new PagedModel<>(blogRepo.findAllBy(pageable));
    }


}
