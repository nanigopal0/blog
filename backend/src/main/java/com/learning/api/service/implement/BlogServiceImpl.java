package com.learning.api.service.implement;

import com.learning.api.dto.BlogDataDTO;
import com.learning.api.dto.CategoryDTO;
import com.learning.api.dto.PageResponse;
import com.learning.api.entity.BlogData;
import com.learning.api.entity.Category;
import com.learning.api.entity.User;
import com.learning.api.exception.BlogNotFoundException;
import com.learning.api.exception.UserNotFoundException;
import com.learning.api.repositories.BlogRepo;
import com.learning.api.repositories.CategoryRepo;
import com.learning.api.repositories.CommentRepo;
import com.learning.api.repositories.UserRepo;
import com.learning.api.service.BlogService;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class BlogServiceImpl implements BlogService {

    private final BlogRepo blogRepo;
    private final UserRepo userRepo;
    private final CommentRepo commentRepo;
    private final CategoryRepo categoryRepo;

    BlogServiceImpl(BlogRepo blogRepo, UserRepo userRepo, CommentRepo commentRepo, CategoryRepo categoryRepo) {
        this.blogRepo = blogRepo;
        this.userRepo = userRepo;
        this.commentRepo = commentRepo;
        this.categoryRepo = categoryRepo;
    }


    @Override
    public void createNewBlog(BlogData blog) throws UserNotFoundException {
        blog.setTime(LocalDateTime.now());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> userOp = userRepo.findByEmail(email);
        if (userOp.isPresent()) {
            User user = userOp.get();
            blog.setUserId(user.getId());
            blog.setCategoryId(blog.getCategoryId());
            blogRepo.save(blog);
//            userRepo.save(user);
        } else throw new UserNotFoundException("User not found!");
    }


    @Override
    public PageResponse<BlogDataDTO> getAllBlogsOfUser(ObjectId userId, String sortBy, String sortOrder, int pageNumber, int pageSize) {
        User user = userRepo.findById(userId).orElseThrow(() -> new UserNotFoundException(userId.toHexString()));
        Pageable pageable = getPageable(sortBy, sortOrder, pageNumber, pageSize);
        Page<BlogDataDTO> blogsPage = blogRepo.findBlogsByUserId(user.getId(), pageable);
        List<BlogDataDTO> blogs = blogsPage.getContent().stream().peek(bp -> {
            bp.setUserPhoto(user.getPhoto());
            bp.setUserId(user.getId().toHexString());
            bp.setUsername(user.getUsername());
            bp.setUserFullName(user.getName());
        }).toList();
        return convertBlogDataDTOPageToPageResponse(new PageImpl<>(blogs, pageable, blogsPage.getTotalElements()));
    }

    @Override
    public BlogDataDTO getBlogById(ObjectId id, String sortBy, String sortOrder, int pageNumber, int pageSize) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
        BlogDataDTO blogById = blogRepo.findBlogById(id, user.getId(), getPageable(sortBy, sortOrder, pageNumber, pageSize));
        if (blogById == null) throw new BlogNotFoundException("Blog not found!");
        return blogById;
    }

    @Override
    public void updateBlog(BlogDataDTO update) {
        BlogData blog = blogRepo.findById(new ObjectId(update.getId())).orElseThrow(BlogNotFoundException::new);
        if (update.getContent() != null) blog.setContent(update.getContent());
        if (update.getTitle() != null) blog.setTitle(update.getTitle());
        if (update.getCoverImage() != null) blog.setCoverImage(update.getCoverImage());
        blogRepo.save(blog);
    }

    @Override
    @Transactional
    public void deleteBlog(ObjectId id) {
        blogRepo.findById(id).orElseThrow(() -> new BlogNotFoundException(id.toHexString()));
        blogRepo.deleteById(id);
        commentRepo.deleteAllByBlogId(id);
    }

    @Override
    public PageResponse<BlogDataDTO> searchBlogs(String title, String sortBy, String sortOrder, int pageNumber, int pageSize) {
        Pageable pageable = getPageable(sortBy, sortOrder, pageNumber, pageSize);
        List<Category> categories = categoryRepo.findByCategoryStartsWith(title);
        List<BlogDataDTO> blogs = new ArrayList<>();
        List<Category> matchedCategories = categories.stream().filter((category) -> category.getCategory().startsWith(title)).toList();
        for (Category category : matchedCategories) {
            try {
                List<BlogDataDTO> blogsByCategory = blogRepo.findBlogsByCategory(category.getId(), pageable).getContent();
                blogsByCategory = blogsByCategory.stream().peek(b ->
                        b.setCategory(CategoryDTO.builder().category(category.getCategory()).id(category.getId().toHexString()).build())).toList();
                blogs.addAll(blogsByCategory);
            } catch (BlogNotFoundException ignored) {
            }
        }
        try {
            blogs.addAll(blogRepo.searchBlogsByTitle(title, pageable).getContent());
        } catch (BlogNotFoundException ignored) {
        }
        List<BlogDataDTO> uniqueBlogs = getUniqueBlogs(blogs);
        if (uniqueBlogs.isEmpty()) throw new BlogNotFoundException();
        return convertBlogDataDTOPageToPageResponse(new PageImpl<>(uniqueBlogs, pageable, uniqueBlogs.size()));
    }

    private List<BlogDataDTO> getUniqueBlogs(List<BlogDataDTO> content) {
        Map<String, BlogDataDTO> map = new HashMap<>();
        content.forEach(blog -> {
            if (!map.containsKey(blog.getId())) map.put(blog.getId(), blog);
        });
        return map.values().stream().toList();
    }

    @Override
    public PageResponse<BlogDataDTO> getAllBlogsByCategory(ObjectId categoryId, String sortOrder, String sortBy, int pageNumber, int pageSize)
            throws BlogNotFoundException {
        Page<BlogDataDTO> blogs;
        try {
            Pageable pageable = getPageable(sortBy, sortOrder, pageNumber, pageSize);
            blogs = blogRepo.findBlogsByCategory(categoryId, pageable);
            return convertBlogDataDTOPageToPageResponse(blogs);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public PageResponse<BlogDataDTO> getAllBlogs(int pageNumber, int pageSize, String sortBy, String sortOrder) throws BlogNotFoundException {
//        if (!checkBlogDataField(sortBy)) throw new IllegalArgumentException("Invalid sort by: " + sortBy);
        Sort sort = sortOrder.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<BlogDataDTO> blogDataPage = blogRepo.findAllBlogsWithUserInfo(pageable);
        return convertBlogDataDTOPageToPageResponse(blogDataPage);
    }

    private PageResponse<BlogDataDTO> convertBlogDataDTOPageToPageResponse(Page<BlogDataDTO> blogDataPage) {
        PageResponse<BlogDataDTO> pageResponse = new PageResponse<>();
        pageResponse.setPageNumber(blogDataPage.getNumber());
        pageResponse.setPageSize(blogDataPage.getSize());
        pageResponse.setTotalElements(blogDataPage.getTotalElements());
        pageResponse.setTotalPages(blogDataPage.getTotalPages());
        pageResponse.setContent(blogDataPage.getContent());
        pageResponse.setLastPage(blogDataPage.isLast());
        return pageResponse;
    }

    private Pageable getPageable(String sortBy, String sortOrder, int pageNumber, int pageSize) {
        Sort sort = sortOrder.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return PageRequest.of(pageNumber, pageSize, sort);
    }

}
