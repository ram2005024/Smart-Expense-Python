import hero1 from "../../public/HeroIcons/1.png"
import hero2 from "../../public/HeroIcons/2.png"
import hero3 from "../../public/HeroIcons/3.jpg"
import hero4 from "../../public/HeroIcons/4.jpg"
export const heroIcons = {
    hero1, hero2, hero3, hero4
}
/* ===============================
   DASHBOARD STATS
=============================== */

export const STATS = [
    {
        label: 'Total Spent',
        val: '$4,820',
        sub: '+8.2% from last month',
        color: '#6366f1',
        up: true
    },
    {
        label: 'Budget Remaining',
        val: '$1,180',
        sub: '-3.1% from last month',
        color: '#10b981',
        up: false
    },
    {
        label: 'Pending Bills',
        val: '$640',
        sub: '5 unpaid expenses',
        color: '#f59e0b',
        up: null
    },
    {
        label: 'Savings',
        val: '$12,450',
        sub: '+12% growth',
        color: '#3b82f6',
        up: true
    }
]

/* ===============================
   ALL EXPENSES
=============================== */

export const ALL_EXPENSES = [
    {
        id: 1,
        title: 'Netflix Subscription',
        category: 'Entertainment',
        amount: 15.99,
        date: '2026-02-02',
        status: 'paid'
    },
    {
        id: 2,
        title: 'Electricity Bill',
        category: 'Utilities',
        amount: 120.45,
        date: '2026-02-01',
        status: 'pending'
    },
    {
        id: 3,
        title: 'Groceries - Walmart',
        category: 'Food',
        amount: 230.10,
        date: '2026-01-29',
        status: 'paid'
    },
    {
        id: 4,
        title: 'Spotify Premium',
        category: 'Entertainment',
        amount: 9.99,
        date: '2026-01-27',
        status: 'paid'
    },
    {
        id: 5,
        title: 'Uber Ride',
        category: 'Transport',
        amount: 32.50,
        date: '2026-01-26',
        status: 'paid'
    },
    {
        id: 6,
        title: 'Internet Bill',
        category: 'Utilities',
        amount: 75.00,
        date: '2026-01-25',
        status: 'pending'
    },
    {
        id: 7,
        title: 'Restaurant - Italian Bistro',
        category: 'Food',
        amount: 86.40,
        date: '2026-01-22',
        status: 'paid'
    },
    {
        id: 8,
        title: 'Gym Membership',
        category: 'Health',
        amount: 45.00,
        date: '2026-01-20',
        status: 'paid'
    },
    {
        id: 9,
        title: 'Flight Ticket',
        category: 'Travel',
        amount: 480.00,
        date: '2026-01-18',
        status: 'pending'
    },
    {
        id: 10,
        title: 'Amazon Purchase',
        category: 'Shopping',
        amount: 150.75,
        date: '2026-01-15',
        status: 'paid'
    }
]

/* ===============================
   BUDGET CATEGORIES
=============================== */

export const BUDGET_CATEGORIES = [
    {
        category: 'Food',
        budget: 800,
        spent: 620
    },
    {
        category: 'Entertainment',
        budget: 300,
        spent: 210
    },
    {
        category: 'Utilities',
        budget: 400,
        spent: 310
    },
    {
        category: 'Transport',
        budget: 250,
        spent: 140
    },
    {
        category: 'Health',
        budget: 200,
        spent: 120
    },
    {
        category: 'Travel',
        budget: 1000,
        spent: 480
    }
]

/* ===============================
   MONTHLY SUMMARY (Chart Data)
=============================== */

export const MONTHLY_EXPENSES = [
    { month: 'Aug', total: 3200 },
    { month: 'Sep', total: 4100 },
    { month: 'Oct', total: 3800 },
    { month: 'Nov', total: 4500 },
    { month: 'Dec', total: 5200 },
    { month: 'Jan', total: 4820 }
]

/* ===============================
   RECENT ACTIVITY
=============================== */

export const RECENT_ACTIVITY = [
    {
        id: 1,
        action: 'Paid Electricity Bill',
        date: '2026-02-01'
    },
    {
        id: 2,
        action: 'Added New Expense - Flight Ticket',
        date: '2026-01-18'
    },
    {
        id: 3,
        action: 'Updated Budget - Food',
        date: '2026-01-10'
    }
]
export const budgetCategoriesIcons = [
    {
        categoryName: "FOOD",
        icon: "🍽️"
    },
    {
        categoryName: "PERSONAL",
        icon: "🧍"
    },
    {
        categoryName: "TRIP",
        icon: "✈️"
    },
    {
        categoryName: "CLOTHS",
        icon: "👕"
    },
    {
        categoryName: "OTHERS",
        icon: "📦"
    },
    {
        categoryName: "GROCERY",
        icon: "🛒"
    },
    {
        categoryName: "STUDY",
        icon: "📚"
    }
];