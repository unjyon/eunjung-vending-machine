import { useCallback, useState } from "react";
import "./App.css";

interface Drink {
  id: string;
  name: string;
  price: number;
  stock: number;
}
interface SelectedItem {
  drinkId: string;
  quantity: number;
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
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);



  const totalAmountInCart = selectedItems.reduce((sum, item) => {
    const drink = drinks.find(d => d.id === item.drinkId);
    return sum + (drink ? drink.price * item.quantity : 0);
  }, 0);

  //== addToCart ==//
  const addToCart = useCallback((drinkId: string) => {
    console.log("addToCart::", drinkId);
    const drinkToAdd = drinks.find(d => d.id === drinkId);

    if (!drinkToAdd) {
      setMessage('선택하신 음료를 찾을 수 없습니다.');
      return;
    }
    if (drinkToAdd.stock <= 0) {
      setMessage(`${drinkToAdd.name} 재고가 없습니다.`);
      return;
    }

    setSelectedItems(prevItems => {
      const existingItem = prevItems.find(item => item.drinkId === drinkId);
      let newSelectedItems: SelectedItem[];

      if (existingItem) {
        if (existingItem.quantity + 1 > drinkToAdd.stock) {
          setMessage(`${drinkToAdd.name}은(는) 재고(${drinkToAdd.stock}개)를 초과하여 더 이상 추가할 수 없습니다.`);
          return prevItems;
        }
        newSelectedItems = prevItems.map(item =>
          item.drinkId === drinkId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newSelectedItems = [...prevItems, { drinkId: drinkId, quantity: 1 }];
      }

      const currentTotal = newSelectedItems.reduce((sum, item) => {
        const d = drinks.find(drink => drink.id === item.drinkId);
        return sum + (d ? d.price * item.quantity : 0);
      }, 0);

      setMessage(`${drinkToAdd.name} ${existingItem ? '1개 추가' : '선택'}되었습니다. 장바구니 총 ${currentTotal}원.`);
      
      return newSelectedItems;
    });
  }, [drinks, setMessage]);

  //== insertMoney ==//
  const insertMoney = useCallback((amount: number) => {
    console.log("insertMoney::", amount);
    setInsertedAmount((prev) => prev + amount);
  }, []);

  //== cancelTransaction ==//
  const cancelTransaction = useCallback(() => {
    console.log("cancelTransaction::");
    setInsertedAmount(0);
    setSelectedItems([]);
    setMessage("돈을 넣어주세요.");
    setChange(0);
  }, []);

  //== processPurchase ==//
  const processPurchase = useCallback(() => {
    console.log("processPurchase::");
  }, []);

  //== processCardPayment ==//
  const processCardPayment = useCallback(() => {
    console.log("processCardPayment::");
  }, []);

  //== resetVendingMachine ==//
  const resetVendingMachine = useCallback(() => {
    console.log("resetVendingMachine::");
    setInsertedAmount(0);
    setSelectedItems([]);
    setDrinks(initialDrinks); 
    setMessage('돈을 넣어주세요!');
    setChange(0);
  }, []);

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
          <button
            key={amount}
            className="money-button"
            onClick={() => insertMoney(amount)}
          >
            {amount}원
          </button>
        ))}
        <button className="cancel-button" onClick={() => cancelTransaction()}>
          거래 취소
        </button>
      </div>

      <div className="card-payment-section">
        <h2>카드 결제</h2>
        <button className="card-payment-button">카드 결제 모드 진입</button>
      </div>

      <div className="drink-selection-section">
        <h2>음료 선택</h2>
        <div className="drink-grid">
          {drinks.map((drink) => (
            <button
              key={drink.id}
              className="drink-button"
              onClick={() => addToCart(drink.id)}
            >
              {drink.name} {drink.price}원<span>{drink.stock}개</span>
            </button>
          ))}
        </div>
      </div>

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
                    {drink.name} x {item.quantity} = {drink.price * item.quantity}원
                  </li>
                );
            })}
          </ul>
        )}
        <h3>총 결제 금액: {totalAmountInCart}원</h3>
        <button className="purchase-button" onClick={() => processPurchase}>
          현금으로 구매하기
        </button>
        <button className="card-payment-button" onClick={() => processCardPayment()}>
          카드 결제 시도
        </button>
      </div>

      <button className="reset-button" onClick={() => resetVendingMachine()}>자판기 초기화 (관리자용)</button>
    </div>
  );
}

export default App;
