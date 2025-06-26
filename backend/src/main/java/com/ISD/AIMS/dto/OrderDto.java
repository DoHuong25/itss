    package com.ISD.AIMS.dto;

    import java.time.LocalDateTime;
    import java.util.List;

    public class OrderDto {
        private Long id;
        private LocalDateTime orderDate;
        private String status;
        private double totalPrice;
        private List<OrderItemDto> items;

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public LocalDateTime getOrderDate() { return orderDate; }
        public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public double getTotalPrice() { return totalPrice; }
        public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
        public List<OrderItemDto> getItems() { return items; }
        public void setItems(List<OrderItemDto> items) { this.items = items; }
    }
    