import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Exercise {
    id: bigint;
    difficultyLevel: DifficultyLevel;
    name: string;
    equipmentType: EquipmentType;
    instructions: string;
    mediaUrl: string;
    imageUrl: string;
    benefits: string;
    muscleGroup: MuscleGroup;
}
export interface BlogPost {
    id: bigint;
    title: string;
    content: string;
    seoTitle: string;
    modifiedAt: Time;
    published: boolean;
    createdAt: Time;
    author: string;
    seoKeywords: Array<string>;
    seoMetaDescription: string;
}
export type Time = bigint;
export interface MuscleGroupDetails {
    exerciseIds: Array<bigint>;
    name: string;
    description: string;
    imageUrl: string;
}
export interface Routine {
    breathworkPracticeIds: Array<bigint>;
    exerciseIds: Array<bigint>;
    userId: Principal;
}
export interface BreathworkPractice {
    id: bigint;
    difficultyLevel: DifficultyLevel;
    duration: bigint;
    name: string;
    mindfulnessBenefits: string;
    recommendedExerciseIds: Array<bigint>;
    techniqueDescription: string;
    mediaUrl: string;
}
export interface UserProfile {
    name: string;
    musicPreference: MusicPreference;
}
export enum DifficultyLevel {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced"
}
export enum EquipmentType {
    bodyweight = "bodyweight",
    cable = "cable",
    barbell = "barbell",
    dumbbell = "dumbbell",
    bands = "bands",
    machine = "machine"
}
export enum MuscleGroup {
    shoulders = "shoulders",
    arms = "arms",
    back = "back",
    core = "core",
    chest = "chest",
    legs = "legs"
}
export enum MusicPreference {
    on = "on",
    off = "off"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBreathworkPractice(name: string, techniqueDescription: string, mediaUrl: string, recommendedExerciseIds: Array<bigint>, mindfulnessBenefits: string, duration: bigint, difficulty: DifficultyLevel): Promise<void>;
    addExercise(name: string, muscleGroup: MuscleGroup, equipmentType: EquipmentType, difficulty: DifficultyLevel, instructions: string, mediaUrl: string, imageUrl: string, benefits: string): Promise<void>;
    addMuscleGroup(name: string, description: string, imageUrl: string): Promise<void>;
    addToRoutine(exerciseId: bigint, isBreathwork: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(title: string, content: string, author: string, seoTitle: string, seoMetaDescription: string, seoKeywords: Array<string>): Promise<bigint>;
    createRoutine(): Promise<void>;
    deleteBlogPost(id: bigint): Promise<void>;
    deleteBreathworkPractice(breathworkPracticeId: bigint): Promise<void>;
    deleteExercise(exerciseId: bigint): Promise<void>;
    deleteMuscleGroup(name: string): Promise<void>;
    deleteRoutine(): Promise<void>;
    editBlogPost(id: bigint, title: string, content: string, author: string, seoTitle: string, seoMetaDescription: string, seoKeywords: Array<string>): Promise<void>;
    editBreathworkPractice(id: bigint, name: string, techniqueDescription: string, mediaUrl: string, recommendedExerciseIds: Array<bigint>, mindfulnessBenefits: string, duration: bigint, difficulty: DifficultyLevel): Promise<void>;
    editExercise(id: bigint, name: string, muscleGroup: MuscleGroup, equipmentType: EquipmentType, difficulty: DifficultyLevel, instructions: string, mediaUrl: string, imageUrl: string, benefits: string): Promise<void>;
    editMuscleGroup(name: string, description: string, imageUrl: string): Promise<void>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllBreathworkPractices(): Promise<Array<BreathworkPractice>>;
    getAllExercises(): Promise<Array<Exercise>>;
    getAllMuscleGroups(): Promise<Array<MuscleGroupDetails>>;
    getBlogPost(id: bigint): Promise<BlogPost | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMuscleGroupDetails(muscleGroupName: string): Promise<{
        exercises: Array<Exercise>;
        muscleGroup: MuscleGroupDetails;
    } | null>;
    getMuscleGroupExercises(muscleGroup: MuscleGroup): Promise<Array<Exercise>>;
    getRoutine(userId: Principal): Promise<Routine | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    publishBlogPost(id: bigint): Promise<void>;
    removeFromRoutine(exerciseId: bigint, isBreathwork: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    unpublishBlogPost(id: bigint): Promise<void>;
    updateMusicPreference(preference: MusicPreference): Promise<void>;
}
