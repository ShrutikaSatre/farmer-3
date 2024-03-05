import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { RiDeleteBin6Fill } from "react-icons/ri";

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  var amount = 560;
  var products = [];
  var quantity = [];

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/addToCart/cartdisplay');
        setCartItems(response.data);

      } catch (error) {
        console.error('Error fetching cart items:', error);
      }

      amount = cartItems.reduce((total, item) => total + item.calculatedPrice, 0);
      products = cartItems.map(item => item.productName);
      quantity = cartItems.map(item => item.quantity);


    };

    fetchCartItems();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/addToCart/deletecart/${itemId}`);
      setCartItems(prevCartItems => prevCartItems.filter(item => item._id !== itemId));
      Swal.fire({
        icon: 'success',
        text: 'Product Deleted!'
      });
    } catch (error) {
      console.error('Error deleting product from cart:', error);
    }
  };
  
  function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = src
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })
    }
    
    const __DEV__ = document.domain === 'localhost'


    async function save_data(){

      var amount = cartItems.reduce((total, item) => total + item.calculatedPrice, 0);
      var products = cartItems.map(item => item.productName);
      var quantity = cartItems.map(item => item.quantity);

      try{
          const checkoutData = {
            email : "satreshrutika@gmail.com", 
            products, 
            amount, 
            quantity 
          };

          await axios.post("http://localhost:5000/checkout", checkoutData);

          Swal.fire({
          icon: 'success',
          title: 'Transaction Successful',
          text: 'Your order has been successfully placed!',
          })

      } catch(err) {
          console.error(err);
      }

  }

    
    async function displayRazorpay() {

        
              const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
      
              if (!res) {
                  alert('Razorpay SDK failed to load. Are you online?')
                  return
              }
      
              const data = await fetch('http://localhost:5000/checkout', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ amount })
              }).then((t) => t.json());
      
              console.log(data)
      
              const options = {
                  key: __DEV__ ? 'rzp_test_b5RTY86xi0zElh' : 'PRODUCTION_KEY',
                  currency: data.currency,
                  amount: 100*100,
                  order_id: data.id,
                  name: 'Donation',
                  description: 'Thank you for nothing. Please give us some money',
                  image: 'images/donate.png',
                  handler: function (response) {
                      save_data();
                  }
              }
              const paymentObject = new window.Razorpay(options)
              paymentObject.open()
          }


  // const initPayment = async () => {
  //   try {
  //     const orderUrl = "http://localhost:5000/payment/orders";
  //     const { data } = await axios.post(orderUrl, { amount: calculateTotal() });
  //     const options = {
  //       key: "YOUR_RAZORPAY_KEY_ID",
  //       amount: data.amount,
  //       currency: data.currency,
  //       name: "Your Company Name",
  //       description: "Payment for products",
  //       order_id: data.id,
  //       handler: async (response) => {
  //         try {
  //           const verifyUrl = "http://localhost:5000/payment/verify";
  //           const { data } = await axios.post(verifyUrl, response);
  //           console.log(data);
  //           Swal.fire({
  //             icon: 'success',
  //             text: 'Payment Successful!'
  //           });
  //         } catch (error) {
  //           console.log(error);
  //           Swal.fire({
  //             icon: 'error',
  //             text: 'Payment Failed!'
  //           });
  //         }
  //       }
  //     };
  //     const rzp1 = new window.Razorpay(options);
  //     rzp1.open();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div>
      <div className="cart-table-container">
      <h2>My Cart</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item._id}>
              <td><img src={item.Pimage} alt="" /></td>
              <td>{item.productName}</td>
              <td>{item.quantity} KG</td>
              <td>₹{item.calculatedPrice}</td>
              <td><button onClick={() => handleDelete(item._id)}><RiDeleteBin6Fill /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p>Total: {amount}</p>
      <button onClick={displayRazorpay}>Buy Now</button>
    </div>
  );
};

export default MyCart;
