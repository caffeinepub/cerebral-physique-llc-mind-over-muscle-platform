import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface BlogMedia {
    imageUrls: Array<string>;
    videoUrls: Array<string>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface BlogPostPreview {
    id: bigint;
    title: string;
    seoTitle: string;
    createdAt: Time;
    author: string;
    memberOnly: boolean;
    seoMetaDescription: string;
}
export interface WorkoutRoutine {
    principal: Principal;
    name: string;
    exercises: Array<bigint>;
}
export interface AmazonProduct {
    id: bigint;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    affiliateLink: string;
}
export interface MuscleGroupDetails {
    exerciseIds: Array<bigint>;
    card: MuscleGroupCard;
    name: string;
    description: string;
    imageUrl: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface MuscleGroupCard {
    title: string;
    description: string;
    heroImage?: ExternalBlob;
    imageUrl: string;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface MiscConfig {
    adminContactEmail: string;
    supportContactEmail: string;
}
export interface ExercisePreview {
    id: bigint;
    primaryMuscle: MuscleGroup;
    name: string;
    imageUrl: string;
}
export interface Exercise {
    id: bigint;
    media: ExerciseMedia;
    primaryMuscle: MuscleGroup;
    cues: string;
    name: string;
    equipmentType: EquipmentType;
    description: string;
    isPlaceholder: boolean;
    videoUrl: string;
    secondaryMuscles: Array<MuscleGroup>;
}
export interface BlogPost {
    id: bigint;
    media: BlogMedia;
    title: string;
    content: string;
    seoTitle: string;
    modifiedAt: Time;
    published: boolean;
    createdAt: Time;
    author: string;
    seoKeywords: Array<string>;
    memberOnly: boolean;
    seoMetaDescription: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface Membership {
    principal: Principal;
    active: boolean;
    price: bigint;
    stripeId: string;
}
export interface NutritionArticle {
    id: bigint;
    media: BlogMedia;
    title: string;
    content: string;
    published: boolean;
    createdAt: Time;
    author: string;
    memberOnly: boolean;
}
export interface ExerciseMedia {
    imageUrls: Array<string>;
    videoUrls: Array<string>;
}
export interface UserProfile {
    name: string;
    email?: string;
    membershipStatus?: string;
}
export interface NutritionArticlePreview {
    id: bigint;
    title: string;
    createdAt: Time;
    author: string;
    memberOnly: boolean;
}
export enum EquipmentType {
    bodyweight = "bodyweight",
    cable = "cable",
    dumbbell = "dumbbell",
    machine = "machine"
}
export enum MuscleGroup {
    triceps = "triceps",
    shoulders = "shoulders",
    back = "back",
    core = "core",
    chest = "chest",
    quads = "quads",
    hamstrings = "hamstrings",
    glutes = "glutes",
    calves = "calves",
    biceps = "biceps"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAmazonProduct(name: string, description: string, imageUrl: string, category: string, affiliateLink: string): Promise<void>;
    addExercise(name: string, description: string, primaryMuscle: MuscleGroup, secondaryMuscles: Array<MuscleGroup>, equipmentType: EquipmentType, videoUrl: string, cues: string, media: ExerciseMedia, isPlaceholder: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(title: string, content: string, author: string, memberOnly: boolean, media: BlogMedia, seoTitle: string, seoMetaDescription: string, seoKeywords: Array<string>): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createNutritionArticle(title: string, content: string, author: string, media: BlogMedia, memberOnly: boolean): Promise<void>;
    createWorkoutRoutine(name: string, exerciseIds: Array<bigint>): Promise<void>;
    deleteAmazonProduct(id: bigint): Promise<void>;
    deleteBlogPost(id: bigint): Promise<void>;
    deleteExercise(id: bigint): Promise<void>;
    deleteNutritionArticle(id: bigint): Promise<void>;
    deleteWorkoutRoutine(name: string): Promise<void>;
    getAllAmazonProducts(): Promise<Array<AmazonProduct>>;
    getAllBlogPostsAdmin(): Promise<Array<BlogPost>>;
    getAllExercisePreviews(): Promise<Array<ExercisePreview>>;
    getAllExercisesAdmin(): Promise<Array<Exercise>>;
    getAllMuscleGroups(): Promise<Array<MuscleGroupDetails>>;
    getAllNutritionArticlesAdmin(): Promise<Array<NutritionArticle>>;
    getBlogPost(id: bigint): Promise<BlogPost | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerWorkoutRoutines(): Promise<Array<WorkoutRoutine>>;
    getExercise(id: bigint): Promise<Exercise | null>;
    getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Promise<Array<Exercise>>;
    getMembership(user: Principal): Promise<Membership | null>;
    getMiscConfig(): Promise<MiscConfig | null>;
    getMuscleGroupDetails(name: string): Promise<MuscleGroupDetails | null>;
    getMyMembership(): Promise<Membership | null>;
    getNutritionArticle(id: bigint): Promise<NutritionArticle | null>;
    getPrivacyPolicy(): Promise<string>;
    getPublishedBlogPostPreviews(): Promise<Array<BlogPostPreview>>;
    getPublishedNutritionArticlePreviews(): Promise<Array<NutritionArticlePreview>>;
    getStripeConfig(): Promise<StripeConfiguration | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserWorkoutRoutines(user: Principal): Promise<Array<WorkoutRoutine>>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    publishBlogPost(id: bigint, published: boolean): Promise<void>;
    publishNutritionArticle(id: bigint, published: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setMembership(user: Principal, active: boolean, stripeId: string, price: bigint): Promise<void>;
    setMiscConfig(config: MiscConfig): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAmazonProduct(id: bigint, name: string, description: string, imageUrl: string, category: string, affiliateLink: string): Promise<void>;
    updateBlogPost(id: bigint, title: string, content: string, author: string, memberOnly: boolean, media: BlogMedia, seoTitle: string, seoMetaDescription: string, seoKeywords: Array<string>): Promise<void>;
    updateExercise(id: bigint, name: string, description: string, primaryMuscle: MuscleGroup, secondaryMuscles: Array<MuscleGroup>, equipmentType: EquipmentType, videoUrl: string, cues: string, media: ExerciseMedia, isPlaceholder: boolean): Promise<void>;
    updateMuscleGroupCard(name: string, card: MuscleGroupCard): Promise<void>;
    updateNutritionArticle(id: bigint, title: string, content: string, author: string, media: BlogMedia, memberOnly: boolean): Promise<void>;
    updateWorkoutRoutine(name: string, exerciseIds: Array<bigint>): Promise<void>;
}
