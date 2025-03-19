export interface Book {
    id: string,
    title: string,
    author: string,
    genre: Genre,
    publicationYear: string,
    availableCopies: number,
    totalCopies?: number,
    isbnNumber: string,
    rating: number,
    isFavorite?: boolean
}

export enum Genre {
    'Fiction', 'Non-Fiction', 'Sci-Fi', 'Biography'
}

export interface Membership {
    id: string,
    name: string,
    email: string,
    phoneNumber: number,
    membershipStartDate: Date,
    membershipType: MemberShipType,
    maxBooksAllowed: number,
    isFavorite?: boolean
    lendsBookCount?: number
}

export interface Transaction {
    id: string,
    member: string,
    book: string,
    issueDate: Date,
    returnDate: Date,
    status: TransactionStatus,
    fineAmount: number,
    isFavorite?: boolean
    bookDetails?: Book,
    memberDetails?: Membership
    lastUpdated?: Date
}

export interface StaffMember {
    id: string,
    name: string,
    email: string,
    phoneNumber: number,
    role: StaffMembersRole,
    isFavorite?: boolean
}

export enum TransactionStatus {
    Issued,
    Returned,
    Overdue
}

export enum StaffMembersRole {
    Librarian,
    Assistant
}

export enum MemberShipType {
    Basic = 2,
    Premium = 5,
    Elite = 10
}

export interface Toast {
    id: string,
    title: string,
    message: string,
    type: ToastType,
    duration?: number,
}
export enum ToastType {
    Success,
    Error,
    Info,
    Warning
}