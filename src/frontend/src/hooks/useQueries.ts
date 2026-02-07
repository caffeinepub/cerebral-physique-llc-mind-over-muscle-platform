import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { MuscleGroup, EquipmentType, type Exercise, type UserProfile, type BlogPost, type AmazonProduct, type Membership, type ShoppingItem, type MuscleGroupCard, type MuscleGroupDetails } from '@/backend';
import type { Principal } from '@icp-sdk/core/principal';

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
    staleTime: 30000,
  });
}

export function useGetAllExercisePreviews() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['exercisePreviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExercisePreviews();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useGetMuscleGroupExercises(muscleGroup: MuscleGroup) {
  const { actor, isFetching } = useActor();

  return useQuery<Exercise[]>({
    queryKey: ['exercises', muscleGroup],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMuscleGroupExercises(muscleGroup);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useGetMuscleGroupExercisePreviews(muscleGroup: MuscleGroup) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['exercisePreviews', muscleGroup],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMuscleGroupExercisePreviews(muscleGroup);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
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
    staleTime: 30000,
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
    staleTime: 30000,
  });
}

export function useGetMuscleGroupCard(name: string) {
  const { actor, isFetching } = useActor();

  return useQuery<MuscleGroupCard | null>({
    queryKey: ['muscleGroupCard', name],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMuscleGroupArtist(name);
    },
    enabled: !!actor && !isFetching && !!name,
    staleTime: 30000,
  });
}

export function useUpdateMuscleGroupCard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; card: MuscleGroupCard }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateMuscleGroupArtist(params.name, params.card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['muscleGroupCards'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroupCard'] });
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

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin/Authorization Queries
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000,
  });
}

// Blog Queries
export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useGetAllBlogPostPreviews() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['blogPostPreviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPostPreviews();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useGetBlogPost(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blogPost', id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getBlogPost(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useGetBlogPostPreview(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['blogPostPreview', id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getBlogPostPreview(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

// Admin Exercise Mutations
export function useAddExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      primaryMuscle: MuscleGroup;
      secondaryMuscles: MuscleGroup[];
      equipmentType: EquipmentType;
      videoUrl: string;
      cues: string;
      imageUrl: string;
      isPlaceholder: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addExercise(
        params.name,
        params.primaryMuscle,
        params.secondaryMuscles,
        params.equipmentType,
        params.videoUrl,
        params.cues,
        params.imageUrl,
        params.isPlaceholder
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['exercisePreviews'] });
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
      primaryMuscle: MuscleGroup;
      secondaryMuscles: MuscleGroup[];
      equipmentType: EquipmentType;
      videoUrl: string;
      cues: string;
      imageUrl: string;
      isPlaceholder: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateExercise(
        params.id,
        params.name,
        params.primaryMuscle,
        params.secondaryMuscles,
        params.equipmentType,
        params.videoUrl,
        params.cues,
        params.imageUrl,
        params.isPlaceholder
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['exercisePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroups'] });
    },
  });
}

export function useDeleteExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exerciseId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteExercise(exerciseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['exercisePreviews'] });
      queryClient.invalidateQueries({ queryKey: ['muscleGroups'] });
    },
  });
}

// Admin Blog Mutations
export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      content: string;
      author: string;
      memberOnly: boolean;
      seoTitle: string;
      seoMetaDescription: string;
      seoKeywords: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createBlogPost(
        params.title,
        params.content,
        params.author,
        params.memberOnly,
        params.seoTitle,
        params.seoMetaDescription,
        params.seoKeywords
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
    mutationFn: async (params: {
      id: bigint;
      title: string;
      content: string;
      author: string;
      memberOnly: boolean;
      seoTitle: string;
      seoMetaDescription: string;
      seoKeywords: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateBlogPost(
        params.id,
        params.title,
        params.content,
        params.author,
        params.memberOnly,
        params.seoTitle,
        params.seoMetaDescription,
        params.seoKeywords
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostPreviews'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostPreview'] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
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
      if (!actor) throw new Error('Actor not initialized');
      return actor.publishBlogPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostPreviews'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostPreview'] });
    },
  });
}

export function useUnpublishBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.unpublishBlogPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostPreviews'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostPreview'] });
    },
  });
}

// Amazon Affiliate Product Queries
export function useGetAllAmazonProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<AmazonProduct[]>({
    queryKey: ['amazonProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAmazonProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
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
      if (!actor) throw new Error('Actor not initialized');
      return actor.addAmazonProduct(
        params.name,
        params.description,
        params.imageUrl,
        params.category,
        params.affiliateLink
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
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateAmazonProduct(
        params.id,
        params.name,
        params.description,
        params.imageUrl,
        params.category,
        params.affiliateLink
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
      if (!actor) throw new Error('Actor not initialized');
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
      try {
        return await actor.getMembership();
      } catch (error) {
        return null;
      }
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
      try {
        return await actor.hasActiveMembership();
      } catch (error) {
        return false;
      }
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

export function useUpdateMembershipStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { user: Principal; active: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateMembershipStatus(params.user, params.active);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership'] });
      queryClient.invalidateQueries({ queryKey: ['allMemberships'] });
      queryClient.invalidateQueries({ queryKey: ['hasActiveMembership'] });
    },
  });
}

// Stripe/Payment Queries
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

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: { items: ShoppingItem[]; successUrl: string; cancelUrl: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createCheckoutSession(params.items, params.successUrl, params.cancelUrl);
    },
  });
}

export function useGetStripeSessionStatus(sessionId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['stripeSessionStatus', sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}

// Affiliate Disclosure
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

// Privacy Policy
export function useGetPrivacyPolicy() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['privacyPolicy'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getPrivacyPolicy();
    },
    enabled: !!actor && !isFetching,
  });
}
