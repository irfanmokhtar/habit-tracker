import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/Colors';
import { addDays, format, parseISO, isBefore, isAfter, isSameDay } from 'date-fns';
import { Config } from '../constants/Config';

interface CalendarProps {
    startDate: string;
    completedDays: string[];
    onDayPress: (dateStr: string) => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SCREEN_WIDTH = Dimensions.get('window').width;
const TOTAL_DAYS = Config.TOTAL_DAYS;
// Calculate cell width based on screen width minus padding
// Screen width - (outer padding * 2) - (cell margin * 2 * 7)
const CONTAINER_PADDING = Spacing.md;
const CELL_MARGIN = 2;
const AVAILABLE_WIDTH = SCREEN_WIDTH - (CONTAINER_PADDING * 2) - (Spacing.md * 2); // accounting for container margin
const CELL_WIDTH = (AVAILABLE_WIDTH / 7) - (CELL_MARGIN * 2);

export function Calendar({ startDate, completedDays, onDayPress }: CalendarProps) {
    const start = parseISO(startDate);
    const today = new Date();

    // Generate all 40 days
    const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
        const date = addDays(start, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        return {
            date,
            dateStr,
            dayNumber: i + 1,
            isCompleted: completedDays.includes(dateStr),
            isToday: isSameDay(date, today),
            isFuture: isAfter(date, today),
            isPast: isBefore(date, today) && !isSameDay(date, today),
        };
    });

    // Group days by week
    const weeks: any[][] = [];
    let currentWeek: any[] = [];

    // Add empty cells for start offset
    const startDayOfWeek = start.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
        currentWeek.push(null);
    }

    days.forEach((day) => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    return (
        <View style={styles.container}>
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: Colors.calendar.completed }]} />
                    <Text style={styles.legendText}>Completed</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: Colors.calendar.today }]} />
                    <Text style={styles.legendText}>Today</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: Colors.calendar.inactive }]} />
                    <Text style={styles.legendText}>Missed</Text>
                </View>
            </View>

            <View style={styles.header}>
                {DAYS_OF_WEEK.map((day) => (
                    <View key={day} style={[styles.headerCell, { width: CELL_WIDTH + (CELL_MARGIN * 2) }]}>
                        <Text style={styles.headerText}>{day}</Text>
                    </View>
                ))}
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {weeks.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.week}>
                        {week.map((day, dayIndex) => {
                            if (!day) {
                                return <View key={`empty-${dayIndex}`} style={[styles.dayCell, styles.emptyCell, { width: CELL_WIDTH }]} />;
                            }

                            return (
                                <TouchableOpacity
                                    key={`${weekIndex}-${dayIndex}`}
                                    style={[
                                        styles.dayCell,
                                        { width: CELL_WIDTH },
                                        day.isCompleted && styles.completedCell,
                                        day.isToday && !day.isCompleted && styles.todayCell,
                                        day.isFuture && styles.futureCell,
                                        day.isPast && !day.isCompleted && styles.missedCell,
                                    ]}
                                    onPress={() => !day.isFuture && onDayPress(day.dateStr)}
                                    disabled={day.isFuture}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.dayNumber,
                                            day.isCompleted && styles.completedText,
                                            day.isToday && !day.isCompleted && styles.todayText,
                                            day.isFuture && styles.futureText,
                                        ]}
                                    >
                                        {format(day.date, 'd')}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.dayLabel,
                                            day.isCompleted && styles.completedLabel,
                                            day.isFuture && styles.futureLabel,
                                        ]}
                                    >
                                        Day {day.dayNumber}
                                    </Text>
                                    {day.isCompleted && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Start: {format(start, 'MMM d, yyyy')}
                </Text>
                <Text style={styles.footerText}>
                    End: {format(addDays(start, TOTAL_DAYS - 1), 'MMM d, yyyy')}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.card.primary,
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        marginHorizontal: Spacing.md,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.lg,
        marginBottom: Spacing.md,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ui.border,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        ...Typography.small,
        color: Colors.text.muted,
    },
    header: {
        flexDirection: 'row',
        marginBottom: Spacing.sm,
        justifyContent: 'space-between',
    },
    headerCell: {
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    headerText: {
        ...Typography.small,
        color: Colors.text.muted,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: Spacing.md,
    },
    week: {
        flexDirection: 'row',
        marginBottom: 4,
        justifyContent: 'space-between',
    },
    dayCell: {
        height: 64, // Slightly increased height
        margin: CELL_MARGIN,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.background.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    emptyCell: {
        backgroundColor: 'transparent',
    },
    completedCell: {
        backgroundColor: Colors.calendar.completed,
    },
    todayCell: {
        backgroundColor: Colors.background.primary,
        borderWidth: 2,
        borderColor: Colors.calendar.today,
    },
    futureCell: {
        backgroundColor: Colors.calendar.future, // Now a visible gray
        opacity: 0.3, // Lower opacity to distinguish from past/missed
    },
    missedCell: {
        backgroundColor: Colors.calendar.inactive,
    },
    dayNumber: {
        ...Typography.bodyBold,
        color: Colors.text.primary,
        marginBottom: 2,
        fontSize: 16,
    },
    completedText: {
        color: Colors.text.dark,
    },
    todayText: {
        color: Colors.calendar.today,
    },
    futureText: {
        color: Colors.text.dark, // Dark text for better visibility on gray
    },
    dayLabel: {
        fontSize: 10,
        color: Colors.text.secondary,
        opacity: 0.8,
    },
    completedLabel: {
        color: Colors.text.dark,
        opacity: 0.7,
    },
    futureLabel: {
        color: Colors.text.dark, // Dark text
        opacity: 0.5,
    },
    checkmark: {
        position: 'absolute',
        top: 2,
        right: 4,
        fontSize: 10,
        color: Colors.text.dark,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.ui.border,
    },
    footerText: {
        ...Typography.caption,
        color: Colors.text.muted,
    },
});
