import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../types/habit';

const HABITS_KEY = '@habit_tracker_habits';

export const storage = {
    async getHabits(): Promise<Habit[]> {
        try {
            const data = await AsyncStorage.getItem(HABITS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading habits:', error);
            return [];
        }
    },

    async saveHabits(habits: Habit[]): Promise<void> {
        try {
            await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
        } catch (error) {
            console.error('Error saving habits:', error);
        }
    },

    async addHabit(habit: Habit): Promise<void> {
        const habits = await this.getHabits();
        habits.push(habit);
        await this.saveHabits(habits);
    },

    async updateHabit(updatedHabit: Habit): Promise<void> {
        const habits = await this.getHabits();
        const index = habits.findIndex((h) => h.id === updatedHabit.id);
        if (index !== -1) {
            habits[index] = updatedHabit;
            await this.saveHabits(habits);
        }
    },

    async deleteHabit(id: string): Promise<void> {
        const habits = await this.getHabits();
        const filtered = habits.filter((h) => h.id !== id);
        await this.saveHabits(filtered);
    },

    async getHabitById(id: string): Promise<Habit | null> {
        const habits = await this.getHabits();
        return habits.find((h) => h.id === id) || null;
    },

    async toggleDayCompletion(habitId: string, dateStr: string): Promise<Habit | null> {
        const habits = await this.getHabits();
        const habit = habits.find((h) => h.id === habitId);

        if (!habit) return null;

        const dayIndex = habit.completedDays.indexOf(dateStr);
        if (dayIndex === -1) {
            habit.completedDays.push(dateStr);
        } else {
            habit.completedDays.splice(dayIndex, 1);
        }

        await this.saveHabits(habits);
        return habit;
    },
};
