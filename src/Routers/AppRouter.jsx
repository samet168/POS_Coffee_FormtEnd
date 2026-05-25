import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";

import RootLayout from "../Layouts/RootLayout";
import RootDashboard from "../Layouts/RootDashboard";

// Auth
import Login from "../pages/Login/login";

// User pages
import Home from "../pages/Home";
import { Menu } from "../pages/Menu";
import { Orders } from "../pages/Orders";
import { OrderList } from "../pages/OrderList";
import { OrderSuccess } from "../pages/OrderSuccess";

// Customer Profile
import  ProfileCustomer  from "../pages/Profile_Customer/Profile";
import EditProfileCustomer  from "../pages/Profile_Customer/EditProfile";

// Admin Profile
import {Profile} from "../pages/Profile/Profile";
import { EditProfile } from "../pages/Profile/EditProfile";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import User from "../pages/admin/User";
import AddUser from "../pages/admin/CRUD_USER/Add";
import UserEdit from "../pages/admin/CRUD_USER/Edit";

import Category from "../pages/admin/Category";
import AddCategory from "../pages/admin/CRUD_CATEGORY/Add";
import EditCategory from "../pages/admin/CRUD_CATEGORY/Edit";

import ProductList from "../pages/admin/ProductList";
import AddProductList from "../pages/admin/CRUD_PRODUCT/Add";
import EditProductList from "../pages/admin/CRUD_PRODUCT/Edit";

import Price from "../pages/admin/Price";
import AddPrice from "../pages/admin/CRUDE_ITEM_PRICE/Add";
import EditPrice from "../pages/admin/CRUDE_ITEM_PRICE/Edit";

import Product_OrderList from "../pages/admin/orderItem";
import Invoice from "../pages/admin/Invoice";

// ================= 404 =================
const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f5f2]">
      <h1 className="text-4xl font-bold text-gray-600">
        404 - ទំព័ររកមិនឃើញ
      </h1>
    </div>
  );
};

// ================= Protected Route =================
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
};

// ================= ROUTER =================
const router = createBrowserRouter([
  // LOGIN
  {
    path: "/login",
    element: <Login />,
  },


  {
    element: <ProtectedRoute />,
    children: [
      // ================= USER LAYOUT =================
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { index: true, element: <Home /> },

          { path: "menu", element: <Menu /> },
          { path: "orders/:id", element: <Orders /> },
          { path: "orders", element: <Orders /> },
          { path: "my-orders", element: <OrderList /> },
          { path: "success", element: <OrderSuccess /> },

          
          { path: "profile", element: <ProfileCustomer /> },
          { path: "profile/edit", element: <EditProfileCustomer /> },
        ],
      },

      // ================= DASHBOARD (ADMIN) =================
      {
        path: "/dashboard",
        element: <RootDashboard />,
        children: [
          { index: true, element: <Dashboard /> },

          
          { path: "profile", element: <Profile /> },
          { path: "profile/edit", element: <EditProfile /> },

   
          { path: "users", element: <User /> },
          { path: "users/add", element: <AddUser /> },
          { path: "users/edit/:id", element: <UserEdit /> },

      
          { path: "category", element: <Category /> },
          { path: "category/add", element: <AddCategory /> },
          { path: "category/edit/:id", element: <EditCategory /> },

       
          { path: "product-list", element: <ProductList /> },
          { path: "product-list/add", element: <AddProductList /> },
          { path: "product-list/edit/:id", element: <EditProductList /> },

     
          { path: "product-prices", element: <Price /> },
          { path: "product-prices/add", element: <AddPrice /> },
          { path: "product-prices/edit/:id", element: <EditPrice /> },

          { path: "orders", element: <Product_OrderList /> },


          { path: "invoices", element: <Invoice /> },
        ],
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <NotFound />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};