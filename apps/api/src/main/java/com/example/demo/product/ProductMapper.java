package com.example.demo.product;


public class ProductMapper {
    public static ProductResponse toResponse(Product product) {
        ProductResponse dto = new ProductResponse();
        dto.setIdProduct(product.getIdProduct());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPhotoUrl(product.getPhotoUrl());
        dto.setWeight(product.getWeight());
        dto.setQuantity(product.getQuantity());
        dto.setEstimatedPrice(product.getEstimatedPrice());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }
}

