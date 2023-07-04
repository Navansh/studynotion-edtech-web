import { createSlice } from "@reduxjs/toolkit";
import Toast from "react-hot-toast";

const initialState = {
    totalItems : localStorage.getItem('totalItems') ? JSON.parse(localStorage.getItem('totalItems')) : 0,



}

const cartSlice = createSlice({
    name : 'cart',
    initialState,
    reducers : {
        setTotalItems(state, value) {
            state.user = value.payload;
        },
        //function for add to cart
        addToCart(state, value) {
            const {id, name, price, image, quantity} = value.payload;
            const item = state.cart.find(item => item.id === id);
            if(item) {
                item.quantity += quantity;
            } else {
                state.cart.push(value.payload);
            }
            Toast.success(`${name} added to cart`);
        },
        //function for remove from cart
        removeFromCart(state, value) {
            const {id, name} = value.payload;
            const item = state.cart.find(item => item.id === id);
            if(item) {
                state.cart = state.cart.filter(item => item.id !== id);
            }
            Toast.error(`${name} removed from cart`);
        },
        //function for update cart
        updateCart(state, value) {
            const {id, quantity} = value.payload;
            const item = state.cart.find(item => item.id === id);
            if(item) {
                item.quantity = quantity;
            }
        },
        //function for clear cart
        clearCart(state) {
            state.cart = [];
        }



    },
});

export const {setTotalItems} = cartSlice.actions;
export default cartSlice.reducer;
