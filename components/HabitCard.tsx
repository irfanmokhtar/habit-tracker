import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/Colors';
import { Habit } from '../types/habit';
import { differenceInDays, parseISO } from 'date-fns';

interface HabitCardProps {
    habit: Habit;
    onPress: () => void;
}

const TOTAL_DAYS = 40;

export function HabitCard({ habit, onPress }: HabitCardProps) {
    const completedCount = habit.completedDays.length;
    const progress = Math.min(completedCount / TOTAL_DAYS, 1);

    const startDate = parseISO(habit.createdAt);
    const today = new Date();
    const daysSinceStart = differenceInDays(today, startDate) + 1;
    const currentDay = Math.min(daysSinceStart, TOTAL_DAYS);

    const getProgressColor = () => {
        if (progress >= 1) return Colors.accent.green;
        if (progress >= 0.5) return Colors.accent.greenLight;
        if (progress >= 0.25) return Colors.accent.orange;
        return Colors.accent.coral;
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.95}
        >
            <View style={styles.header}>
                <View style={styles.emojiContainer}>
                    <Text style={styles.emoji}>{habit.emoji}</Text>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
                    <Text style={styles.subtitle}>Day {currentDay} of {TOTAL_DAYS}</Text>
                </View>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsNumber}>{completedCount}</Text>
                    <Text style={styles.statsLabel}>days</Text>
                </View>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            {
                                width: `${progress * 100}%`,
                                backgroundColor: getProgressColor(),
                            },
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
            </View>

            {progress >= 1 && (
                <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>🎉 Habit Formed!</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.card.primary,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginHorizontal: Spacing.md,
        marginBottom: Spacing.md,
        shadowColor: Colors.ui.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    emojiContainer: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.background.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    emoji: {
        fontSize: 24,
    },
    titleContainer: {
        flex: 1,
    },
    name: {
        ...Typography.bodyBold,
        color: Colors.text.dark,
        marginBottom: 2,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.text.muted,
    },
    statsContainer: {
        alignItems: 'center',
        backgroundColor: Colors.background.primary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
    },
    statsNumber: {
        ...Typography.h2,
        color: Colors.text.primary,
        lineHeight: 28,
    },
    statsLabel: {
        ...Typography.small,
        color: Colors.text.secondary,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    progressBackground: {
        flex: 1,
        height: 8,
        backgroundColor: Colors.ui.border,
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: BorderRadius.full,
    },
    progressText: {
        ...Typography.small,
        color: Colors.text.muted,
        width: 40,
        textAlign: 'right',
    },
    completedBadge: {
        marginTop: Spacing.md,
        backgroundColor: Colors.accent.green,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignSelf: 'flex-start',
    },
    completedText: {
        ...Typography.caption,
        color: Colors.text.dark,
        fontWeight: '600',
    },
});
