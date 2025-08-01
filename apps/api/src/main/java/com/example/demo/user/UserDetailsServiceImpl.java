package com.example.demo.user;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Service d'implémentation de UserDetailsService pour Spring Security.
 * Ce service charge les détails utilisateur à partir de la base de données pour l'authentification.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository; // Référencement du repository User pour accès aux données.

    /**
     * Constructeur injectant le repository User.
     *
     * @param userRepository Le repository JPA permettant d'accéder aux données utilisateur.
     */
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Charge un utilisateur à partir de son identifiant (ici, l'email).
     *
     * @param username L'identifiant de l'utilisateur (email ou pseudo selon choix).
     * @return Un objet UserDetails encapsulant les informations nécessaires à Spring Security.
     * @throws UsernameNotFoundException si aucun utilisateur n'est trouvé avec cet identifiant.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username) // Recherche par email
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        return new UserDetailsImpl(user);
    }
}
