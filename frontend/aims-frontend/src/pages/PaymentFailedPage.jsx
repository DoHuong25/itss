import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

function PaymentFailedPage() {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ color: 'red' }}>Thanh toán Thất bại!</h1>
      <p>{message || 'Đã có lỗi xảy ra trong quá trình thanh toán.'}</p>
      <Link to="/cart">Thử lại với giỏ hàng</Link>
    </div>
  );
}

export default PaymentFailedPage;