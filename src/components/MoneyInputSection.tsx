interface MoneyInputSectionProps {
  cashArr: number[];
  isCardPayment: boolean;
  onInsertMoney: (amount: number) => void;
  onCancelTransaction: () => void;
}

export const MoneyInputSection = ({
  cashArr,
  isCardPayment,
  onInsertMoney,
  onCancelTransaction,
}: MoneyInputSectionProps) => {
  return (
    <div className="money-input-section">
      <h2>돈 투입</h2>
      {cashArr.map(amount => (
        <button
          key={amount}
          className="money-button"
          onClick={() => onInsertMoney(amount)}
          disabled={isCardPayment}
        >
          {amount}원
        </button>
      ))}
      <button className="cancel-button" onClick={onCancelTransaction}>
        거래 취소
      </button>
    </div>
  );
}; 