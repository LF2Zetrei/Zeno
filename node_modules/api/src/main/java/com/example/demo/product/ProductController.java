package com.example.demo.product;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@RequestHeader("Authorization") String authHeader, @PathVariable UUID id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ProductMapper.toResponse(product));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(@RequestHeader("Authorization") String authHeader) {
        List<Product> products = productService.getAllProducts();
        List<ProductResponse> responses = products.stream()
                .map(ProductMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestHeader("Authorization") String authHeader, @RequestBody CreateProductRequest request) {
        Product product = productService.createProduct(request);
        return ResponseEntity.ok(ProductMapper.toResponse(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@RequestHeader("Authorization") String authHeader, @PathVariable UUID id, @RequestBody CreateProductRequest request) {
        Product product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ProductMapper.toResponse(product));
    }

}
