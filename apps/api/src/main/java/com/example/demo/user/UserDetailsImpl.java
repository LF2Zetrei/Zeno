package com.example.demo.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

/**
 * Implémentation personnalisée de UserDetails utilisée par Spring Security.
 * Cette classe encapsule les informations essentielles d'un utilisateur pour l'authentification et l'autorisation.
 */
public class UserDetailsImpl implements UserDetails {

    private final UUID id;
    private final String email;
    private final String password;
    private final String role;

    /**
     * Constructeur qui initialise les données de l'utilisateur à partir de l'entité User.
     *
     * @param user L'objet User contenant les informations de l'utilisateur.
     */
    public UserDetailsImpl(User user) {
        this.id = user.getIdUser();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.role = user.getRole();
    }

    /**
     * Retourne l'identifiant unique de l'utilisateur.
     *
     * @return l'UUID de l'utilisateur.
     */
    public UUID getId() {
        return id;
    }

    /**
     * Retourne le rôle de l'utilisateur (ex: USER, ADMIN).
     *
     * @return le rôle sous forme de chaîne.
     */
    public String getRole() {
        return role;
    }

    /**
     * Retourne les autorités accordées à l'utilisateur.
     * Ici, la liste est vide, mais on pourrait retourner une collection de rôles plus complexe.
     *
     * @return une collection des rôles/authorities, vide dans cette implémentation.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
        // Exemple : Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }

    /**
     * Retourne le mot de passe codé de l'utilisateur.
     *
     * @return le mot de passe.
     */
    @Override
    public String getPassword() {
        return password;
    }

    /**
     * Retourne le nom d'utilisateur utilisé pour l'authentification.
     * Ici, c'est l'email.
     *
     * @return l'email de l'utilisateur.
     */
    @Override
    public String getUsername() {
        return email;
    }

    /**
     * Indique si le compte de l'utilisateur n'est pas expiré.
     *
     * @return true si le compte est actif (non expiré), sinon false.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indique si le compte de l'utilisateur n'est pas verrouillé.
     *
     * @return true si le compte n'est pas verrouillé, sinon false.
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Indique si les informations d'identification (mot de passe) ne sont pas expirées.
     *
     * @return true si les credentials sont valides, sinon false.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Indique si le compte de l'utilisateur est activé.
     *
     * @return true si le compte est activé, sinon false.
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}
