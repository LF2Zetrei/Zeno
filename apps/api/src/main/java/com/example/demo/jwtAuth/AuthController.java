package com.example.demo.jwtAuth;

import com.example.demo.user.UserDetailsImpl;
import com.example.demo.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.user.User;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    /**
     * Authentifie un utilisateur à partir de ses identifiants (pseudo ou email + mot de passe).
     * En cas de succès, génère un jeton JWT à renvoyer au client.
     *
     * @param loginRequest les identifiants de connexion fournis par l'utilisateur
     * @return une réponse contenant le token JWT
     */
    @PostMapping("/login")
    public JwtResponse authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(
                ((UserDetailsImpl) authentication.getPrincipal()).getUsername()
        );

        return new JwtResponse(jwt);
    }

    /**
     * Enregistre un nouvel utilisateur si l'email et le pseudo ne sont pas déjà utilisés.
     * Encode le mot de passe avant la sauvegarde.
     *
     * @param request les informations de l'utilisateur à enregistrer
     * @return une réponse contenant l'identifiant de l'utilisateur ou une erreur si les identifiants sont déjà utilisés
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        if (userRepository.existsByPseudo(request.getPseudo())) {
            return ResponseEntity.badRequest().body("Pseudo déjà utilisé");
        }

        User user = new User();
        user.setLastName(request.getLastName());
        user.setFirstName(request.getFirstName());
        user.setPseudo(request.getPseudo());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setCountry(request.getCountry());
        user.setAddress(request.getAddress());
        user.setPostalCode(request.getPostalCode());
        user.setIdentityCardUrl(request.getIdentityCardUrl());
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        return ResponseEntity.ok(
                new RegisterResponse(user.getIdUser(), "Utilisateur enregistré avec succès")
        );
    }
}
