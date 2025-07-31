interface DisplayPanelProps {
  message: string;
  insertedAmount: number;
  change: number;
  isCardPayment: boolean;
  onGetChange: () => void;
}

export const DisplayPanel = ({
  message,
  insertedAmount,
  change,
  isCardPayment,
  onGetChange,
}: DisplayPanelProps) => {
  return (
    <div className="display-panel">
      <p className="message">{message}</p>
      {!isCardPayment && (
        <p className="amount">투입 금액: {insertedAmount}원</p>
      )}
      {change > 0 && (
        <p className="change-message">
          반환할 거스름돈: {change}원
          <button onClick={onGetChange}>거스름돈 받기</button>
        </p>
      )}
    </div>
  );
}; 