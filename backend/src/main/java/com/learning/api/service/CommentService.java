package com.learning.api.service;

import com.learning.api.dto.CommentDTO;
import com.learning.api.entity.Comment;
import org.bson.types.ObjectId;

public interface CommentService {

    CommentDTO saveComment(CommentDTO comment);

    String deleteComment(ObjectId commentID);

    String updateComment(CommentDTO comment);

    Comment getComment(ObjectId commentID);
}
