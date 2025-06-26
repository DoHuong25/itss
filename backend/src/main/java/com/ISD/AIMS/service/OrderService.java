package com.ISD.AIMS.service;

import com.ISD.AIMS.model.*;
import com.ISD.AIMS.repository.CartItemRepository;
import com.ISD.AIMS.repository.OrderItemRepository;
import com.ISD.AIMS.repository.OrderRepository;
import com.ISD.AIMS.repository.ProductRepository;
import com.ISD.AIMS.request.CreatePaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    /**
     * Tạo một đơn hàng mới từ các mục được chọn trong giỏ hàng.
     * @param vnpTxnRef Mã tham chiếu giao dịch từ VNPAY.
     * @param paymentInfo Thông tin thanh toán, bao gồm danh sách ID của các mục trong giỏ hàng.
     * @return Đơn hàng đã được tạo.
     */
    public Order createOrderFromCart(String vnpTxnRef, CreatePaymentRequest paymentInfo) {
        // Lấy các CartItem được chọn từ DB dựa trên danh sách ID gửi lên
        List<CartItem> selectedItems = cartItemRepository.findAllById(paymentInfo.getCartItemIds());

        if (selectedItems.isEmpty()) {
            throw new IllegalStateException("Không có sản phẩm nào được chọn để thanh toán.");
        }

        Order order = new Order();
        // Lấy thông tin user từ cart item đầu tiên (vì tất cả đều thuộc cùng một user)
        order.setUser(selectedItems.get(0).getCart().getUser());
        order.setVnpTxnRef(vnpTxnRef);
        order.setCustomerName(paymentInfo.getCustomerName());
        order.setCustomerPhone(paymentInfo.getCustomerPhone());
        order.setShippingAddress(paymentInfo.getShippingAddress());
        order.setStatus("PENDING");

        // Tạo các OrderItem chỉ từ các CartItem đã chọn
        List<OrderItem> orderItems = selectedItems.stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            orderItem.setOrder(order);

            // Cập nhật tồn kho và số lượt bán
            Product product = cartItem.getProduct();
            int newQuantity = product.getQuantity() - cartItem.getQuantity();
            if (newQuantity < 0) {
                throw new IllegalStateException("Không đủ hàng cho sản phẩm: " + product.getTitle());
            }
            product.setQuantity(newQuantity);
            product.setSalesCount(product.getSalesCount() + cartItem.getQuantity());
            productRepository.save(product);

            return orderItem;
        }).collect(Collectors.toList());

        order.setOrderItems(orderItems);

        // Tính tổng tiền chỉ dựa trên các sản phẩm đã chọn
        double totalPrice = orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        order.setTotalPrice(totalPrice);

        // Quan trọng: KHÔNG XÓA GIỎ HÀNG ở bước này nữa
        return orderRepository.save(order);
    }
    
    /**
     * Xử lý yêu cầu trả lại một sản phẩm trong đơn hàng.
     * @param orderId ID của đơn hàng.
     * @param orderItemId ID của sản phẩm trong đơn hàng cần trả.
     * @param currentUser Người dùng đang thực hiện yêu cầu.
     * @return OrderItem đã được cập nhật trạng thái.
     */
    public OrderItem requestReturn(Long orderId, Long orderItemId, User currentUser) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng."));

        // Kiểm tra xem người dùng có phải là chủ của đơn hàng không
        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Bạn không có quyền truy cập đơn hàng này.");
        }

        OrderItem itemToReturn = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong đơn hàng."));

        // Kiểm tra xem sản phẩm có nằm trong đúng đơn hàng không
        if (!itemToReturn.getOrder().getId().equals(orderId)) {
            throw new IllegalStateException("Sản phẩm không thuộc đơn hàng này.");
        }

        // Kiểm tra xem sản phẩm đã được yêu cầu trả hàng chưa
        if (!"DELIVERED".equals(itemToReturn.getStatus())) {
            throw new IllegalStateException("Sản phẩm này không thể trả lại.");
        }
        
        // Cập nhật trạng thái
        itemToReturn.setStatus("RETURN_REQUESTED");

        // Cập nhật lại kho hàng
        Product product = itemToReturn.getProduct();
        product.setQuantity(product.getQuantity() + itemToReturn.getQuantity()); // Hoàn lại số lượng
        product.setSalesCount(product.getSalesCount() - itemToReturn.getQuantity()); // Giảm số lượng đã bán
        productRepository.save(product);

        return orderItemRepository.save(itemToReturn);
    }
}
