package com.adobe.prj.entity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Collection;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {

    private String name;
    
    @Id
    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    private String bankName;

    private double bankBalance;
    
    private double initial_balance;
    
	private String balance_updated_date;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Return the user's authorities (roles) here
        // You can return a list of SimpleGrantedAuthority instances based on roles
        return null;
    }
    

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email; // You can use email or any other unique identifier
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Modify as needed
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Modify as needed
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Modify as needed
    }

    @Override
    public boolean isEnabled() {
        return true; // Modify as needed
    }
}
