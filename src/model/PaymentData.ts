export interface PaymentData {
    id: string; // Generated by the backend
    userId: string; // User making the payment
    paymentId: string; // Generated by the payment gateway
    amount: number; // Payment amount
    currency: string; // Payment currency (e.g., "USD", "LKR")
    paymentMethod: string; // Payment method (e.g., "card")
    status: "PENDING" | "COMPLETED" | "FAILED"; // Payment status
    transactionId: string; // Transaction ID from the payment gateway
    createdAt: Date; // Timestamp of payment creation
}