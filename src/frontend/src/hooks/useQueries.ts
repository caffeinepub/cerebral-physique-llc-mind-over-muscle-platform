import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Exercise,
  ExercisePreview,
  MuscleGroup,
  EquipmentType,
  BlogPost,
  BlogPostPreview,
  AmazonProduct,
  Membership,
  MuscleGroupDetails,
  MuscleGroupCard,
  UserProfile,
  ShoppingItem,
  StripeConfiguration,
  StripeSessionStatus,
} from '../backend';
import { Principal } from '@dfinity/principal';

// Exercise Queries
export function useGetAllExercises() {
  const { actor, isFetching } = useActor();

  return useQuery<Exercise[]>({
    queryKey: ['exercises'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExercises();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllExercisePreviews() {
  const { actor, isFetching } = useActor();

  return useQuery<ExercisePreview[]>({
    queryKey: ['exercisePreviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExercisePreviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMuscleGroupExercises(muscleGroup: MuscleGroup) {
  const { actor, isFetching } = useActor();

  return useQuery<Exercise[]>({
    queryKey: ['muscleGroupExercises', muscleGroup],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMuscleGroupExercises(muscleGroup);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMuscleGroupExercisePreviews(muscleGroup: MuscleGroup) {
  const { actor, isFetching } = useActor();

  return useQuery<ExercisePreview[]>({
    queryKey: ['muscleGroupExercisePreviews', muscleGroup],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMuscleGroupExercisePreviews(muscleGroup);
    },
    enabled: !!actor && !isFetching,
  });
}

// Exercise Mutations
export function useAddExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exercise: {
      name: string;
      primaryMuscle: MuscleGroup;
      secondaryMuscles: MuscleGroup[];
      equipmentType: EquipmentType;
      videoUrl: string;
      cues: string;
      imageUrl: string;
      isPlaceholder: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addExercise(
        exercise.name,
        exercise.primaryMuscle,
        exercise.secondaryMuscles,
        exercise.equipmentType,
        exercise.videoUrl,
        exercise.cues,
        exercise.imageUrl,
        exercise.isPlaceholder
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['exercisePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroupExercises'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroupExercisePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroups'] });
    },
  });
}

export function useUpdateExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exercise: {
      id: bigint;
      name: string;
      primaryMuscle: MuscleGroup;
      secondaryMuscles: MuscleGroup[];
      equipmentType: EquipmentType;
      videoUrl: string;
      cues: string;
      imageUrl: string;
      isPlaceholder: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateExercise(
        exercise.id,
        exercise.name,
        exercise.primaryMuscle,
        exercise.secondaryMuscles,
        exercise.equipmentType,
        exercise.videoUrl,
        exercise.cues,
        exercise.imageUrl,
        exercise.isPlaceholder
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['exercisePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroupExercises'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroupExercisePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroups'] });
    },
  });
}

export function useDeleteExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteExercise(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['exercisePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroupExercises'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroupExercisePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroups'] });
    },
  });
}

// Blog Post Queries
export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBlogPostPreviews() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPostPreview[]>({
    queryKey: ['blogPostPreviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPostPreviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blogPost', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBlogPost(id);
    },
    enabled: !!actor && !isFetching,
  });
}

// Blog Post Mutations
export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: {
      title: string;
      content: string;
      author: string;
      memberOnly: boolean;
      seoTitle: string;
      seoMetaDescription: string;
      seoKeywords: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBlogPost(
        post.title,
        post.content,
        post.author,
        post.memberOnly,
        post.seoTitle,
        post.seoMetaDescription,
        post.seoKeywords
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostPreviews'] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: {
      id: bigint;
      title: string;
      content: string;
      author: string;
      memberOnly: boolean;
      seoTitle: string;
      seoMetaDescription: string;
      seoKeywords: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBlogPost(
        post.id,
        post.title,
        post.content,
        post.author,
        post.memberOnly,
        post.seoTitle,
        post.seoMetaDescription,
        post.seoKeywords
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostPreviews'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', variables.id.toString()] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBlogPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostPreviews'] });
    },
  });
}

export function usePublishBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishBlogPost(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostPreviews'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', id.toString()] });
    },
  });
}

export function useUnpublishBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unpublishBlogPost(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostPreviews'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', id.toString()] });
    },
  });
}

