import { useState } from "react";
import "./App.css";

interface Drink {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const cashArr = [100, 500, 1000, 5000, 10000];
// 초기 자판기 음료 데이터
const initialDrinks: Drink[] = [
  { id: "cola", name: "콜라", price: 1100, stock: 5 },
  { id: "water", name: "물", price: 600, stock: 10 },
  { id: "coffee", name: "커피", price: 700, stock: 7 },
];

function App() {
  const [message, setMessage] = useState("돈을 넣어주세요.");
  const [insertedAmount, setInsertedAmount] = useState(0); // 투입금액
  const [change, setChange] = useState(0); // 거스름돈
  const [drinks, setDrinks] = useState<Drink[]>(initialDrinks);

  return (
    <div className="vending-machine-container">
      <h1>간이 자판기</h1>

      <div className="display-panel">
        <p className="message">{message}</p>

        <p className="amount">투입 금액: {insertedAmount}원</p>

        <p className="change-message">
          반환할 거스름돈: {change}원<button>거스름돈 받기</button>
        </p>
      </div>

      <div className="money-input-section">
        <h2>돈 투입</h2>
        {cashArr.map((amount) => (
          <button key={amount} className="money-button">
            {amount}원
          </button>
        ))}
        <button className="cancel-button">거래 취소</button>
      </div>

      <div className="drink-selection-section">
        <h2>음료 선택</h2>
        <div className="drink-grid">
          {drinks.map((drink) => (
            <button key={drink.id} className="drink-button">
              {drink.name} {drink.price}원<span>{drink.stock}개</span>
            </button>
          ))}
        </div>
      </div>

      <div className="shopping-cart-section">
        <h2>장바구니</h2>

        <ul>
          <li>콜라 x 1 = 1000원</li>
        </ul>
        <h3>총 결제 금액: 1000원</h3>
      </div>

      <button className="reset-button">자판기 초기화 (관리자용)</button>
    </div>
  );
}

export default App;
