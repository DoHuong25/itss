package com.ISD.AIMS.controller;

import com.ISD.AIMS.dto.OrderDto;
import com.ISD.AIMS.dto.OrderItemDto;
import com.ISD.AIMS.model.Order;
import com.ISD.AIMS.model.User;
import com.ISD.AIMS.repository.OrderRepository;
import com.ISD.AIMS.repository.UserRepository;
import com.ISD.AIMS.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;
     @Autowired
    private OrderService orderService;
    @GetMapping
    public ResponseEntity<List<OrderDto>> getOrderHistory() {
        // Lấy thông tin người dùng đang đăng nhập
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy tất cả đơn hàng của người dùng đó
        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(currentUser.getId());

        // Chuyển đổi sang DTO để gửi về cho frontend
        List<OrderDto> orderDtos = orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(orderDtos);
    }

    @PostMapping("/{orderId}/items/{itemId}/return")
    public ResponseEntity<String> requestReturn(@PathVariable Long orderId, @PathVariable Long itemId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        try {
            orderService.requestReturn(orderId, itemId, currentUser);
            return ResponseEntity.ok("Yêu cầu trả hàng đã được gửi thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- CẬP NHẬT CONVERT TO DTO ---
    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setTotalPrice(order.getTotalPrice());

        List<OrderItemDto> itemDtos = order.getOrderItems().stream().map(orderItem -> {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setId(orderItem.getId());
            
            // --- THÊM DÒNG NÀY ĐỂ GỬI PRODUCT ID VỀ FRONTEND ---
            itemDto.setProductId(orderItem.getProduct().getId());
            
            itemDto.setProductTitle(orderItem.getProduct().getTitle());
            itemDto.setQuantity(orderItem.getQuantity());
            itemDto.setPrice(orderItem.getPrice());
            itemDto.setImageUrl(orderItem.getProduct().getImageUrl());
            itemDto.setStatus(orderItem.getStatus());
            return itemDto;
        }).collect(Collectors.toList());

        dto.setItems(itemDtos);
        return dto;
    }
}