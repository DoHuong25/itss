import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ color: 'green' }}>Thanh toán Thành công!</h1>
      <p>Cảm ơn bạn đã mua hàng.</p>
      <p>Mã đơn hàng của bạn là: <strong>{orderId}</strong></p>
      <Link to="/products">Tiếp tục mua sắm</Link>
    </div>
  );
}

export default PaymentSuccessPage;