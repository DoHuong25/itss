package com.ISD.AIMS.service;

import com.ISD.AIMS.model.*;
import com.ISD.AIMS.repository.CartRepository;
import com.ISD.AIMS.repository.OrderRepository;
import com.ISD.AIMS.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CartRepository cartRepository;

    @Transactional
    public Order createOrderFromCart(String vnpTxnRef) {
        Cart cart = cartService.getCartForCurrentUser();
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Giỏ hàng đang trống");
        }

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setVnpTxnRef(vnpTxnRef);

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            orderItem.setOrder(order);

            Product product = cartItem.getProduct();
            // Cập nhật số lượng tồn kho
            int newQuantity = product.getQuantity() - cartItem.getQuantity();
            if (newQuantity < 0) {
                throw new IllegalStateException("Không đủ hàng cho sản phẩm: " + product.getTitle());
            }
            product.setQuantity(newQuantity);
            
            // Tăng số lượt bán của sản phẩm lên
            product.setSalesCount(product.getSalesCount() + cartItem.getQuantity());
            
            productRepository.save(product);

            return orderItem;
        }).collect(Collectors.toList());

        order.setOrderItems(orderItems);
        
        double totalPrice = orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        order.setTotalPrice(totalPrice);
        
        cartRepository.delete(cart);

        return orderRepository.save(order);
    }
}