package com.example.demo.product;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Create
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

    public Product getProductById(UUID productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    // Delete
    public void deleteProduct(UUID productId) {
        productRepository.deleteById(productId);
    }

    // Get all
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
