package com.lerning.api.service;

import com.lerning.api.entity.BlogData;
import com.lerning.api.entity.GetAllBlog;
import com.lerning.api.entity.User;
import com.lerning.api.exception.UserNotFoundException;
import com.lerning.api.repositories.BlogRepo;
import com.lerning.api.repositories.UserRepo;
import com.mongodb.client.model.Aggregates;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class BlogService {


    private final BlogRepo blogRepo;
    private final UserRepo userRepo;
    private final Logger logger = LoggerFactory.getLogger(BlogService.class);

    BlogService(BlogRepo blogRepo, UserRepo userRepo) {
        this.blogRepo = blogRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public BlogData saveBlogData(BlogData blog) {
        blog.setTime(LocalDateTime.now());
        blog.setId(UUID.randomUUID().toString());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> userOp = userRepo.findByEmail(email);
        if (userOp.isPresent()) {
            User user = userOp.get();
            blog.setUserId(user.getId());
            blog.setCategory("demo");
            BlogData savedBlog = blogRepo.save(blog);
            user.getBlogId().add(savedBlog.getId());
            userRepo.save(user);
            return savedBlog;
        } else throw new UserNotFoundException("Failed to create blog!");
    }

    public List<BlogData> getAllBlogs() {
        return blogRepo.findAll();
    }

    public List<BlogData> getAllBlogsOfUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOp = userRepo.findByEmail(email);

        return userOp.map(user -> blogRepo.findAllById(user.getBlogId().stream().map(BlogData::getId).toList())).orElseGet(ArrayList::new);
    }

    public GetAllBlog geBlogDataById(String id) throws Exception {
        List<GetAllBlog> blogs = getAllBlogsWithUserInfo();
        Optional<BlogData> optionalBlog = blogRepo.findById(id);
        if (optionalBlog.isPresent()) {
            Optional<GetAllBlog> blog = blogs.stream().filter((b) -> b.getBlog().equals(optionalBlog.get())).findFirst();
            if (blog.isPresent()) return blog.get();
            else throw new Exception("Blog data not found");
        } else throw new Exception("Blog data not found");
    }

    public BlogData updateBlog(String id, BlogData update) throws Exception {
        BlogData blog = blogRepo.findById(id).get();
        if (blog == null) throw new Exception("Invalid data");
        else {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepo.findByEmail(email).get();
            if (user.getBlogs().contains(blog)) {
                if (update.getContent() != null) blog.setContent(update.getContent());
                if (update.getTitle() != null) blog.setTitle(update.getTitle());
                if (update.getCoverImage() != null) blog.setCoverImage(update.getCoverImage());
                return blogRepo.save(blog);
            } else throw new Exception("Invalid user");
        }
    }

    @Transactional
    public void deleteBlog(String id) throws Exception {
        try {
            // Get and check the block if exist or throw exception
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepo.findByEmail(email).get();
            BlogData blog = blogRepo.findById(id).get();
            if (user.getBlogs().contains(blog)) {
                user.getBlogs().removeIf(b -> b.getId().equals(id));
                blogRepo.deleteById(id);
                userRepo.save(user);
            } else throw new Exception("Invalid user");
        } catch (Exception e) {
            logger.error(e.getMessage());
            throw new Exception("Blog not found");
        }

    }

    public List<GetAllBlog> searchBlogData(String title) throws Exception {
        try {
            Optional<List<BlogData>> blogsOptional = blogRepo.findAllByTitleContainingOrderByTimeDesc(title);
            if (blogsOptional.isPresent()) {
                List<BlogData> blogs = blogsOptional.get();
                List<User> users = userRepo.findAll();

                return users.stream().flatMap(user -> user.getBlogs().stream().filter(blogs::contains).map(blogData -> new GetAllBlog(user.getId(), user.getName(), user.getPhoto(), blogData))).collect(Collectors.toList());
            } else throw new Exception("Blog not found");
        } catch (Exception e) {
            logger.error(e.getMessage());
            throw new Exception("Blog not found");
        }
    }

    public List<GetAllBlog> searchByCategory(String category) {
        try {
            List<BlogData> blogs = blogRepo.findAllByCategory(category);
            if (blogs.isEmpty()) throw new IllegalArgumentException("Not found");
            return blogs.stream().map(blogData -> {
                Optional<User> userOptional = userRepo.findById(blogData.getUserId());
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    return new GetAllBlog(blogData.getId(), user.getUsername(), user.getPhoto(), blogData);
                } else return new GetAllBlog(null, null, null, blogData);
            }).collect(Collectors.toList());


        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<GetAllBlog> getAllBlogsWithUserInfo() {
        List<User> users = userRepo.findAll();
        // List<GetAllBlog> getAllBlogs = new ArrayList<>();
        return users.stream().flatMap(user -> user.getBlogs().stream().map(blog -> new GetAllBlog(user.getId(), user.getName(), user.getPhoto(), blog)
                // getAllBlogs.add(getAllBlog);
        )).collect(Collectors.toList());

    }

}
