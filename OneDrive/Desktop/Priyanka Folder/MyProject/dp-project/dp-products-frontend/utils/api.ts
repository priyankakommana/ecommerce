// const BASE_URL = 'http://localhost:8080/api/v1/client';

// export const API = {
//   // 1. GET: Fetch the horizontal scrolling category rows from MySQL
//   getCategories: async () => {
//     const res = await fetch(`${BASE_URL}/categories`);
//     return res.json();
//   },

//   // 2. GET: Search for matching typing terms or filter by category ID selections
//   getProducts: async (categoryId?: number, searchKeyword?: string) => {
//     let url = `${BASE_URL}/products`;
//     const params = new URLSearchParams();
    
//     if (categoryId) params.append('categoryId', categoryId.toString());
//     if (searchKeyword) params.append('search', searchKeyword);
//     if (params.toString()) url += `?${params.toString()}`;

//     const res = await fetch(url);
//     return res.json();
//   },

//   // 3. GET: Load previous purchase logs and active statuses inside the profile drawer
//   getOrderHistory: async (userId: number) => {
//     const res = await fetch(`${BASE_URL}/orders/history/${userId}`);
//     return res.json();
//   },

//   // 4. POST: Send the checked-out shopping cart data to Spring Boot for threshold math calculation
//   checkoutCart: async (userId: number, totalAmount: number, paymentMethod: string, address: string) => {
//     const res = await fetch(`${BASE_URL}/orders/checkout`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         userId,
//         totalAmount,
//         paymentMethod,
//         shippingAddress: address
//       })
//     });
//     return res.json();
//   },

//   // Add these methods inside your existing utils/api.ts file:

// // 1. POST: Submits input fields to Spring Boot for profile password checks
// signin: async (email: string, password: string) => {
//   const res = await fetch(`http://localhost:8080/api/v1/client/auth/signin?email=${email}&password=${password}`, {
//     method: 'POST'
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// },

// // 2. POST: Submits new registration fields directly to database schemas
// signup: async (payload: any) => {
//   const res = await fetch(`http://localhost:8080/api/v1/client/auth/signup`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload)
//   });
//   return res.json();
// },

// // 3. PUT: Forwards your fresh address data modifications straight to MySQL columns
// updateUserAddress: async (userId: number, payload: any) => {
//   const res = await fetch(`http://localhost:8080/api/v1/client/users/profile/${userId}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload)
//   });
//   return res.json();
// }

// };

import { UserProfile } from '../types';

const BASE_URL = 'http://localhost:8080/api/v1/client';

export const API = {
  // 1. GET: Fetch the horizontal scrolling category rows from MySQL
  getCategories: async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    return res.json();
  },

  // 2. GET: Search for matching typing terms or filter by category ID selections
  getProducts: async (categoryId?: number, searchKeyword?: string) => {
    let url = `${BASE_URL}/products`;
    const params = new URLSearchParams();
    
    if (categoryId) params.append('categoryId', categoryId.toString());
    if (searchKeyword) params.append('search', searchKeyword);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    return res.json();
  },

  // 3. GET: Load previous purchase logs and active statuses inside the profile drawer
  getOrderHistory: async (userId: number) => {
    const res = await fetch(`${BASE_URL}/orders/history/${userId}`);
    return res.json();
  },

  // 4. POST: Send the checked-out shopping cart data to Spring Boot
  // checkoutCart: async (userId: number, totalAmount: number, paymentMethod: string, address: string) => {
  //   const res = await fetch(`${BASE_URL}/orders/checkout`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       userId,
  //       totalAmount,
  //       paymentMethod,
  //       shippingAddress: address
  //     })
  //   });
  //   return res.json();
  // },
    // 4. POST: Send the checked-out shopping cart data to Spring Boot with parameter query pass
  checkoutCart: async (userId: number, totalAmount: number, paymentMethod: string, address: string, userEmail?: string) => {
    // Appends the active email query string parameter directly into the URL route
    let url = `http://localhost:8080/api/v1/client/orders/checkout`;
    if (userEmail) {
      url += `?userEmail=${encodeURIComponent(userEmail)}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        totalAmount,
        paymentMethod,
        shippingAddress: address
      })
    });
    return res.json();
  },


  // 5. POST: Submits input fields to Spring Boot for profile password checks
  signin: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/signin?email=${email}&password=${password}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // 6. POST: Corrected from 'any' to a clean object record format to pass ESLint
  signup: async (payload: Record<string, unknown>) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // 7. PUT: Corrected from 'any' to a clean object record format to pass ESLint
  updateUserAddress: async (userId: number, payload: Record<string, unknown>): Promise<UserProfile> => {
    const res = await fetch(`${BASE_URL}/users/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Add these operations inside your central API module file:

// 1. POST: Triggers background SMTP servers to send code strings to mailboxes
requestSignUpOtp: async (email: string) => {
  const res = await fetch(`http://localhost:8080/api/v1/client/auth/request-otp?email=${email}`, {
    method: 'POST'
  });
  return res.text();
},

// 2. POST: Validates input code parameters and creates accounts securely
submitVerifiedSignup: async (userPayload: Record<string, unknown>, otp: string) => {
  const res = await fetch(`http://localhost:8080/api/v1/client/auth/signup-verified?otp=${otp}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userPayload)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

};
