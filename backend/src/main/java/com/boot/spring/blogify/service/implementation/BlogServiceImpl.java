package com.boot.spring.blogify.service.implementation;

import com.boot.spring.blogify.dto.BlogDataDTO;
import com.boot.spring.blogify.dto.BlogOverviewDTO;
import com.boot.spring.blogify.dto.BlogPostDTO;
import com.boot.spring.blogify.dto.BlogReactionResponseDTO;
import com.boot.spring.blogify.entity.BlogData;
import com.boot.spring.blogify.entity.BlogReaction;
import com.boot.spring.blogify.entity.Category;
import com.boot.spring.blogify.entity.User;
import com.boot.spring.blogify.exception.BlogNotFoundException;
import com.boot.spring.blogify.exception.CategoryNotFoundException;
import com.boot.spring.blogify.exception.UserNotFoundException;
import com.boot.spring.blogify.repositories.BlogReactionRepo;
import com.boot.spring.blogify.repositories.BlogRepo;
import com.boot.spring.blogify.repositories.CategoryRepo;
import com.boot.spring.blogify.repositories.UserRepo;
import com.boot.spring.blogify.service.BlogService;
import com.boot.spring.blogify.service.CommentService;
import com.boot.spring.blogify.util.EntityToDTO;
import com.boot.spring.blogify.util.GeneralMethod;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.boot.spring.blogify.util.GeneralMethod.getPageable;

@Service
@Slf4j
public class BlogServiceImpl implements BlogService {

    private final BlogRepo blogRepo;
    private final UserRepo userRepo;
    private final CommentService commentService;
    private final CategoryRepo categoryRepo;
    private final EntityToDTO entityToDTO;
    private final BlogReactionRepo blogReactionRepo;

    BlogServiceImpl(BlogRepo blogRepo, UserRepo userRepo, CommentService commentService, CategoryRepo categoryRepo, EntityToDTO entityToDTO, BlogReactionRepo blogReactionRepo) {
        this.blogRepo = blogRepo;
        this.userRepo = userRepo;
        this.commentService = commentService;
        this.categoryRepo = categoryRepo;
        this.entityToDTO = entityToDTO;
        this.blogReactionRepo = blogReactionRepo;
    }


    @Transactional
    @Override
    public void createNewBlog(BlogPostDTO blog) throws UserNotFoundException {
        Category category = categoryRepo.findById(blog.getCategoryId()).orElseThrow(() ->
                new CategoryNotFoundException(" Id: " + blog.getCategoryId()));
        User user = userRepo.findById(blog.getUserId()).orElseThrow(() ->
                new UserNotFoundException("User not found! Id: " + blog.getUserId()));

        BlogData blogData = new BlogData();
        blogData.setUser(user);
        blogData.setContent(blog.getContent());
        blogData.setCategory(category);
        blogData.setTime(LocalDateTime.now());
        blogData.setTitle(blog.getTitle());
        blogData.setCoverImage(blog.getCoverImage());

        blogRepo.save(blogData);
    }


    @Override
    public Page<BlogOverviewDTO> getAllBlogsOfUser(Long userId, String sortBy, String sortOrder, int pageNumber, int pageSize) {
        Pageable pageable = getPageable(sortBy, sortOrder, pageNumber, pageSize);
        return blogRepo.findAllBlogsByUserId(userId, pageable);
    }

    @Override
    public BlogDataDTO getBlogById(Long blogId) {
        BlogData blog = blogRepo.findById(blogId).orElseThrow(() -> new BlogNotFoundException(" Id: " + blogId));
        Long count = blogReactionRepo.countBlogReactionsByBlogId(blogId);
        Optional<BlogReaction> reaction = blogReactionRepo.findBlogReactionIdByUserIdAndBlogId(GeneralMethod.getCurrentUser().getId(), blogId);
        BlogReactionResponseDTO dto = BlogReactionResponseDTO.builder()
                .reactionId(reaction.isPresent() ? reaction.get().getId() : 0L)
                .totalLikes(count)
                .build();
        return entityToDTO.convertBlogDataToBlogDataDTO(blog, dto);
    }


    @Override
    @Transactional
    public void updateBlog(BlogDataDTO update) {
        BlogData blog = blogRepo.findById(update.getId()).orElseThrow(() -> new BlogNotFoundException(" Id: " + update.getId()));
        if (update.getContent() != null) blog.setContent(update.getContent());
        if (update.getTitle() != null) blog.setTitle(update.getTitle());
        if (update.getCoverImage() != null) blog.setCoverImage(update.getCoverImage());
        blogRepo.save(blog);
    }

    @Override
    public Long countTotalBlogsByUserId(Long userId) {
        return blogRepo.countByUser_Id(userId);
    }

    @Override
    @Transactional
    public void deleteBlog(Long blogId) {
        blogRepo.findById(blogId).orElseThrow(() -> new BlogNotFoundException(" Id: " + blogId));
        commentService.deleteAllCommentsByBlogId(blogId);  //all comments delete
        blogReactionRepo.deleteAllByBlogId(blogId); //all blog reaction delete
        blogRepo.deleteById(blogId);
    }

    @Override
    public void deleteAllBlogsByUserId(Long userId) {
        blogRepo.deleteAllByUserId(userId);
    }

    @Override
    public Page<BlogOverviewDTO> searchBlogs(String title, String sortBy, String sortOrder, int pageNumber, int pageSize) {
        Pageable pageable = getPageable(sortBy, sortOrder, pageNumber, pageSize);
        return blogRepo.findByTitleStartsWith(title, pageable);
    }

    @Override
    public Page<BlogOverviewDTO> getAllBlogsByCategory(
            Long categoryId, String sortOrder, String sortBy, int pageNumber, int pageSize
    ) throws BlogNotFoundException {
        Pageable pageable = getPageable(sortBy, sortOrder, pageNumber, pageSize);
        return blogRepo.findAllByCategoryId(categoryId, pageable);
    }


    @Override
    public Page<BlogOverviewDTO> getAllBlogs(int pageNumber, int pageSize, String sortBy, String sortOrder) {
        Pageable pageable = getPageable(sortBy, sortOrder, pageNumber, pageSize);
        return blogRepo.findAllBy(pageable);
    }


}
