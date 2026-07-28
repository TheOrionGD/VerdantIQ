package com.verdantiq.backend;

import com.verdantiq.backend.controller.CommunityController;
import com.verdantiq.backend.security.JwtAuthenticationFilter;
import com.verdantiq.backend.security.JwtTokenProvider;
import com.verdantiq.backend.security.SecurityConfig;
import com.verdantiq.backend.service.CommunityService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CommunityController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class SecurityRoleAccessTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommunityService communityService;

    @MockBean
    private com.verdantiq.backend.service.FileStorageService fileStorageService;

    @MockBean
    private JwtTokenProvider tokenProvider;

    @Test
    @DisplayName("Should return 403 Forbidden when STANDARD_USER accesses role-gated admin endpoint")
    @WithMockUser(username = "student@greenfield.edu", roles = {"STANDARD_USER"})
    void adminEndpoint_ForbiddenForStandardUser() throws Exception {
        mockMvc.perform(get("/api/v1/admin/verifications"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should return 200 OK when INSTITUTION_ADMIN accesses role-gated admin endpoint")
    @WithMockUser(username = "admin@greenfield.edu", roles = {"INSTITUTION_ADMIN"})
    void adminEndpoint_AllowedForInstitutionAdmin() throws Exception {
        when(communityService.getPendingVerifications(any())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/admin/verifications"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should return 200 OK when SYSTEM_ADMIN accesses role-gated admin endpoint")
    @WithMockUser(username = "sysadmin@verdantiq.io", roles = {"SYSTEM_ADMIN"})
    void adminEndpoint_AllowedForSystemAdmin() throws Exception {
        when(communityService.getPendingVerifications(any())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/admin/verifications"))
                .andExpect(status().isOk());
    }
}
