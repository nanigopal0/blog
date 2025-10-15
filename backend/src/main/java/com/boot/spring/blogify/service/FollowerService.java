package com.boot.spring.blogify.service;

import com.boot.spring.blogify.dto.UserOverviewDTO;
import org.springframework.data.domain.Page;

public interface FollowerService {

    void follow(Long followedId);

    void unfollow(Long followedId);

    boolean isFollowing(Long userId, Long followedId);

    /**
     * Return all followers of a user
     */
    Page<UserOverviewDTO> getAllFollowers(Long userId, String sortBy, String sortOrder, int pageNumber, int pageSize);

    /**
     * Return all followings of the specific user
     */
    Page<UserOverviewDTO> getAllFollowings(Long userId, String sortBy, String sortOrder, int pageNumber, int pageSize);

    Long getFollowerCount(Long userId);

    Long getFollowingCount(Long userId);

    void deleteAllFollowersByUserId(Long userId);

    void deleteAllFollowingsByUserId(Long userId);
}
