import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const productAlreadyInCart = cart.find(product => product.id === productId);
      if(!productAlreadyInCart) {
        const {data:product} = await api.get<Product>(`products/${productId}`)
        const {data:stock} = await api.get<Stock>(`stock/${productId}`)

        if(stock.amount > 0) {
          setCart([...cart, {...product, amount: 1 }])
          localStorage.setItem('@Rocketshoes:cart', JSON.stringify([...cart, {...product, amount: 1 }]))
          toast('Adicionado!')
          return;
        }        
      }
      if(productAlreadyInCart){
        const {data:stock} = await api.get<Stock>(`stock/${productId}`)

        if(stock.amount > productAlreadyInCart.amount){
          const updateCart = cart.map(cartItem => cartItem.id === productId ? {
            ...cartItem,
            amount: Number(cartItem.amount) + 1
          }: cartItem)
          setCart(updateCart)
          localStorage.setItem('@Rocketshoes:cart', JSON.stringify(updateCart))
          toast('Adicionado!')
          return;
        } else {
          toast.error('Quantidade solicitada fora de estoque');
        }
      }    
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
