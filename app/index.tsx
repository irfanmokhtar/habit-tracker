import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,

    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/Colors';
import { HabitCard } from '../components/HabitCard';
import { useHabits } from '../hooks/useHabits';

const EMOJI_OPTIONS = ['💪', '📚', '🏃', '💧', '🧘', '✍️', '🎯', '⭐', '🌱', '💤', '🍎', '🎨'];

export default function HomeScreen() {
    const router = useRouter();
    const { habits, loading, addHabit } = useHabits();
    const [modalVisible, setModalVisible] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('💪');
    const [enableReminder, setEnableReminder] = useState(false);
    const [reminderTime, setReminderTime] = useState(new Date());

    const handleAddHabit = async () => {
        if (newHabitName.trim()) {
            await addHabit(
                newHabitName.trim(),
                selectedEmoji,
                enableReminder ? reminderTime : undefined
            );
            setNewHabitName('');
            setSelectedEmoji('💪');
            setEnableReminder(false);
            setModalVisible(false);
        }
    };

    const handleHabitPress = (id: string) => {
        router.push(`/habit/${id}`);
    };

    const today = new Date();
    const greeting = getGreeting();

    function getGreeting() {
        const hour = today.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.accent.green} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>{greeting}! 👋</Text>
                    <Text style={styles.subtitle}>
                        {format(today, 'EEEE, MMMM d')}
                    </Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Text style={styles.iconText}>📊</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Your Habits</Text>
                <Text style={styles.habitCount}>
                    {habits.length} {habits.length === 1 ? 'habit' : 'habits'}
                </Text>
            </View>

            {/* Habits List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {habits.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>🌱</Text>
                        <Text style={styles.emptyTitle}>No habits yet</Text>
                        <Text style={styles.emptyText}>
                            Start building a new habit today!{'\n'}
                            It takes 40 days to form one.
                        </Text>
                    </View>
                ) : (
                    habits.map((habit) => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onPress={() => handleHabitPress(habit.id)}
                        />
                    ))
                )}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.9}
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            {/* Add Habit Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Habit</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalLabel}>Choose an emoji</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.emojiScroll}
                        >
                            <View style={styles.emojiContainer}>
                                {EMOJI_OPTIONS.map((emoji) => (
                                    <TouchableOpacity
                                        key={emoji}
                                        style={[
                                            styles.emojiOption,
                                            selectedEmoji === emoji && styles.emojiSelected,
                                        ]}
                                        onPress={() => setSelectedEmoji(emoji)}
                                    >
                                        <Text style={styles.emojiText}>{emoji}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <Text style={styles.modalLabel}>Habit name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Exercise daily"
                            placeholderTextColor={Colors.text.muted}
                            value={newHabitName}
                            onChangeText={setNewHabitName}
                            autoFocus
                        />

                        <View style={styles.reminderContainer}>
                            <View style={styles.reminderHeader}>
                                <Text style={styles.modalLabel}>Daily Reminder</Text>
                                <Switch
                                    value={enableReminder}
                                    onValueChange={setEnableReminder}
                                    trackColor={{ false: Colors.card.dark, true: Colors.accent.green }}
                                    thumbColor={Platform.OS === 'ios' ? '#fff' : Colors.text.primary}
                                />
                            </View>

                            {enableReminder && (
                                <View style={styles.timePickerContainer}>
                                    <DateTimePicker
                                        value={reminderTime}
                                        mode="time"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={(event, selectedDate) => {
                                            if (selectedDate) setReminderTime(selectedDate);
                                        }}
                                        textColor={Colors.text.primary}
                                        themeVariant="dark"
                                        style={styles.timePicker}
                                    />
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.addButton,
                                !newHabitName.trim() && styles.addButtonDisabled,
                            ]}
                            onPress={handleAddHabit}
                            disabled={!newHabitName.trim()}
                        >
                            <Text style={styles.addButtonText}>Create Habit</Text>
                        </TouchableOpacity>

                        <Text style={styles.modalHint}>
                            💡 Tip: It takes 40 days of consistent effort to form a new habit!
                        </Text>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    greeting: {
        ...Typography.h1,
        color: Colors.text.primary,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.text.secondary,
        marginTop: Spacing.xs,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.card.dark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    title: {
        ...Typography.h2,
        color: Colors.text.primary,
    },
    habitCount: {
        ...Typography.caption,
        color: Colors.text.secondary,
        backgroundColor: Colors.card.dark,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xxl * 2,
        paddingHorizontal: Spacing.xl,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: Spacing.lg,
    },
    emptyTitle: {
        ...Typography.h2,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    fab: {
        position: 'absolute',
        bottom: Spacing.xl,
        right: Spacing.lg,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.accent.green,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.accent.green,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    fabIcon: {
        fontSize: 32,
        color: Colors.text.dark,
        fontWeight: '300',
        marginTop: -2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: Colors.ui.overlay,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.background.secondary,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    modalTitle: {
        ...Typography.h2,
        color: Colors.text.primary,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.card.dark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        color: Colors.text.secondary,
        fontSize: 16,
    },
    modalLabel: {
        ...Typography.bodyBold,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
        marginTop: Spacing.md,
    },
    emojiScroll: {
        marginBottom: Spacing.sm,
    },
    emojiContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    emojiOption: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.card.dark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emojiSelected: {
        backgroundColor: Colors.accent.green,
    },
    emojiText: {
        fontSize: 24,
    },
    input: {
        backgroundColor: Colors.card.dark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        ...Typography.body,
        color: Colors.text.primary,
        marginBottom: Spacing.lg,
    },
    addButton: {
        backgroundColor: Colors.accent.green,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    addButtonDisabled: {
        backgroundColor: Colors.calendar.inactive,
    },
    addButtonText: {
        ...Typography.bodyBold,
        color: Colors.text.dark,
    },
    modalHint: {
        ...Typography.caption,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
    reminderContainer: {
        marginBottom: Spacing.lg,
    },
    reminderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    timePickerContainer: {
        alignItems: 'center',
        backgroundColor: Colors.card.dark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.sm,
    },
    timePicker: {
        height: 120,
        width: '100%',
    },
});
