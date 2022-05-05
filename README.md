<h1 align="center">
  <img src="./img/img000.png" />
</h1>

### ignite-desafio01-react-chapter02-criando-um-hook-de-carrinho-de-compras

# Criando um Hook de Carrinho de Compras

No terminal:
`yarn`

`yarn server`

E rodar a API: `yarn start`

Vamos iniciar no:
`pages/Home/index.tsx`

A API's precisa puxa todos os produtos:
No `useEffect` vamos fazer o seguinte codigo:

So essa alteração já estamos chamando os produtos e salvando eles:
```
const response = await api.get('/products');
setProducts(response.data)
```

Vamos continuar a alteração pos ele pede para passar o valor formatado na função `loadProducts`:
Onde vamos roda essa função `productsFormated` dentro de todas a resposta da API e formatar.
Onde vamos restrutura o produto `...product, price` só alterando o preço dele com `formatPrice`. 
```
useEffect(() => {
    async function loadProducts() {
      const response = await api.get('/products');
      const productsFormated = response.data.map(function(product: Product){
        return {...product, price: formatPrice(product.price)}
      })
      setProducts(productsFormated);
    }
```

Vamos descomentar o seguinte codigo:

```
const [products, setProducts] = useState<ProductFormatted[]>([]);
const { addProduct, cart } = useCart();
```

E agora para ver o resultudado em tela vamos altera o segunte codigo:

```
return (
  <ProductList>
    {products.map(product => (
      <li>
      <img src={product.image} alt={product.title} />
      <strong>{product.title}</strong>
      <span>{product.price}</span>
      <button
        type="button"
        data-testid="add-product-button"
      // onClick={() => handleAddProduct(product.id)}
      >
        <div data-testid="cart-product-quantity">
          <MdAddShoppingCart size={16} color="#FFF" />
          {/* {cartItemsAmount[product.id] || 0} */} 2
        </div>

        <span>ADICIONAR AO CARRINHO</span>
      </button>
      </li>
    ))}
  </ProductList>
);
```

Agora vamos no Hook para a funcionalidade do button:
no arqui `useCart.tsx` que e onde esta a funcionalide.
vamos inicia descomentado o codigo:

```
const storagedCart = Buscar dados do localStorage

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
```

Vamos pegar com o `localStorage.etItem('')` colocando a seguinte chave dentro: `localStorage.getItem('@RocketShoes:cart')`.

Fazendo uma verificação. `useState<Product[]>(() => {`,
E se tiver isso `localStorage.getItem('@RocketShoes:cart')`
Ele ira usar isso: 
```
if (storagedCart) {
      return JSON.parse(storagedCart);
    }
``` 
Se não:
Ele ira retorna um arrey vazio: `return [];`

Agora vamos para a função de adicionar produto no `try` `catch`:
Onde precisa ser feita varias verificações:

**addProduct:** Deve adicionar um produto ao carrinho. Porém, é preciso verificar algumas coisas:
    - O valor atualizado do carrinho deve ser perpetuado no **localStorage** utilizando o método `setItem`.
    - Caso o produto já exista no carrinho, não se deve adicionar um novo produto repetido, apenas incrementar em 1 unidade a quantidade;
    - Verificar se existe no estoque a quantidade desejada do produto. Caso contrário, utilizar o método `error` da **react-toastify** com a seguinte mensagem:

Começando se o produto está ou não no carrinho:
Criando uma constant `const productAlreadyInCart`
Usando o `cart.find(product => product.id === productId)` que sera feita uma busca dentro do carrinho onde o produto for igual ao productId.

E vamos vericar se o produto não estiver no carrinho com `if`.
`if(!productAlreadyInCart)`.

Então se o produto não estava no carrinho antes a unica validação a ser feita e se tem no stock: `if(stock.amount > 0)`

E se ele tem no stock e vamos com `setCart` passando como arrey pegando os antigos `...cart,` porem adicionar um novo, desestruturando o product.
E salvando no `localStorage`.

Passando `JSON.stringify([]))` para transforma um arrey em string.

E o `toast('Adicionado!')` so pra ver se adiciono.

```
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
```

E se o produto ja estive no carrinho ele deve encrementar:

```
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
```

Agora vamos no `Header`
components/Header/index.tsx

Descrição:
Você deve receber o array cart do hook useCart e mostrar em tela a quantidade de produtos distintos adicionados ao carrinho. Dessa forma, se o carrinho possui 4 unidades do item A e 1 unidade do item B o valor a ser mostrado é 2 itens.
`const cartSize = cart.length;`

E dentro do Home:

```
const cartItemsAmount = cart.reduce((sumAmount, product) => {
  sumAmount[product.id] = product.amount
  return sumAmount
}, {} as CartItemsAmount)
```

Agora vamos no carrinho:












Nesse arquivo, temos três pontos importantes a serem implementados:
