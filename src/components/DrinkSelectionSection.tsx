import type { Drink } from '../types';

interface DrinkSelectionSectionProps {
  drinks: Drink[];
  onAddToCart: (drinkId: string) => void;
}

export const DrinkSelectionSection = ({
  drinks,
  onAddToCart,
}: DrinkSelectionSectionProps) => {
  return (
    <div className="drink-selection-section">
      <h2>음료 선택</h2>
      <div className="drink-grid">
        {drinks.map(drink => (
          <button
            key={drink.id}
            className={`drink-button ${drink.stock <= 0 ? 'disabled' : ''}`}
            onClick={() => onAddToCart(drink.id)}
            disabled={drink.stock <= 0}
          >
            {drink.name} {drink.price}원<span>{drink.stock}개</span>
          </button>
        ))}
      </div>
    </div>
  );
}; 