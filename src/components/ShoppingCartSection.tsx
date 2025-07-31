import type { Drink, SelectedItem } from '../types';

interface ShoppingCartSectionProps {
  selectedItems: SelectedItem[];
  drinks: Drink[];
  totalAmountInCart: number;
  isCardPayment: boolean;
  onSetItemQuantity: (drinkId: string, quantity: number) => void;
  onRemoveFromCart: (drinkId: string) => void;
  onProcessPurchase: () => void;
  onProcessCardPayment: (success: boolean) => void;
  onResetVendingMachine: () => void;
}

export const ShoppingCartSection = ({
  selectedItems,
  drinks,
  totalAmountInCart,
  isCardPayment,
  onSetItemQuantity,
  onRemoveFromCart,
  onProcessPurchase,
  onProcessCardPayment,
  onResetVendingMachine
}: ShoppingCartSectionProps) => {
  return (
    <>    
      <div className="shopping-cart-section">
        <h2>장바구니</h2>
        {selectedItems.length === 0 ? (
          <p>장바구니가 비어있습니다.</p>
        ) : (
          <ul>
            {selectedItems.map(item => {
              const drink = drinks.find(d => d.id === item.drinkId);
              if (!drink) return null;

              return (
                <li key={item.drinkId}>
                  {drink.name} x {item.quantity} = {drink.price * item.quantity}
                  원
                  <button
                    onClick={() =>
                      onSetItemQuantity(item.drinkId, item.quantity - 1)
                    }
                    className="quantity-button"
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      onSetItemQuantity(item.drinkId, item.quantity + 1)
                    }
                    className="quantity-button"
                    disabled={item.quantity >= drink.stock}
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemoveFromCart(item.drinkId)}
                    className="remove-from-cart-button"
                  >
                    X
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <h3>총 결제 금액: {totalAmountInCart}원</h3>
        <button
          className="purchase-button"
          onClick={onProcessPurchase}
          disabled={isCardPayment}
        >
          현금으로 구매하기
        </button>
        {isCardPayment && selectedItems.length > 0 && (
          <button
            className="card-payment-button"
            onClick={() => onProcessCardPayment(Math.random() > 0.3)}
          >
            카드 결제 시도
          </button>
        )}
      </div>
      <button className="reset-button" onClick={onResetVendingMachine}>
        자판기 초기화 (관리자용)
      </button>
    </>
  );
}; 