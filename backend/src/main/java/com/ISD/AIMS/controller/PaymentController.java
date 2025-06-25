package com.ISD.AIMS.controller;

import com.ISD.AIMS.config.VnPayConfig;
import com.ISD.AIMS.model.Order;
import com.ISD.AIMS.repository.OrderRepository;
import com.ISD.AIMS.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/create-payment")
    public ResponseEntity<?> createPayment(HttpServletRequest req) throws UnsupportedEncodingException {
        String vnp_TxnRef = VnPayConfig.getRandomNumber(8);
        Order tempOrder = orderService.createOrderFromCart(vnp_TxnRef);
        long amount = (long) (tempOrder.getTotalPrice() * 100);

        String vnp_IpAddr = VnPayConfig.getIpAddress(req);
        
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
        
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        
        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VnPayConfig.vnp_Url + "?" + queryUrl;
        
        return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<Void> vnpayReturn(HttpServletRequest request) {
        String vnp_TxnRef = request.getParameter("vnp_TxnRef");
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");

        Optional<Order> orderOpt = orderRepository.findByVnpTxnRef(vnp_TxnRef); // Đã sửa tên phương thức
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            String redirectUrl;

            // Ở đây bạn nên có một bước kiểm tra chữ ký (secure hash) trả về từ VNPAY để đảm bảo an toàn
            if ("00".equals(vnp_ResponseCode)) {
                order.setStatus("SUCCESS");
                redirectUrl = "http://localhost:5173/payment-success?orderId=" + order.getId();
            } else {
                order.setStatus("FAILED");
                redirectUrl = "http://localhost:5173/payment-failed?message=Giao dịch thất bại";
            }
            orderRepository.save(order);
            
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
        }
        
        String errorUrl = "http://localhost:5173/payment-failed?message=Không tìm thấy đơn hàng";
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(errorUrl)).build();
    }
}