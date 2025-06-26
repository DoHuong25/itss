package com.ISD.AIMS.controller;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ISD.AIMS.dto.AddItemRequest;
import com.ISD.AIMS.dto.CartDto;
import com.ISD.AIMS.dto.CartItemDto;
import com.ISD.AIMS.model.Cart;
import com.ISD.AIMS.model.CartItem;
import com.ISD.AIMS.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> getCart() {
        Cart cart = cartService.getCartForCurrentUser();
        return ResponseEntity.ok(convertToDto(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> addItemToCart(@RequestBody AddItemRequest request) {
        Cart updatedCart = cartService.addProductToCart(
                request.getProductId(),
                request.getQuantity()
        );
        return ResponseEntity.ok(convertToDto(updatedCart));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartDto> updateItemQuantity(
            @PathVariable Long cartItemId,
            @RequestParam int quantity) {
        Cart updatedCart = cartService.updateItemQuantity(cartItemId, quantity);
        return ResponseEntity.ok(convertToDto(updatedCart));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartDto> removeItemFromCart(@PathVariable Long cartItemId) {
        Cart updatedCart = cartService.removeItemFromCart(cartItemId);
        return ResponseEntity.ok(convertToDto(updatedCart));
    }

    private CartDto convertToDto(Cart cart) {
        CartDto cartDto = new CartDto();
        cartDto.setId(cart.getId());
        cartDto.setUserId(cart.getUser().getId());

        cartDto.setItems(cart.getItems().stream().map(this::convertCartItemToDto).collect(Collectors.toList()));

        double totalPrice = cartDto.getItems().stream()
                .mapToDouble(item -> item.getProductPrice() * item.getQuantity())
                .sum();
        cartDto.setTotalPrice(totalPrice);

        return cartDto;
    }

    private CartItemDto convertCartItemToDto(CartItem cartItem) {
        CartItemDto itemDto = new CartItemDto();
        itemDto.setId(cartItem.getId());
        itemDto.setQuantity(cartItem.getQuantity());
        itemDto.setProductId(cartItem.getProduct().getId());
        itemDto.setProductTitle(cartItem.getProduct().getTitle());
        itemDto.setProductPrice(cartItem.getProduct().getPrice());
        
        // --- DÒNG QUAN TRỌNG NHẤT ĐƯỢC THÊM VÀO ĐÂY ---
        // Lấy imageUrl từ Product và gán nó vào DTO để gửi về cho frontend.
        itemDto.setImageUrl(cartItem.getProduct().getImageUrl());

        return itemDto;
    }
}
