import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,

    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/Colors';
import { Calendar } from '../../components/Calendar';
import { storage } from '../../utils/storage';
import { Habit } from '../../types/habit';

const TOTAL_DAYS = 40;

export default function HabitDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [habit, setHabit] = useState<Habit | null>(null);
    const [loading, setLoading] = useState(true);

    const loadHabit = useCallback(async () => {
        if (!id) return;
        const data = await storage.getHabitById(id);
        setHabit(data);
        setLoading(false);
    }, [id]);

    useEffect(() => {
        loadHabit();
    }, [loadHabit]);

    const handleDayPress = async (dateStr: string) => {
        if (!habit) return;
        const updated = await storage.toggleDayCompletion(habit.id, dateStr);
        if (updated) {
            setHabit(updated);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Habit',
            `Are you sure you want to delete "${habit?.name}"? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        if (habit) {
                            await storage.deleteHabit(habit.id);
                            router.back();
                        }
                    },
                },
            ]
        );
    };

    const handleMarkToday = async () => {
        if (!habit) return;
        const today = format(new Date(), 'yyyy-MM-dd');
        const updated = await storage.toggleDayCompletion(habit.id, today);
        if (updated) {
            setHabit(updated);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.accent.green} />
            </View>
        );
    }

    if (!habit) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Habit not found</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const startDate = parseISO(habit.createdAt);
    const endDate = addDays(startDate, TOTAL_DAYS - 1);
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const isTodayCompleted = habit.completedDays.includes(todayStr);
    const currentDay = Math.min(differenceInDays(today, startDate) + 1, TOTAL_DAYS);
    const completedCount = habit.completedDays.length;
    const progress = Math.round((completedCount / TOTAL_DAYS) * 100);

    return (
        <SafeAreaView style={styles.container}>
            {/* Habit Header */}
            <View style={styles.header}>
                <View style={styles.emojiLarge}>
                    <Text style={styles.emojiText}>{habit.emoji}</Text>
                </View>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.habitSubtitle}>
                    Day {currentDay} of {TOTAL_DAYS} • {completedCount} completed
                </Text>
            </View>

            {/* Progress Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{progress}%</Text>
                    <Text style={styles.statLabel}>Progress</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{completedCount}</Text>
                    <Text style={styles.statLabel}>Days Done</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{TOTAL_DAYS - completedCount}</Text>
                    <Text style={styles.statLabel}>Remaining</Text>
                </View>
            </View>

            {/* Calendar */}
            <View style={styles.calendarContainer}>
                <Calendar
                    startDate={habit.createdAt}
                    completedDays={habit.completedDays}
                    onDayPress={handleDayPress}
                />
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[
                        styles.markTodayButton,
                        isTodayCompleted && styles.markTodayButtonCompleted,
                    ]}
                    onPress={handleMarkToday}
                >
                    <Text
                        style={[
                            styles.markTodayText,
                            isTodayCompleted && styles.markTodayTextCompleted,
                        ]}
                    >
                        {isTodayCompleted ? '✓ Done Today' : 'Mark Today Complete'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteText}>Delete Habit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background.primary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    errorText: {
        ...Typography.h2,
        color: Colors.text.primary,
        marginBottom: Spacing.lg,
    },
    backButton: {
        backgroundColor: Colors.accent.green,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    backButtonText: {
        ...Typography.bodyBold,
        color: Colors.text.dark,
    },
    header: {
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.md,
    },
    emojiLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.card.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    emojiText: {
        fontSize: 40,
    },
    habitName: {
        ...Typography.h1,
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    habitSubtitle: {
        ...Typography.body,
        color: Colors.text.secondary,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.md,
    },
    statCard: {
        backgroundColor: Colors.card.dark,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        minWidth: 90,
    },
    statValue: {
        ...Typography.h2,
        color: Colors.accent.green,
    },
    statLabel: {
        ...Typography.caption,
        color: Colors.text.secondary,
        marginTop: Spacing.xs,
    },
    calendarContainer: {
        flex: 1,
        marginBottom: Spacing.md,
    },
    actions: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    markTodayButton: {
        backgroundColor: Colors.accent.green,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    markTodayButtonCompleted: {
        backgroundColor: Colors.card.dark,
        borderWidth: 2,
        borderColor: Colors.accent.green,
    },
    markTodayText: {
        ...Typography.bodyBold,
        color: Colors.text.dark,
    },
    markTodayTextCompleted: {
        color: Colors.accent.green,
    },
    deleteButton: {
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        backgroundColor: Colors.card.dark,
    },
    deleteText: {
        ...Typography.body,
        color: Colors.accent.coral,
    },
});
