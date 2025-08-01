package com.example.demo.jwtAuth;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;

    /**
     * Génère la clé secrète de signature utilisée pour signer les tokens JWT.
     *
     * @return la clé secrète sous forme d'objet Key
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Génère un token JWT signé pour un utilisateur donné.
     *
     * @param username le nom d'utilisateur à insérer dans le token comme sujet
     * @return le token JWT sous forme de chaîne signée
     */
    public String generateJwtToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extrait le nom d'utilisateur (subject) depuis un token JWT valide.
     *
     * @param token le token JWT à parser
     * @return le nom d'utilisateur contenu dans le token
     */
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Valide un token JWT en vérifiant sa signature et sa validité.
     *
     * @param authToken le token JWT à valider
     * @return true si le token est valide, false sinon
     */
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Invalid JWT: " + e.getMessage());
        }
        return false;
    }
}
