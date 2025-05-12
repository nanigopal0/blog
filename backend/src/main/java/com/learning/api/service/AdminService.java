package com.learning.api.service;

import com.learning.api.entity.Admin;
import org.bson.types.ObjectId;

import java.util.List;

public interface AdminService {

    void addAdmin(Admin admin);

    String updateAdmin(Admin admin);

    void deleteAdmin(ObjectId id);

    Admin findAdminById(ObjectId id);

    Admin findAdminByUsername(String username);

    Admin findAdminByEmail(String email);

    List<Admin> findAllAdmins();

    void login(Admin admin);

    Admin getAdmin();
}
