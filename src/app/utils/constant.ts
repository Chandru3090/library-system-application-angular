export const API_BASE_URL = 'http://localhost:3000';

export const HEADER_MENUS = [
    {
        link: '/dashboard', name: 'Dashboard'
    },
    {
        link: '/books', name: 'Books'
    },
    {
        link: '/members', name: 'Membership'
    },
    {
        link: '/transactions', name: 'Transactions'
    },
    {
        link: '/staff-members', name: 'Staff Members'
    }
];

export const TRANSACTIONS_STATUS = [
    'Issued',
    'Returned',
    'Overdue',
    'Book Lost'
];

export const STAFF_MEMBERS_ROLE = [
    'Librarian',
    'Assistant'
];