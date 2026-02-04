import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { MuscleGroup, MusicPreference, EquipmentType, DifficultyLevel, type Exercise, type Routine, type UserProfile, type BlogPost, type BreathworkPractice } from '@/backend';
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

// Breathwork Queries
export function useGetAllBreathworkPractices() {
  const { actor, isFetching } = useActor();

  return useQuery<BreathworkPractice[]>({
    queryKey: ['breathworkPractices'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBreathworkPractices();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

// Routine Queries
export function useGetRoutine(userId: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Routine | null>({
    queryKey: ['routine', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      try {
        return await actor.getRoutine(userId);
      } catch (error) {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

// Routine Mutations
export function useCreateRoutine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createRoutine();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routine'] });
    },
  });
}

export function useAddToRoutine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ exerciseId, isBreathwork }: { exerciseId: bigint; isBreathwork: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addToRoutine(exerciseId, isBreathwork);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routine'] });
    },
  });
}

export function useRemoveFromRoutine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ exerciseId, isBreathwork }: { exerciseId: bigint; isBreathwork: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.removeFromRoutine(exerciseId, isBreathwork);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routine'] });
    },
  });
}

export function useDeleteRoutine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteRoutine();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routine'] });
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

export function useUpdateMusicPreference() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preference: MusicPreference) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateMusicPreference(preference);
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

// Admin Exercise Mutations
export function useAddExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      muscleGroup: MuscleGroup;
      equipmentType: EquipmentType;
      difficulty: DifficultyLevel;
      instructions: string;
      mediaUrl: string;
      imageUrl: string;
      benefits: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addExercise(
        params.name,
        params.muscleGroup,
        params.equipmentType,
        params.difficulty,
        params.instructions,
        params.mediaUrl,
        params.imageUrl,
        params.benefits
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

export function useEditExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      name: string;
      muscleGroup: MuscleGroup;
      equipmentType: EquipmentType;
      difficulty: DifficultyLevel;
      instructions: string;
      mediaUrl: string;
      imageUrl: string;
      benefits: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.editExercise(
        params.id,
        params.name,
        params.muscleGroup,
        params.equipmentType,
        params.difficulty,
        params.instructions,
        params.mediaUrl,
        params.imageUrl,
        params.benefits
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
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
    },
  });
}

// Admin Breathwork Mutations
export function useAddBreathworkPractice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      techniqueDescription: string;
      mediaUrl: string;
      recommendedExerciseIds: bigint[];
      mindfulnessBenefits: string;
      duration: bigint;
      difficulty: DifficultyLevel;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addBreathworkPractice(
        params.name,
        params.techniqueDescription,
        params.mediaUrl,
        params.recommendedExerciseIds,
        params.mindfulnessBenefits,
        params.duration,
        params.difficulty
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breathworkPractices'] });
    },
  });
}

export function useEditBreathworkPractice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      name: string;
      techniqueDescription: string;
      mediaUrl: string;
      recommendedExerciseIds: bigint[];
      mindfulnessBenefits: string;
      duration: bigint;
      difficulty: DifficultyLevel;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.editBreathworkPractice(
        params.id,
        params.name,
        params.techniqueDescription,
        params.mediaUrl,
        params.recommendedExerciseIds,
        params.mindfulnessBenefits,
        params.duration,
        params.difficulty
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breathworkPractices'] });
    },
  });
}

export function useDeleteBreathworkPractice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (breathworkPracticeId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteBreathworkPractice(breathworkPracticeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breathworkPractices'] });
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
      seoTitle: string;
      seoMetaDescription: string;
      seoKeywords: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createBlogPost(
        params.title,
        params.content,
        params.author,
        params.seoTitle,
        params.seoMetaDescription,
        params.seoKeywords
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

export function useEditBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      title: string;
      content: string;
      author: string;
      seoTitle: string;
      seoMetaDescription: string;
      seoKeywords: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.editBlogPost(
        params.id,
        params.title,
        params.content,
        params.author,
        params.seoTitle,
        params.seoMetaDescription,
        params.seoKeywords
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost'] });
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
      queryClient.invalidateQueries({ queryKey: ['blogPost'] });
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
      queryClient.invalidateQueries({ queryKey: ['blogPost'] });
    },
  });
}
