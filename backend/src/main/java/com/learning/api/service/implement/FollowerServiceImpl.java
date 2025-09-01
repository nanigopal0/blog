package com.learning.api.service.implement;

import com.learning.api.configuration.CustomUserDetails;
import com.learning.api.dto.UserOverviewDTO;
import com.learning.api.entity.Follow;
import com.learning.api.entity.User;
import com.learning.api.exception.UserNotFoundException;
import com.learning.api.repositories.FollowerRepo;
import com.learning.api.repositories.UserRepo;
import com.learning.api.service.FollowerService;
import com.learning.api.util.GeneralMethod;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FollowerServiceImpl implements FollowerService {

    private final FollowerRepo followerRepo;
    private final UserRepo userRepo;


    public FollowerServiceImpl(FollowerRepo followerRepo, UserRepo userRepo) {
        this.followerRepo = followerRepo;
        this.userRepo = userRepo;

    }

    private CustomUserDetails getCurrentUser() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Transactional
    @Override
    public void follow(Long followedId) {
        CustomUserDetails currentUser = getCurrentUser();
        if (currentUser.getId().equals(followedId)) {
            throw new RuntimeException("You can't follow yourself");
        }
        User current = findUserById(currentUser.getId());
        User followedUser = findUserById(followedId);

        Follow follow = new Follow();
        follow.setFollowed(followedUser);
        follow.setFollower(current);
        followerRepo.save(follow);
    }

    private User findUserById(Long userId) {
        return userRepo.findById(userId).orElseThrow(() ->
                new UserNotFoundException(" Id: " + userId));
    }

    @Override
    @Transactional
    public void unfollow(Long followedId) {
        CustomUserDetails currentUser = getCurrentUser();
        followerRepo.deleteFollowByFollower_IdAndFollowed_Id(currentUser.getId(), followedId);
    }

    @Override
    public boolean isFollowing(Long userId, Long followedId) {
        return followerRepo.existsFollowByFollowedIdAndFollowerId(followedId, userId);
    }

    @Override
    public Page<UserOverviewDTO> getAllFollowers(Long userId, String sortBy, String sortOrder, int pageNumber, int pageSize) {
        Pageable pageable = GeneralMethod.getPageable(sortBy, sortOrder, pageNumber, pageSize);
        return followerRepo.findByFollowed_Id(userId, pageable);

    }

    @Override
    public Page<UserOverviewDTO> getAllFollowings(Long userId, String sortBy, String sortOrder, int pageNumber, int pageSize) {
        Pageable pageable = GeneralMethod.getPageable(sortBy, sortOrder, pageNumber, pageSize);
        return followerRepo.findByFollower_Id(userId, pageable);
    }

    @Override
    public Long getFollowerCount(Long userId) {
        return followerRepo.countFollowByFollowed_Id(userId);
    }

    @Override
    public Long getFollowingCount(Long userId) {
        return followerRepo.countFollowByFollower_Id(userId);
    }

    public void deleteAllFollowersByUserId(Long userId) {
        followerRepo.deleteAllByFollowed_Id(userId);
    }

    public void deleteAllFollowingsByUserId(Long userId) {
        followerRepo.deleteAllByFollower_Id(userId);
    }
}
