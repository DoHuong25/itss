package com.ISD.AIMS.service;

import com.ISD.AIMS.model.Cart;
import com.ISD.AIMS.model.CartItem;
import com.ISD.AIMS.model.Product;
import com.ISD.AIMS.model.User;
import com.ISD.AIMS.repository.CartItemRepository;
import com.ISD.AIMS.repository.CartRepository;
import com.ISD.AIMS.repository.ProductRepository;
import com.ISD.AIMS.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    /**
     * Lấy giỏ hàng của người dùng đang đăng nhập.
     * Nếu người dùng chưa có giỏ hàng, một giỏ hàng mới sẽ được tạo tự động.
     * @return Giỏ hàng của người dùng.
     */
    public Cart getCartForCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof UserDetails)) {
            throw new IllegalStateException("Không thể lấy thông tin người dùng. Người dùng có thể chưa đăng nhập.");
        }

        UserDetails userDetails = (UserDetails) principal;
        String username = userDetails.getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + username));
        
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    /**
     * Thêm một sản phẩm vào giỏ hàng.
     * Nếu sản phẩm đã tồn tại, số lượng sẽ được cộng dồn.
     * @param productId ID của sản phẩm cần thêm.
     * @param quantity Số lượng cần thêm.
     * @return Giỏ hàng đã được cập nhật.
     */
    public Cart addProductToCart(Long productId, int quantity) {
        Cart cart = getCartForCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        // Sử dụng phương thức đã được khai báo trong CartItemRepository
        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }
        return cart;
    }

    /**
     * Cập nhật số lượng của một mục trong giỏ hàng.
     * @param cartItemId ID của mục trong giỏ hàng.
     * @param quantity Số lượng mới.
     * @return Giỏ hàng đã được cập nhật.
     */
    public Cart updateItemQuantity(Long cartItemId, int quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mục trong giỏ hàng với ID: " + cartItemId));
        
        if (quantity <= 0) {
            return removeItemFromCart(cartItemId);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }
        return cartItem.getCart();
    }

    /**
     * Xóa một mục khỏi giỏ hàng.
     * @param cartItemId ID của mục cần xóa.
     * @return Giỏ hàng đã được cập nhật.
     */
    public Cart removeItemFromCart(Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mục trong giỏ hàng với ID: " + cartItemId));
        Cart cart = cartItem.getCart();
        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);
        return cart;
    }

    /**
     * Xóa các mục trong giỏ hàng của một người dùng cụ thể dựa trên danh sách ID sản phẩm.
     * Được gọi bởi PaymentController sau khi giao dịch thành công.
     * @param user Người dùng sở hữu giỏ hàng.
     * @param productIds Danh sách ID của các sản phẩm đã được mua.
     */
    public void removeItemsFromUserCart(User user, List<Long> productIds) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(user.getId());
        
        cartOpt.ifPresent(cart -> {
            if (productIds != null && !productIds.isEmpty()) {
                List<CartItem> itemsToRemove = cart.getItems().stream()
                        .filter(cartItem -> productIds.contains(cartItem.getProduct().getId()))
                        .collect(Collectors.toList());

                if (!itemsToRemove.isEmpty()) {
                    cart.getItems().removeAll(itemsToRemove);
                    cartItemRepository.deleteAll(itemsToRemove);
                }
            }
        });
    }
}
