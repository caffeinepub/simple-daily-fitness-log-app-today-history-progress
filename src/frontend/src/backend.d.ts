import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WorkoutSection {
    name: string;
    exercises: Array<Exercise>;
}
export interface Exercise {
    id: bigint;
    name: string;
    reps: bigint;
    sets: bigint;
    weightKg: number;
}
export type Time = bigint;
export interface WorkoutContent {
    days: Array<WorkoutDay>;
}
export interface WorkoutCompletionRecord {
    completions: Array<boolean>;
}
export interface WeightEntry {
    weightKg: number;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
    createdAt: Time;
    startWeight: number;
    weeklyWorkoutFrequency: bigint;
    targetWeight: number;
    dailyDurationHours: number;
}
export interface WorkoutDay {
    sections: Array<WorkoutSection>;
    dayName: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addWeightEntry(weight: number): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCustomWorkoutForDate(date: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLatestWeight(): Promise<WeightEntry | null>;
    getProfile(): Promise<UserProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeightEntries(): Promise<Array<WeightEntry>>;
    getWorkoutCompletionCount(): Promise<bigint>;
    getWorkoutCompletionForDate(date: string): Promise<boolean>;
    getWorkoutCompletionsForDateRange(startDate: string, endDate: string): Promise<Array<[string, boolean]>>;
    getWorkoutForDate(date: string): Promise<WorkoutContent | null>;
    getWorkoutRecords(): Promise<Array<WorkoutCompletionRecord>>;
    getWorkoutStreak(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    isWorkoutSkippedForDate(date: string): Promise<boolean>;
    markWorkoutCompleted(): Promise<void>;
    markWorkoutCompletedForDate(date: string): Promise<void>;
    markWorkoutIncompleteForDate(date: string): Promise<void>;
    resetWorkoutRecords(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCustomWorkoutForDate(date: string, workout: WorkoutContent): Promise<void>;
    setWorkoutSkippedForDate(date: string, skipped: boolean): Promise<void>;
    toggleWorkoutCompletionForDate(date: string): Promise<void>;
    toggleWorkoutSkippedForDate(date: string): Promise<boolean>;
    updateDefaultProfile(): Promise<void>;
    updateProfile(name: string, weight: number, targetWeight: number, frequency: bigint, duration: number): Promise<void>;
}
