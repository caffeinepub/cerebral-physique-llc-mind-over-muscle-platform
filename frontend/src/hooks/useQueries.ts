import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Exercise,
  ExercisePreview,
  ExerciseMedia,
  MuscleGroup,
  EquipmentType,
  BlogPost,
  BlogPostPreview,
  BlogMedia,
  NutritionArticle,
  NutritionArticlePreview,
  AmazonProduct,
  Membership,
  MuscleGroupDetails,
  MuscleGroupCard,
  UserProfile,
  ShoppingItem,
  StripeConfiguration,
  MiscConfig,
} from '../backend';

// ── Admin Check ───────────────────────────────────────────────────────────────

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

// ── User Profile ──────────────────────────────────────────────────────────────

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

// ── Exercises ─────────────────────────────────────────────────────────────────

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

export function useGetExercise(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Exercise | null>({
    queryKey: ['exercise', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getExercise(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetExercisesByMuscleGroup(muscleGroup: MuscleGroup) {
  const { actor, isFetching } = useActor();
  return useQuery<Exercise[]>({
    queryKey: ['exercisesByMuscleGroup', muscleGroup],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExercisesByMuscleGroup(muscleGroup);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllExercisesAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<Exercise[]>({
    queryKey: ['allExercisesAdmin'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExercisesAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      description: string;
      primaryMuscle: MuscleGroup;
      secondaryMuscles: MuscleGroup[];
      equipmentType: EquipmentType;
      videoUrl: string;
      cues: string;
      media: ExerciseMedia;
      isPlaceholder: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addExercise(
        params.name,
        params.description,
        params.primaryMuscle,
        params.secondaryMuscles,
        params.equipmentType,
        params.videoUrl,
        params.cues,
        params.media,
        params.isPlaceholder,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercisePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['allExercisesAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroups'] });
    },
  });
}

export function useUpdateExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      name: string;
      description: string;
      primaryMuscle: MuscleGroup;
      secondaryMuscles: MuscleGroup[];
      equipmentType: EquipmentType;
      videoUrl: string;
      cues: string;
      media: ExerciseMedia;
      isPlaceholder: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateExercise(
        params.id,
        params.name,
        params.description,
        params.primaryMuscle,
        params.secondaryMuscles,
        params.equipmentType,
        params.videoUrl,
        params.cues,
        params.media,
        params.isPlaceholder,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercisePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['allExercisesAdmin'] });
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
      queryClient.invalidateQueries({ queryKey: ['exercisePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['allExercisesAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroups'] });
    },
  });
}

// ── Muscle Groups ─────────────────────────────────────────────────────────────

export function useGetAllMuscleGroups() {
  const { actor, isFetching } = useActor();
  return useQuery<MuscleGroupDetails[]>({
    queryKey: ['muscleGroups'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMuscleGroups();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMuscleGroupDetails(name: string) {
  const { actor, isFetching } = useActor();
  return useQuery<MuscleGroupDetails | null>({
    queryKey: ['muscleGroupDetails', name],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMuscleGroupDetails(name);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateMuscleGroupCard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; card: MuscleGroupCard }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMuscleGroupCard(params.name, params.card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['muscleGroups'] });
    },
  });
}

// ── Blog Posts ────────────────────────────────────────────────────────────────

export function useGetPublishedBlogPostPreviews() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPostPreview[]>({
    queryKey: ['publishedBlogPostPreviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedBlogPostPreviews();
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

export function useGetAllBlogPostsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ['allBlogPostsAdmin'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPostsAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      content: string;
      author: string;
      memberOnly: boolean;
      media: BlogMedia;
      seoTitle: string;
      seoMetaDescription: string;
      seoKeywords: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBlogPost(
        params.title,
        params.content,
        params.author,
        params.memberOnly,
        params.media,
        params.seoTitle,
        params.seoMetaDescription,
        params.seoKeywords,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPostPreviews'] });
      queryClient.invalidateQueries({ queryKey: ['allBlogPostsAdmin'] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      title: string;
      content: string;
      author: string;
      memberOnly: boolean;
      media: BlogMedia;
      seoTitle: string;
      seoMetaDescription: string;
      seoKeywords: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBlogPost(
        params.id,
        params.title,
        params.content,
        params.author,
        params.memberOnly,
        params.media,
        params.seoTitle,
        params.seoMetaDescription,
        params.seoKeywords,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPostPreviews'] });
      queryClient.invalidateQueries({ queryKey: ['allBlogPostsAdmin'] });
    },
  });
}

export function usePublishBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; published: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishBlogPost(params.id, params.published);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPostPreviews'] });
      queryClient.invalidateQueries({ queryKey: ['allBlogPostsAdmin'] });
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
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPostPreviews'] });
      queryClient.invalidateQueries({ queryKey: ['allBlogPostsAdmin'] });
    },
  });
}

// ── Nutrition Articles ────────────────────────────────────────────────────────

export function useGetPublishedNutritionArticlePreviews() {
  const { actor, isFetching } = useActor();
  return useQuery<NutritionArticlePreview[]>({
    queryKey: ['publishedNutritionArticlePreviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedNutritionArticlePreviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNutritionArticle(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<NutritionArticle | null>({
    queryKey: ['nutritionArticle', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNutritionArticle(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllNutritionArticlesAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<NutritionArticle[]>({
    queryKey: ['allNutritionArticlesAdmin'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNutritionArticlesAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateNutritionArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      content: string;
      author: string;
      media: BlogMedia;
      memberOnly: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNutritionArticle(
        params.title,
        params.content,
        params.author,
        params.media,
        params.memberOnly,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishedNutritionArticlePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['allNutritionArticlesAdmin'] });
    },
  });
}

export function useUpdateNutritionArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      title: string;
      content: string;
      author: string;
      media: BlogMedia;
      memberOnly: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateNutritionArticle(
        params.id,
        params.title,
        params.content,
        params.author,
        params.media,
        params.memberOnly,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishedNutritionArticlePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['allNutritionArticlesAdmin'] });
    },
  });
}

export function usePublishNutritionArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; published: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishNutritionArticle(params.id, params.published);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishedNutritionArticlePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['allNutritionArticlesAdmin'] });
    },
  });
}