// Amazon Product Queries
export function useGetAllAmazonProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<AmazonProduct[]>({
    queryKey: ['amazonProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAmazonProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

// Amazon Product Mutations
export function useAddAmazonProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: {
      name: string;
      description: string;
      imageUrl: string;
      category: string;
      affiliateLink: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAmazonProduct(
        product.name,
        product.description,
        product.imageUrl,
        product.category,
        product.affiliateLink
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amazonProducts'] });
    },
  });
}

export function useUpdateAmazonProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: {
      id: bigint;
      name: string;
      description: string;
      imageUrl: string;
      category: string;
      affiliateLink: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAmazonProduct(
        product.id,
        product.name,
        product.description,
        product.imageUrl,
        product.category,
        product.affiliateLink
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amazonProducts'] });
    },
  });
}

export function useDeleteAmazonProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAmazonProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amazonProducts'] });
    },
  });
}

// Membership Queries
export function useGetMembership() {
  const { actor, isFetching } = useActor();

  return useQuery<Membership | null>({
    queryKey: ['membership'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMembership();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useHasActiveMembership() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasActiveMembership'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasActiveMembership();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllMemberships() {
  const { actor, isFetching } = useActor();

  return useQuery<Membership[]>({
    queryKey: ['allMemberships'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMemberships();
    },
    enabled: !!actor && !isFetching,
  });
}

// Membership Mutations
export function useAddMembershipForUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, stripeId }: { user: Principal; stripeId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMembershipForUser(user, stripeId, BigInt(2499));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership'] });
      queryClient.invalidateQueries({ queryKey: ['hasActiveMembership'] });
      queryClient.invalidateQueries({ queryKey: ['allMemberships'] });
    },
  });
}

export function useUpdateMembershipStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, active }: { user: Principal; active: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMembershipStatus(user, active);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership'] });
      queryClient.invalidateQueries({ queryKey: ['hasActiveMembership'] });
      queryClient.invalidateQueries({ queryKey: ['allMemberships'] });
    },
  });
}

// Muscle Group Queries
export function useGetMuscleGroups() {
  const { actor, isFetching } = useActor();

  return useQuery<MuscleGroupDetails[]>({
    queryKey: ['muscleGroups'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMuscleGroups();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMuscleGroupCards() {
  const { actor, isFetching } = useActor();

  return useQuery<MuscleGroupCard[]>({
    queryKey: ['muscleGroupCards'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMuscleGroupArtists();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMuscleGroupArtist(name: string) {
  const { actor, isFetching } = useActor();

  return useQuery<MuscleGroupCard | null>({
    queryKey: ['muscleGroupArtist', name],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMuscleGroupArtist(name);
    },
    enabled: !!actor && !isFetching && !!name,
  });
}

// Muscle Group Mutations
export function useUpdateMuscleGroup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (muscleGroup: { name: string; description: string; imageUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMuscleGroup(muscleGroup.name, muscleGroup.description, muscleGroup.imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['muscleGroups'] });
    },
  });
}

export function useUpdateMuscleGroupCard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, card }: { name: string; card: MuscleGroupCard }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMuscleGroupArtist(name, card);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['muscleGroupCards'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroupArtist', variables.name] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroups'] });
    },
  });
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// User Profile Mutations
export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Queries
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Canister ID Query
export function useGetCanisterId() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['canisterId'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Extract canister ID from the hostname
      const hostname = window.location.hostname;
      // Pattern: <canister-id>.icp0.io or <canister-id>.ic0.app
      const match = hostname.match(/^([a-z0-9-]+)\.(icp0\.io|ic0\.app)$/);
      if (match) {
        return match[1];
      }
      // Fallback: try to get from actor's canister ID if available
      // @ts-ignore - accessing internal property
      const canisterId = actor._canisterId?.toString() || actor.canisterId?.toString();
      if (canisterId) {
        return canisterId;
      }
      throw new Error('Unable to determine canister ID');
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

// Stripe Queries
export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isStripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStripeSessionStatus(sessionId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<StripeSessionStatus | null>({
    queryKey: ['stripeSessionStatus', sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}

// Stripe Mutations
export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isStripeConfigured'] });
    },
  });
}

export type CheckoutSession = {
  id: string;
  url: string;
};

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error('Actor not available');
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      return session;
    },
  });
}

// Affiliate Disclosure Query
export function useGetAffiliateDisclosure() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['affiliateDisclosure'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getAffiliateDisclosure();
    },
    enabled: !!actor && !isFetching,
  });
}
