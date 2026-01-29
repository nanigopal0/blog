package com.boot.spring.blogify.service.implementation;

import com.boot.spring.blogify.dto.FollowOverviewDTO;
import com.boot.spring.blogify.dto.FollowResponseDTO;
import com.boot.spring.blogify.dto.user.UserOverviewDTO;
import com.boot.spring.blogify.repositories.FollowerRepo;
import com.boot.spring.blogify.service.FollowerService;
import com.boot.spring.blogify.util.GeneralMethod;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FollowerServiceImpl implements FollowerService {

    private final FollowerRepo followerRepo;


    public FollowerServiceImpl(FollowerRepo followerRepo) {
        this.followerRepo = followerRepo;
    }

    @Transactional
    @Override
    public FollowResponseDTO follow(Long followedId) {
        Long userId = GeneralMethod.findAuthenticatedUserId();
        if (userId.equals(followedId))
            throw new RuntimeException("You can't follow yourself");
        followerRepo.saveFollow(followedId, userId);
        return new FollowResponseDTO(true, getFollowerCount(followedId));
    }


    @Override
    @Transactional
    public FollowResponseDTO unfollow(Long followedId) {
        Long userId = GeneralMethod.findAuthenticatedUserId();
        Integer rowsAffected = followerRepo.deleteFollowByFollower_IdAndFollowed_Id(userId, followedId);
        if (rowsAffected <= 0)
            throw new RuntimeException("User id: " + followedId + " not found or you already unfollow this user!");
        return new FollowResponseDTO(false, getFollowerCount(followedId));
    }

    @Override
    public FollowOverviewDTO getFollowInfo(Long followedId) {
        Long userId = GeneralMethod.findAuthenticatedUserId();
        return followerRepo.existsFollowByFollowedIdAndUserId(followedId, userId);
    }

    @Override
    public PagedModel<UserOverviewDTO> getAllFollowers(Long userId,  int pageNumber, int pageSize) {
        Pageable pageable = GeneralMethod.getPageable(null, null, pageNumber, pageSize);
        return new PagedModel<>(followerRepo.findByFollowed_Id(userId, pageable));

    }

    @Override
    public PagedModel<UserOverviewDTO> getAllFollowings(Long userId, int pageNumber, int pageSize) {
        Pageable pageable = GeneralMethod.getPageable(null, null, pageNumber, pageSize);
        return new PagedModel<>(followerRepo.findByFollower_Id(userId, pageable));
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
