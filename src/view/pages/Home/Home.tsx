import {useEffect} from "react";
import {Product} from "../../common/product/Product.tsx";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch,RootState} from "../../../store/store.ts";
import {getAllProducts} from "../../../slices/productSlice.ts";

export function Home() {
    const dispatch =
        useDispatch<AppDispatch>();
    const { list   }=useSelector((state: RootState)=> state.products);
    useEffect(() => {
            dispatch(getAllProducts())
        }
        , []);
    return (
        <div>
            <div className="flex flex-wrap ml-[1px] mt-5 mb-5
                            justify-center items-center mx-auto">
                {
                    list.map((product) => (
                        <Product key={product.id} data={product}/>
                    ))
                }
            </div>
        </div>
    );
}

export default Home;