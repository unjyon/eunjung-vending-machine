import { useCallback, useState } from 'react';
import './App.css';
import { CardPaymentSection } from './components/CardPaymentSection';
import { DisplayPanel } from './components/DisplayPanel';
import { DrinkSelectionSection } from './components/DrinkSelectionSection';
import { MoneyInputSection } from './components/MoneyInputSection';
import { ShoppingCartSection } from './components/ShoppingCartSection';
import type { Drink, SelectedItem } from './types';

const cashArr = [100, 500, 1000, 5000, 10000];

// 초기 자판기 음료 데이터
const initialDrinks: Drink[] = [
  { id: 'cola', name: '콜라', price: 1100, stock: 5 },
  { id: 'water', name: '물', price: 600, stock: 10 },
  { id: 'coffee', name: '커피', price: 700, stock: 7 },
];

function App() {
  const [message, setMessage] = useState('돈을 넣어주세요.');
  const [insertedAmount, setInsertedAmount] = useState(0);
  const [change, setChange] = useState(0); 
  const [drinks, setDrinks] = useState<Drink[]>(initialDrinks);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [isCardPayment, setIsCardPayment] = useState<boolean>(false);

  const totalAmountInCart = selectedItems.reduce((sum, item) => {
    const drink = drinks.find(d => d.id === item.drinkId);
    return sum + (drink ? drink.price * item.quantity : 0);
  }, 0);

  //== addToCart ==//
  const addToCart = useCallback(
    (drinkId: string) => {
      console.log('addToCart::', drinkId);
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
            setMessage(
              `${drinkToAdd.name}은(는) 재고(${drinkToAdd.stock}개)를 초과하여 더 이상 추가할 수 없습니다.`
            );
            return prevItems;
          }
          newSelectedItems = prevItems.map(item =>
            item.drinkId === drinkId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newSelectedItems = [...prevItems, { drinkId: drinkId, quantity: 1 }];
        }

        const currentTotal = newSelectedItems.reduce((sum, item) => {
          const d = drinks.find(drink => drink.id === item.drinkId);
          return sum + (d ? d.price * item.quantity : 0);
        }, 0);

        setMessage(
          `${drinkToAdd.name} ${existingItem ? '1개 추가' : '선택'}되었습니다. 장바구니 총 ${currentTotal}원.`
        );
        return newSelectedItems;
      });
    },
    [drinks]
  );

  //== insertMoney ==//
  const insertMoney = useCallback((amount: number) => {
    console.log('insertMoney::', amount);
    setInsertedAmount(prev => prev + amount);
  }, []);

  //== getChange ==//
  const getChange = useCallback(() => {
    console.log('getChange::');
    if (change === 0) {
      setMessage('반환할 거스름돈이 없습니다.');
      return;
    }
    const returnedChange = change;
    setChange(0);
    setMessage(`거스름돈 ${returnedChange}원이 반환되었습니다.`);
  }, [change]);

  //== setCardPaymentMode ==//
  const setCardPaymentMode = useCallback((mode: boolean) => {
    setIsCardPayment(mode);
    if (mode) {
      setInsertedAmount(0); // 현금 투입 초기화
      setMessage('카드 결제 모드입니다. 음료를 선택하세요.');
    } else {
      setMessage('돈을 넣어주세요!');
    }
  }, []);

  //== cancelTransaction ==//
  const cancelTransaction = useCallback(() => {
    console.log('cancelTransaction::');
    if (isCardPayment) {
      setCardPaymentMode(false);
    }
    const returnedAmount = insertedAmount;
    setInsertedAmount(0);
    setSelectedItems([]);
    setChange(0);
    setMessage(
      returnedAmount > 0
        ? `${returnedAmount}원이 반환되었습니다. 다시 이용해주세요.`
        : '거래가 취소되었습니다.'
    );
    setIsCardPayment(false);
  }, [insertedAmount, isCardPayment, setCardPaymentMode]);

  //== processPurchase ==//
  const processPurchase = useCallback(() => {
    console.log('processPurchase::');
    if (selectedItems.length === 0) {
      setMessage('구매할 음료를 먼저 선택해주세요.');
      return;
    }

    // 재고 및 금액 확인 (구매 직전 최종 확인)
    for (const selectedItem of selectedItems) {
      const drink = drinks.find(d => d.id === selectedItem.drinkId);
      if (!drink || drink.stock < selectedItem.quantity) {
        setMessage(
          `${drink ? drink.name : selectedItem.drinkId} 재고가 부족합니다. 장바구니를 확인해주세요.`
        );
        return;
      }
    }

    // 현금 결제일 경우 금액 부족 여부 확인
    if (!isCardPayment && insertedAmount < totalAmountInCart) {
      setMessage(
        `총 ${totalAmountInCart}원 구매에 금액이 부족합니다. (${insertedAmount}원 투입됨)`
      );
      return;
    }

    // 구매 처리 및 재고 감소
    setDrinks(prevDrinks =>
      prevDrinks.map(drink => {
        const selectedItem = selectedItems.find(
          item => item.drinkId === drink.id
        );
        if (selectedItem) {
          return { ...drink, stock: drink.stock - selectedItem.quantity };
        }
        return drink;
      })
    );

    const newInsertedAmount = insertedAmount - totalAmountInCart;
    const newChange = newInsertedAmount > 0 ? newInsertedAmount : 0;

    setInsertedAmount(0);
    setSelectedItems([]);
    setChange(newChange);
    setMessage(`구매가 완료되었습니다! 거스름돈: ${newChange}원.`);
    setIsCardPayment(false);
  }, [insertedAmount, selectedItems, drinks, totalAmountInCart, isCardPayment]);

  //== setItemQuantity ==//
  const setItemQuantity = useCallback(
    (drinkId: string, quantity: number) => {
      setSelectedItems(prevItems => {
        const drink = drinks.find(d => d.id === drinkId);
        if (!drink) return prevItems;

        if (quantity <= 0) {
          setMessage(`${drink.name}이 장바구니에서 제거되었습니다.`);
          return prevItems.filter(item => item.drinkId !== drinkId);
        } else if (quantity > drink.stock) {
          setMessage(
            `${drink.name}의 재고(${drink.stock}개)를 초과하여 ${quantity}개를 담을 수 없습니다.`
          );
          return prevItems;
        } else {
          setMessage(`${drink.name} 수량이 ${quantity}개로 변경되었습니다.`);
          return prevItems.map(item =>
            item.drinkId === drinkId ? { ...item, quantity: quantity } : item
          );
        }
      });
    },
    [drinks]
  );

  //== removeFromCart ==//
  const removeFromCart = useCallback((drinkId: string) => {
    setSelectedItems(prevItems => {
      const newSelectedItems = prevItems.filter(
        item => item.drinkId !== drinkId
      );
      const removedItem = prevItems.find(item => item.drinkId === drinkId);

      if (!removedItem) return prevItems;

      const removedDrink = drinks.find(d => d.id === removedItem.drinkId);
      const removedDrinkName = removedDrink
        ? removedDrink.name
        : '알 수 없는 음료';
      setMessage(
        `${removedDrinkName} ${removedItem.quantity}개가 장바구니에서 제거되었습니다.`
      );
      return newSelectedItems;
    });
    
  }, []);

  //== processCardPayment ==//
  const processCardPayment = useCallback(
    (success: boolean) => {
      if (selectedItems.length === 0) {
        setMessage('먼저 음료를 선택해주세요.');
        return;
      }

      if (success) {
        // 결제 성공
        setDrinks(prevDrinks =>
          prevDrinks.map(drink => {
            const selectedItem = selectedItems.find(
              item => item.drinkId === drink.id
            );
            if (selectedItem) {
              return { ...drink, stock: drink.stock - selectedItem.quantity };
            }
            return drink;
          })
        );
        setInsertedAmount(0);
        setSelectedItems([]);
        setChange(0);
        setMessage(`카드 결제 성공! ${totalAmountInCart}원 결제되었습니다.`);
        setIsCardPayment(false);
      } else {
        // 결제 실패
        setMessage('카드 결제에 실패했습니다. 다시 시도해주세요.');
        setIsCardPayment(false);
      }
    },
    [selectedItems, drinks, totalAmountInCart]
  );

  //== resetVendingMachine ==//
  const resetVendingMachine = useCallback(() => {
    console.log('resetVendingMachine::');
    setInsertedAmount(0);
    setSelectedItems([]);
    setDrinks(initialDrinks);
    setMessage('돈을 넣어주세요!');
    setChange(0);
    setIsCardPayment(false);
  }, []);

  return (
    <div className="vending-machine-container">
      <h1>간이 자판기</h1>

      <DisplayPanel
        message={message}
        insertedAmount={insertedAmount}
        change={change}
        isCardPayment={isCardPayment}
        onGetChange={getChange}
      />

      <MoneyInputSection
        cashArr={cashArr}
        isCardPayment={isCardPayment}
        onInsertMoney={insertMoney}
        onCancelTransaction={cancelTransaction}
      />

      <CardPaymentSection onSetCardPaymentMode={setCardPaymentMode} />

      <DrinkSelectionSection drinks={drinks} onAddToCart={addToCart} />

      <ShoppingCartSection
        selectedItems={selectedItems}
        drinks={drinks}
        totalAmountInCart={totalAmountInCart}
        isCardPayment={isCardPayment}
        onSetItemQuantity={setItemQuantity}
        onRemoveFromCart={removeFromCart}
        onProcessPurchase={processPurchase}
        onProcessCardPayment={processCardPayment}
        onResetVendingMachine={resetVendingMachine}
      />

    </div>
  );
}

export default App;
