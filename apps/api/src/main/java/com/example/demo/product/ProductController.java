package com.example.demo.product;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Contrôleur REST pour la gestion des produits.
 * Permet la création, la récupération (par ID ou tous), et la mise à jour des produits.
 */
@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    /**
     * Constructeur injectant le service métier des produits.
     *
     * @param productService Le service gérant la logique métier des produits.
     */
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Récupère un produit par son identifiant.
     *
     * @param authHeader En-tête d'autorisation contenant le JWT.
     * @param id         L'identifiant unique du produit à récupérer.
     * @return           La réponse HTTP contenant les données du produit.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable UUID id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ProductMapper.toResponse(product));
    }

    /**
     * Récupère la liste de tous les produits disponibles.
     *
     * @param authHeader En-tête d'autorisation contenant le JWT.
     * @return           La réponse HTTP contenant la liste des produits.
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestHeader("Authorization") String authHeader) {
        List<Product> products = productService.getAllProducts();
        List<ProductResponse> responses = products.stream()
                .map(ProductMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    /**
     * Crée un nouveau produit à partir des données fournies.
     *
     * @param authHeader En-tête d'autorisation contenant le JWT.
     * @param request    Les données nécessaires à la création du produit.
     * @return           La réponse HTTP contenant les données du produit créé.
     */
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateProductRequest request) {
        Product product = productService.createProduct(request);
        return ResponseEntity.ok(ProductMapper.toResponse(product));
    }

    /**
     * Met à jour un produit existant à partir de son identifiant et des nouvelles données.
     *
     * @param authHeader En-tête d'autorisation contenant le JWT.
     * @param id         L'identifiant unique du produit à mettre à jour.
     * @param request    Les nouvelles données du produit.
     * @return           La réponse HTTP contenant les données du produit mis à jour.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable UUID id,
            @RequestBody CreateProductRequest request) {
        Product product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ProductMapper.toResponse(product));
    }

}
