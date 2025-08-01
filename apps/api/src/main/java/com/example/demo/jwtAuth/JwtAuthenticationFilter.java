package com.example.demo.jwtAuth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtils jwtUtils, UserDetailsService userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Filtre de sécurité qui intercepte chaque requête HTTP pour valider le token JWT dans l'en-tête Authorization.
     * Si le token est valide, il configure le contexte de sécurité avec l'authentification de l'utilisateur.
     *
     * @param request      la requête HTTP entrante
     * @param response     la réponse HTTP
     * @param filterChain  la chaîne de filtres à exécuter après ce filtre
     * @throws ServletException en cas d'erreur de servlet
     * @throws IOException      en cas d'erreur d'entrée/sortie
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // Extraction du token JWT de l'en-tête Authorization si présent et correctement préfixé par "Bearer "
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            if (jwtUtils.validateJwtToken(token)) {
                username = jwtUtils.getUserNameFromJwtToken(token);
            }
        }

        // Si un utilisateur est extrait du token et qu'aucune authentification n'est encore définie dans le contexte de sécurité,
        // charger les détails utilisateur et valider à nouveau le token avant de configurer l'authentification
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtUtils.validateJwtToken(token)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continuer la chaîne de filtres
        filterChain.doFilter(request, response);
    }
}