export function useDeleteNutritionArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNutritionArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishedNutritionArticlePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['allNutritionArticlesAdmin'] });
    },
  });
}

// ── Amazon Products ───────────────────────────────────────────────────────────

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

export function useAddAmazonProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      description: string;
      imageUrl: string;
      category: string;
      affiliateLink: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAmazonProduct(
        params.name,
        params.description,
        params.imageUrl,
        params.category,
        params.affiliateLink,
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
    mutationFn: async (params: {
      id: bigint;
      name: string;
      description: string;
      imageUrl: string;
      category: string;
      affiliateLink: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAmazonProduct(
        params.id,
        params.name,
        params.description,
        params.imageUrl,
        params.category,
        params.affiliateLink,
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

// ── Membership ────────────────────────────────────────────────────────────────

export function useGetMyMembership() {
  const { actor, isFetching } = useActor();
  return useQuery<Membership | null>({
    queryKey: ['myMembership'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getMyMembership();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetMembership() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      user: import('@dfinity/principal').Principal;
      active: boolean;
      stripeId: string;
      price: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setMembership(params.user, params.active, params.stripeId, params.price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myMembership'] });
    },
  });
}

// ── Stripe ────────────────────────────────────────────────────────────────────

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

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: { items: ShoppingItem[]; successUrl: string; cancelUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.createCheckoutSession(
        params.items,
        params.successUrl,
        params.cancelUrl,
      );
      const session = JSON.parse(result) as { id: string; url: string };
      if (!session?.url) throw new Error('Stripe session missing url');
      return session;
    },
  });
}

export function useGetStripeSessionStatus(sessionId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['stripeSessionStatus', sessionId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}

// ── Misc Config ───────────────────────────────────────────────────────────────

export function useGetMiscConfig() {
  const { actor, isFetching } = useActor();
  return useQuery<MiscConfig | null>({
    queryKey: ['miscConfig'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMiscConfig();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetMiscConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: MiscConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setMiscConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['miscConfig'] });
    },
  });
}

// ── Canister ID ───────────────────────────────────────────────────────────────

export function useGetCanisterId() {
  return useQuery<string>({
    queryKey: ['canisterId'],
    queryFn: async () => {
      const hostname = window.location.hostname;
      const match = hostname.match(/^([a-z0-9-]+)\.icp0\.io$/);
      if (match) return match[1];
      const localMatch = hostname.match(/^([a-z0-9-]+)\.localhost$/);
      if (localMatch) return localMatch[1];
      return 'unknown-canister-id';
    },
  });
}

// ── Affiliate Disclosure ──────────────────────────────────────────────────────

export function useGetAffiliateDisclosure() {
  return useQuery<string>({
    queryKey: ['affiliateDisclosure'],
    queryFn: async () => {
      return 'This page contains affiliate links. As an Amazon Associate, we earn from qualifying purchases at no additional cost to you.';
    },
  });
}
