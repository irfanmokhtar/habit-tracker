import { useState, useEffect, useCallback } from 'react';
import { Habit } from '../types/habit';
import { storage } from '../utils/storage';
import { scheduleReminder, cancelReminder } from '../utils/notifications';

export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);

    const loadHabits = useCallback(async () => {
        setLoading(true);
        const data = await storage.getHabits();
        setHabits(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadHabits();
    }, [loadHabits]);

    const addHabit = useCallback(async (name: string, emoji: string, reminderTime?: Date) => {
        let notificationId: string | undefined;

        if (reminderTime) {
            const hour = reminderTime.getHours();
            const minute = reminderTime.getMinutes();
            const id = await scheduleReminder(name, `Time to work on your habit: ${name}!`, hour, minute);
            if (id) notificationId = id;
        }

        const newHabit: Habit = {
            id: Date.now().toString(),
            name,
            emoji,
            createdAt: new Date().toISOString().split('T')[0],
            completedDays: [],
            reminderTime: reminderTime ? reminderTime.toISOString() : undefined,
            notificationId,
        };
        await storage.addHabit(newHabit);
        setHabits((prev) => [...prev, newHabit]);
        return newHabit;
    }, []);

    const deleteHabit = useCallback(async (id: string) => {
        const habit = habits.find((h) => h.id === id);
        if (habit?.notificationId) {
            await cancelReminder(habit.notificationId);
        }
        await storage.deleteHabit(id);
        setHabits((prev) => prev.filter((h) => h.id !== id));
    }, [habits]);

    const toggleDay = useCallback(async (habitId: string, dateStr: string) => {
        const updated = await storage.toggleDayCompletion(habitId, dateStr);
        if (updated) {
            setHabits((prev) =>
                prev.map((h) => (h.id === habitId ? updated : h))
            );
        }
        return updated;
    }, []);

    const getHabit = useCallback((id: string) => {
        return habits.find((h) => h.id === id) || null;
    }, [habits]);

    return {
        habits,
        loading,
        addHabit,
        deleteHabit,
        toggleDay,
        getHabit,
        refreshHabits: loadHabits,
    };
}
