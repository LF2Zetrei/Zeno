package com.example.demo.product;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Service métier pour gérer les opérations liées aux produits :
 * création, mise à jour, récupération, suppression et consultation.
 */
@Service
public class ProductService {

    private final ProductRepository productRepository;

    /**
     * Constructeur injectant le repository des produits.
     *
     * @param productRepository Le repository utilisé pour interagir avec la base de données.
     */
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Crée un nouveau produit à partir des informations fournies.
     *
     * @param request Objet contenant les données nécessaires à la création du produit.
     * @return        L'entité `Product` nouvellement créée et persistée.
     */
    public Product createProduct(CreateProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPhotoUrl(request.getPhotoUrl());
        product.setWeight(request.getWeight());
        product.setQuantity(request.getQuantity());
        product.setEstimatedPrice(request.getEstimatedPrice());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    /**
     * Met à jour un produit existant avec de nouvelles données.
     *
     * @param productId L'identifiant unique du produit à mettre à jour.
     * @param request   Objet contenant les nouvelles données du produit.
     * @return          Le produit mis à jour et persisté.
     * @throws IllegalArgumentException Si le produit n'existe pas.
     */
    public Product updateProduct(UUID productId, CreateProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPhotoUrl(request.getPhotoUrl());
        product.setWeight(request.getWeight());
        product.setQuantity(request.getQuantity());
        product.setEstimatedPrice(request.getEstimatedPrice());
        product.setUpdatedAt(LocalDateTime.now());

        return productRepository.save(product);
    }

    /**
     * Récupère un produit à partir de son identifiant.
     *
     * @param productId L'identifiant unique du produit à récupérer.
     * @return          Le produit correspondant à l'identifiant.
     * @throws IllegalArgumentException Si le produit n'existe pas.
     */
    public Product getProductById(UUID productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    /**
     * Supprime un produit par son identifiant.
     *
     * @param productId L'identifiant unique du produit à supprimer.
     */
    public void deleteProduct(UUID productId) {
        productRepository.deleteById(productId);
    }

    /**
     * Récupère la liste de tous les produits enregistrés.
     *
     * @return Une liste de tous les produits en base de données.
     */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
