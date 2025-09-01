package com.learning.api.service;

import com.learning.api.entity.Admin;

import java.util.List;

public interface AdminService {

    void addAdmin(Admin admin);

    String updateAdmin(Admin admin);

    void deleteAdmin(Long id);

    Admin findAdminById(Long id);

    Admin findAdminByUsername(String username);

    Admin findAdminByEmail(String email);

    List<Admin> findAllAdmins();

    void login(Admin admin);

    Admin getAdmin();
}
