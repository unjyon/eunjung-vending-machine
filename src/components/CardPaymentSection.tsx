interface CardPaymentSectionProps {
  onSetCardPaymentMode: (mode: boolean) => void;
}

export const CardPaymentSection = ({
  onSetCardPaymentMode,
}: CardPaymentSectionProps) => {
  return (
    <div className="card-payment-section">
      <h2>카드 결제</h2>
      <button
        className="card-payment-button"
        onClick={() => onSetCardPaymentMode(true)}
      >
        카드 결제 모드 진입
      </button>
    </div>
  );
}; 