import {ModifyCart} from "../ModifyCart/ModifyCart.tsx";
import type {ProductData} from "../../../model/ProductData.ts";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../../store/store.ts";
import {addItemToCart} from "../../../slices/cartSlice.ts";
type ProductProps = {
    data: ProductData
}
const images: Record<string, string> = import.meta.glob('../../../assets/products/*', {


    eager: true,
    import: 'default'
});
export function Product({data}: ProductProps) {
    console.log(`../../../assets/${data.image}`)

    console.log(data)


    const image =images[`../../../assets/products/${data.image}`];
    const dispatch = useDispatch<AppDispatch>();
    const item = useSelector((state: RootState) =>
        state.cart.items.find(cartItem =>
            cartItem.product.id === data.id));
    // const [isActive, setIsActive] = useState(false);

    const addToCart = () => {
        dispatch(addItemToCart(data))
        // setIsActive(true);
    }



    return (
        <div className="w-50 h-80 mr-2 mb-2 justify-center items-center border-gray-500 border-[1px]">
            <div>
                <img className="h-[140px] w-[200px]" src={image} alt=""/>
            </div>
            <div className="flex">
                <div>
                    <h3 className="text-[#1f9e4b] text-[1.5rem] pl-2">
                        {data.name}</h3>
                </div>
                <div className="bg-yellow-300 ml-4 p-[5px] rounded-lg pr-7">
                    <h3 className="text-[12px] pl-2">{data.price} <small className="text-[10px]">{data.currency}</small></h3>
                </div>
            </div>
            <div className="text-[1rem] pl-2">
                <p>{data.description}</p>
            </div>
            <div className="text-[1rem] pl-2">
                <p>Category: {data.category}</p>
            </div>
            <div className="flex justify-center">
                {
                    item ?(
                        <ModifyCart data={data}/>
                    ) : (
                        <button className="bg-gradient-to-r from-blue-500 to-green-400 text-white text-[15px] px-4 py-3 rounded mt-2"
                                onClick={addToCart}>
                            Add to Cart
                        </button>
                    )
                }
            </div>
        </div>
    );
}