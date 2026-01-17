export interface Habit {
    id: string;
    name: string;
    emoji: string;
    createdAt: string; // ISO date string (Day 1)
    completedDays: string[]; // Array of completed ISO dates
    reminderTime?: string; // ISO time string HH:mm
    notificationId?: string; // Notification ID
}
