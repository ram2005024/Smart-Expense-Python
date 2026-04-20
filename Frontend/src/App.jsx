import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useEffect } from "react";
import Root from "./layouts/Root";
import Login from "./pages/Login";
import Main from "./layouts/Main";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { ProtectRoute } from "./middlewares/Protect";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import Expense from "./pages/Dashboard/Expense";
import Budget from "./pages/Dashboard/Budget";
import Ai from "./pages/Dashboard/Ai";
import DashboardLayout from "./layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "./store/thunks/expenseThunk";
import toast from "react-hot-toast";
import ShareOverviewUI from "./components/AiInsights/AiHeader/ShareOverviewUI";
const App = () => {
  // Fetch all the transactions

  const {
    error,
    expenseLoading,
    selectedMonth,
    pageSize,
    currentPage,
    filter,
  } = useSelector((state) => state.expense);
  const dispatch = useDispatch();
  useEffect(() => {
    // Fetch all the expenses
    dispatch(
      fetchExpenses({
        page: currentPage,
        page_size: pageSize,
        date: selectedMonth,
        ...(filter || {}),
      }),
    );
  }, [selectedMonth, currentPage, pageSize, filter]);

  if (expenseLoading) {
    return (
      <div className="size-full  flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-transparent  border-gray-400 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) {
    toast.error(error);
  }
  const router = createBrowserRouter([
    {
      element: <Root />,
      path: "/",
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/share/overview/:user_id",
          element: <ShareOverviewUI />,
        },
        {
          path: "/",
          element: <Main />,
          children: [
            {
              path: "/",
              element: <Home />,
            },
          ],
        },
        {
          path: "/dashboard",
          element: <DashboardLayout />,
          children: [
            {
              path: "",
              element: (
                <ProtectRoute>
                  <Dashboard />
                </ProtectRoute>
              ),
              children: [
                {
                  index: true,
                  element: <DashboardPage />,
                },
                {
                  path: "expense",
                  element: <Expense />,
                },
                {
                  path: "budget",
                  element: <Budget />,
                },
                {
                  path: "ai_insights",
                  element: <Ai />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
