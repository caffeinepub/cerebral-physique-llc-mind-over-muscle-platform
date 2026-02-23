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
export interface ExercisePreview {
    id: bigint;
    primaryMuscle: MuscleGroup;
    name: string;
    imageUrl: string;
}
export interface Exercise {
    id: bigint;
    primaryMuscle: MuscleGroup;
    cues: string;
    name: string;
    equipmentType: EquipmentType;
    imageUrl: string;
    isPlaceholder: boolean;
    videoUrl: string;
    secondaryMuscles: Array<MuscleGroup>;
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
    memberOnly: boolean;
    seoMetaDescription: string;
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
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface AmazonProduct {
    id: bigint;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    affiliateLink: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
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
export interface Membership {
    principal: Principal;
    active: boolean;
    price: bigint;
    stripeId: string;
}
export interface UserProfile {
    name: string;
    email?: string;
    membershipStatus?: string;
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
    addExercise(name: string, primaryMuscle: MuscleGroup, secondaryMuscles: Array<MuscleGroup>, equipmentType: EquipmentType, videoUrl: string, cues: string, imageUrl: string, isPlaceholder: boolean): Promise<void>;
    addMembership(stripeId: string, price: bigint): Promise<void>;
    addMembershipForUser(user: Principal, stripeId: string, price: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(title: string, content: string, author: string, memberOnly: boolean, seoTitle: string, seoMetaDescription: string, seoKeywords: Array<string>): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteAmazonProduct(id: bigint): Promise<void>;
    deleteBlogPost(id: bigint): Promise<void>;
    deleteExercise(id: bigint): Promise<void>;
    getAffiliateDisclosure(): Promise<string>;
    getAllAmazonProducts(): Promise<Array<AmazonProduct>>;
    getAllBlogPostPreviews(): Promise<Array<BlogPostPreview>>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllExercisePreviews(): Promise<Array<ExercisePreview>>;
    getAllExercises(): Promise<Array<Exercise>>;
    getAllMemberships(): Promise<Array<Membership>>;
    getBlogPost(id: bigint): Promise<BlogPost | null>;
    getBlogPostPreview(id: bigint): Promise<BlogPostPreview | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMembership(): Promise<Membership | null>;
    getMuscleGroupArtist(name: string): Promise<MuscleGroupCard | null>;
    getMuscleGroupArtists(): Promise<Array<MuscleGroupCard>>;
    getMuscleGroupExercisePreviews(muscleGroup: MuscleGroup): Promise<Array<ExercisePreview>>;
    getMuscleGroupExercises(muscleGroup: MuscleGroup): Promise<Array<Exercise>>;
    getMuscleGroups(): Promise<Array<MuscleGroupDetails>>;
    getPrivacyPolicy(): Promise<string>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasActiveMembership(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    publishBlogPost(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    unpublishBlogPost(id: bigint): Promise<void>;
    updateAmazonProduct(id: bigint, name: string, description: string, imageUrl: string, category: string, affiliateLink: string): Promise<void>;
    updateBlogPost(id: bigint, title: string, content: string, author: string, memberOnly: boolean, seoTitle: string, seoMetaDescription: string, seoKeywords: Array<string>): Promise<void>;
    updateExercise(id: bigint, name: string, primaryMuscle: MuscleGroup, secondaryMuscles: Array<MuscleGroup>, equipmentType: EquipmentType, videoUrl: string, cues: string, imageUrl: string, isPlaceholder: boolean): Promise<void>;
    updateMembershipStatus(user: Principal, active: boolean): Promise<void>;
    updateMuscleGroup(name: string, description: string, imageUrl: string): Promise<void>;
    updateMuscleGroupArtist(name: string, card: MuscleGroupCard): Promise<void>;
}
