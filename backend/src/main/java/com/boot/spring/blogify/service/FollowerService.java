package com.boot.spring.blogify.service;

import com.boot.spring.blogify.dto.FollowOverviewDTO;
import com.boot.spring.blogify.dto.FollowResponseDTO;
import com.boot.spring.blogify.dto.user.UserOverviewDTO;
import org.springframework.data.web.PagedModel;

public interface FollowerService {

    FollowResponseDTO follow(Long followedId);

    FollowResponseDTO unfollow(Long followedId);

    FollowOverviewDTO getFollowInfo( Long followedId);

    /**
     * Return all followers of a user
     */
    PagedModel<UserOverviewDTO> getAllFollowers(Long userId, int pageNumber, int pageSize);

    /**
     * Return all followings of the specific user
     */
    PagedModel<UserOverviewDTO> getAllFollowings(Long userId, int pageNumber, int pageSize);

    Long getFollowerCount(Long userId);

    Long getFollowingCount(Long userId);

    void deleteAllFollowersByUserId(Long userId);

    void deleteAllFollowingsByUserId(Long userId);
}
