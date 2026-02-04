import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type MuscleGroup = {
    #chest;
    #back;
    #legs;
    #shoulders;
    #arms;
    #core;
  };

  type EquipmentType = {
    #barbell;
    #dumbbell;
    #cable;
    #machine;
    #bodyweight;
    #bands;
  };

  type DifficultyLevel = {
    #beginner;
    #intermediate;
    #advanced;
  };

  public type Exercise = {
    id : Nat;
    name : Text;
    muscleGroup : MuscleGroup;
    equipmentType : EquipmentType;
    difficultyLevel : DifficultyLevel;
    instructions : Text;
    mediaUrl : Text;
    imageUrl : Text;
    benefits : Text;
  };

  public type BreathworkPractice = {
    id : Nat;
    name : Text;
    techniqueDescription : Text;
    mediaUrl : Text;
    recommendedExerciseIds : [Nat];
    mindfulnessBenefits : Text;
    duration : Nat;
    difficultyLevel : DifficultyLevel;
  };

  type Routine = {
    userId : Principal;
    exerciseIds : [Nat];
    breathworkPracticeIds : [Nat];
  };

  public type UserProfile = {
    name : Text;
    musicPreference : MusicPreference;
  };

  public type MusicPreference = {
    #on;
    #off;
  };

  public type MuscleGroupDetails = {
    name : Text;
    description : Text;
    imageUrl : Text;
    exerciseIds : [Nat];
  };

  public type BlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    createdAt : Time.Time;
    modifiedAt : Time.Time;
    published : Bool;
    seoTitle : Text;
    seoMetaDescription : Text;
    seoKeywords : [Text];
  };

  let exerciseStore = Map.empty<Nat, Exercise>();
  let breathworkPracticeStore = Map.empty<Nat, BreathworkPractice>();
  let routineStore = Map.empty<Principal, Routine>();
  let userProfileStore = Map.empty<Principal, UserProfile>();
  let muscleGroupStore = Map.empty<Text, MuscleGroupDetails>();
  let blogPostStore = Map.empty<Nat, BlogPost>();

  var nextExerciseId = 1;
  var nextBreathworkPracticeId = 1;
  var nextBlogPostId = 1;

  system func preupgrade() {
    if (muscleGroupStore.isEmpty()) {
      let initialMuscleGroups = [
        {
          name = "Chest";
          description = "Exercises targeting the pectoral muscles";
          imageUrl = "https://granada-images.s3.eu-central-1.amazonaws.com/11221F74-38EF-44B9-BF04-854685D39C7C_1_105_c.jpeg";
          exerciseIds = [];
        },
        {
          name = "Back";
          description = "Exercises for the upper and lower back muscles";
          imageUrl = "https://granada-images.s3.eu-central-1.amazonaws.com/01C4E651-E164-4CF8-AB45-66DEB0353DF6_1_105_c.jpeg";
          exerciseIds = [];
        },
        {
          name = "Legs";
          description = "Leg exercises including quads, hamstrings, and calves";
          imageUrl = "https://granada-images.s3.eu-central-1.amazonaws.com/24935045-CBB9-481B-A0B1-5BFD8B0262BE_1_105_c.jpeg";
          exerciseIds = [];
        },
        {
          name = "Shoulders";
          description = "Shoulder-focused resistance training";
          imageUrl = "https://granada-images.s3.eu-central-1.amazonaws.com/32E3BC67-EA56-47DC-A8A9-1565B2EEAFFF_1_105_c.jpeg";
          exerciseIds = [];
        },
        {
          name = "Arms";
          description = "Biceps, triceps, and forearm exercises";
          imageUrl = "https://granada-images.s3.eu-central-1.amazonaws.com/31ED900E-EC30-4607-9A24-E7C5CD13587D_1_105_c.jpeg";
          exerciseIds = [];
        },
        {
          name = "Core";
          description = "Core stability and abdominal training";
          imageUrl = "https://granada-images.s3.eu-central-1.amazonaws.com/97E5BD29-E1DA-4DA9-8EDA-45A6D41505ED_1_105_c.jpeg";
          exerciseIds = [];
        },
      ];

      for (group in initialMuscleGroups.values()) {
        muscleGroupStore.add(group.name, group);
      };
    };
  };

  public query ({ caller }) func getAllExercises() : async [Exercise] {
    exerciseStore.values().toArray();
  };

  public query ({ caller }) func getMuscleGroupExercises(muscleGroup : MuscleGroup) : async [Exercise] {
    exerciseStore.values().toArray().filter(
      func(exercise) {
        exercise.muscleGroup == muscleGroup;
      }
    );
  };

  public query ({ caller }) func getAllBreathworkPractices() : async [BreathworkPractice] {
    breathworkPracticeStore.values().toArray();
  };

  public query ({ caller }) func getRoutine(userId : Principal) : async ?Routine {
    switch (routineStore.get(userId)) {
      case (null) { null };
      case (?routine) {
        if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own routine");
        };
        ?routine;
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfileStore.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfileStore.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfileStore.add(caller, profile);
  };

  public shared ({ caller }) func createRoutine() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create routines");
    };

    if (routineStore.get(caller) != null) {
      Runtime.trap("Routine already exists for this principal");
    } else {
      let newRoutine = {
        userId = caller;
        exerciseIds = [];
        breathworkPracticeIds = [];
      };
      routineStore.add(caller, newRoutine);
    };
  };

  public shared ({ caller }) func addToRoutine(exerciseId : Nat, isBreathwork : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to routine");
    };

    switch (routineStore.get(caller)) {
      case (null) {
        let newRoutine = {
          userId = caller;
          exerciseIds = if (isBreathwork) { [] } else { [exerciseId] };
          breathworkPracticeIds = if (isBreathwork) { [exerciseId] } else { [] };
        };
        routineStore.add(caller, newRoutine);
      };
      case (?routine) {
        let alreadyExists = if (isBreathwork) {
          routine.breathworkPracticeIds.any(func(id) { id == exerciseId });
        } else {
          routine.exerciseIds.any(func(id) { id == exerciseId });
        };

        if (alreadyExists) {
          Runtime.trap("Item already in routine");
        };

        let updatedRoutine = {
          userId = caller;
          exerciseIds = if (isBreathwork) { routine.exerciseIds } else {
            routine.exerciseIds.concat([exerciseId]);
          };
          breathworkPracticeIds = if (isBreathwork) {
            routine.breathworkPracticeIds.concat([exerciseId]);
          } else {
            routine.breathworkPracticeIds;
          };
        };
        routineStore.add(caller, updatedRoutine);
      };
    };
  };

  public shared ({ caller }) func removeFromRoutine(exerciseId : Nat, isBreathwork : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from routine");
    };

    switch (routineStore.get(caller)) {
      case (null) {
        Runtime.trap("Routine does not exist for this principal");
      };
      case (?routine) {
        let updatedRoutine = {
          userId = caller;
          exerciseIds = if (isBreathwork) { routine.exerciseIds } else {
            let filtered = routine.exerciseIds.filter(
              func(id) { id != exerciseId }
            );
            filtered;
          };
          breathworkPracticeIds = if (isBreathwork) {
            let filtered = routine.breathworkPracticeIds.filter(
              func(id) { id != exerciseId }
            );
            filtered;
          } else {
            routine.breathworkPracticeIds;
          };
        };
        routineStore.add(caller, updatedRoutine);
      };
    };
  };

  public shared ({ caller }) func deleteRoutine() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete routines");
    };
    routineStore.remove(caller);
  };

  public shared ({ caller }) func updateMusicPreference(preference : MusicPreference) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update music preferences");
    };

    switch (userProfileStore.get(caller)) {
      case (null) {
        Runtime.trap("User profile not found");
      };
      case (?profile) {
        let updatedProfile = { profile with musicPreference = preference };
        userProfileStore.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getMuscleGroupDetails(muscleGroupName : Text) : async ?{
    muscleGroup : MuscleGroupDetails;
    exercises : [Exercise];
  } {
    switch (muscleGroupStore.get(muscleGroupName)) {
      case (null) {
        Runtime.trap("Muscle group not found: " # muscleGroupName);
      };
      case (?mg) {
        let mappedExercises = mg.exerciseIds.map(
          func(exerciseId) {
            switch (exerciseStore.get(exerciseId)) {
              case (null) { null };
              case (?exercise) { ?exercise };
            };
          }
        );

        let filteredExercises = mappedExercises.filter(
          func(exercise) {
            switch (exercise) {
              case (null) { false };
              case (?_) { true };
            };
          }
        );

        let flattenedExercises = filteredExercises.map(
          func(exercise) {
            switch (exercise) {
              case (null) { Runtime.trap("Should not get here") };
              case (?ex) { ex };
            };
          }
        );

        ?{
          muscleGroup = mg;
          exercises = flattenedExercises;
        };
      };
    };
  };

  public query ({ caller }) func getAllMuscleGroups() : async [MuscleGroupDetails] {
    muscleGroupStore.values().toArray();
  };

  public shared ({ caller }) func addExercise(
    name : Text,
    muscleGroup : MuscleGroup,
    equipmentType : EquipmentType,
    difficulty : DifficultyLevel,
    instructions : Text,
    mediaUrl : Text,
    imageUrl : Text,
    benefits : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add exercises");
    };

    let exercise = {
      id = nextExerciseId;
      name;
      muscleGroup;
      equipmentType;
      difficultyLevel = difficulty;
      instructions;
      mediaUrl;
      imageUrl;
      benefits;
    };

    exerciseStore.add(nextExerciseId, exercise);

    switch (getMuscleGroupName(muscleGroup)) {
      case (null) { Runtime.trap("Muscle group not found") };
      case (?mgName) {
        switch (muscleGroupStore.get(mgName)) {
          case (null) { Runtime.trap("Muscle group not found") };
          case (?mgDetails) {
            let updatedExercises = mgDetails.exerciseIds.concat([nextExerciseId]);
            let updatedMuscleGroup = { mgDetails with exerciseIds = updatedExercises };
            muscleGroupStore.add(mgName, updatedMuscleGroup);
          };
        };
      };
    };

    nextExerciseId += 1;
  };

  public shared ({ caller }) func addBreathworkPractice(
    name : Text,
    techniqueDescription : Text,
    mediaUrl : Text,
    recommendedExerciseIds : [Nat],
    mindfulnessBenefits : Text,
    duration : Nat,
    difficulty : DifficultyLevel,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add breathwork practices");
    };

    let breathworkPractice = {
      id = nextBreathworkPracticeId;
      name;
      techniqueDescription;
      mediaUrl;
      recommendedExerciseIds;
      mindfulnessBenefits;
      duration;
      difficultyLevel = difficulty;
    };

    breathworkPracticeStore.add(nextBreathworkPracticeId, breathworkPractice);
    nextBreathworkPracticeId += 1;
  };

  public shared ({ caller }) func editExercise(
    id : Nat,
    name : Text,
    muscleGroup : MuscleGroup,
    equipmentType : EquipmentType,
    difficulty : DifficultyLevel,
    instructions : Text,
    mediaUrl : Text,
    imageUrl : Text,
    benefits : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit exercises");
    };

    let currentExercise = switch (exerciseStore.get(id)) {
      case (null) { Runtime.trap("Exercise not found") };
      case (?exercise) { exercise };
    };

    let updatedExercise = {
      id;
      name;
      muscleGroup;
      equipmentType;
      difficultyLevel = difficulty;
      instructions;
      mediaUrl;
      imageUrl;
      benefits;
    };

    exerciseStore.add(id, updatedExercise);

    switch (getMuscleGroupName(currentExercise.muscleGroup)) {
      case (null) { Runtime.trap("Old muscle group not found") };
      case (?oldMg) {
        switch (muscleGroupStore.get(oldMg)) {
          case (null) { Runtime.trap("Old muscle group not found") };
          case (?mgDetails) {
            let filteredExercises = mgDetails.exerciseIds.filter(
              func(exerciseId) { exerciseId != id }
            );
            let updatedOldMg = { mgDetails with exerciseIds = filteredExercises };
            muscleGroupStore.add(oldMg, updatedOldMg);
          };
        };
      };
    };

    switch (getMuscleGroupName(muscleGroup)) {
      case (null) { Runtime.trap("New muscle group not found") };
      case (?newMg) {
        switch (muscleGroupStore.get(newMg)) {
          case (null) { Runtime.trap("New muscle group not found") };
          case (?mgDetails) {
            let updatedExercises = mgDetails.exerciseIds.concat([id]);
            let updatedMuscleGroup = { mgDetails with exerciseIds = updatedExercises };
            muscleGroupStore.add(newMg, updatedMuscleGroup);
          };
        };
      };
    };
  };

  public shared ({ caller }) func editBreathworkPractice(
    id : Nat,
    name : Text,
    techniqueDescription : Text,
    mediaUrl : Text,
    recommendedExerciseIds : [Nat],
    mindfulnessBenefits : Text,
    duration : Nat,
    difficulty : DifficultyLevel,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit breathwork practices");
    };

    switch (breathworkPracticeStore.get(id)) {
      case (null) { Runtime.trap("Breathwork practice not found") };
      case (?_) {
        let updatedPractice = {
          id;
          name;
          techniqueDescription;
          mediaUrl;
          recommendedExerciseIds;
          mindfulnessBenefits;
          duration;
          difficultyLevel = difficulty;
        };
        breathworkPracticeStore.add(id, updatedPractice);
      };
    };
  };

  public shared ({ caller }) func deleteExercise(exerciseId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete exercises");
    };

    switch (exerciseStore.get(exerciseId)) {
      case (null) { Runtime.trap("Exercise not found") };
      case (?exercise) {
        switch (getMuscleGroupName(exercise.muscleGroup)) {
          case (null) { Runtime.trap("Muscle group not found") };
          case (?mgName) {
            switch (muscleGroupStore.get(mgName)) {
              case (null) { Runtime.trap("Muscle group not found") };
              case (?mgDetails) {
                let filteredExercises = mgDetails.exerciseIds.filter(
                  func(id) { id != exerciseId }
                );
                let updatedMuscleGroup = { mgDetails with exerciseIds = filteredExercises };
                muscleGroupStore.add(mgName, updatedMuscleGroup);
              };
            };
          };
        };
        exerciseStore.remove(exerciseId);
      };
    };
  };

  public shared ({ caller }) func deleteBreathworkPractice(breathworkPracticeId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete breathwork practices");
    };

    switch (breathworkPracticeStore.get(breathworkPracticeId)) {
      case (null) { Runtime.trap("Breathwork practice not found") };
      case (?_) {
        breathworkPracticeStore.remove(breathworkPracticeId);
      };
    };
  };

  public shared ({ caller }) func addMuscleGroup(
    name : Text,
    description : Text,
    imageUrl : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add muscle groups");
    };

    let mgDetails = {
      name;
      description;
      imageUrl;
      exerciseIds = [];
    };

    muscleGroupStore.add(name, mgDetails);
  };

  public shared ({ caller }) func editMuscleGroup(
    name : Text,
    description : Text,
    imageUrl : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit muscle groups");
    };

    switch (muscleGroupStore.get(name)) {
      case (null) { Runtime.trap("Muscle group not found") };
      case (?mgDetails) {
        let updatedMg = { mgDetails with
          description;
          imageUrl;
        };
        muscleGroupStore.add(name, updatedMg);
      };
    };
  };

  public shared ({ caller }) func deleteMuscleGroup(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete muscle groups");
    };

    let associatedExercises = switch (muscleGroupStore.get(name)) {
      case (null) { [] };
      case (?mg) { mg.exerciseIds };
    };

    for (id in associatedExercises.values()) {
      exerciseStore.remove(id);
      for ((mgName, mg) in muscleGroupStore.entries()) {
        let filteredExercises = mg.exerciseIds.filter(
          func(exId) { exId != id }
        );
        let updatedMg = { mg with exerciseIds = filteredExercises };
        muscleGroupStore.add(mgName, updatedMg);
      };
    };

    muscleGroupStore.remove(name);
  };

  /* --- BLOG MANAGEMENT --- */
  public shared ({ caller }) func createBlogPost(
    title : Text,
    content : Text,
    author : Text,
    seoTitle : Text,
    seoMetaDescription : Text,
    seoKeywords : [Text],
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };

    let now = Time.now();
    let blogPost = {
      id = nextBlogPostId;
      title;
      content;
      author;
      createdAt = now;
      modifiedAt = now;
      published = false;
      seoTitle;
      seoMetaDescription;
      seoKeywords;
    };

    blogPostStore.add(nextBlogPostId, blogPost);
    nextBlogPostId += 1;
    blogPost.id;
  };

  public shared ({ caller }) func editBlogPost(
    id : Nat,
    title : Text,
    content : Text,
    author : Text,
    seoTitle : Text,
    seoMetaDescription : Text,
    seoKeywords : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit blog posts");
    };

    switch (blogPostStore.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?post) {
        let updatedPost = { post with
          title;
          content;
          author;
          seoTitle;
          seoMetaDescription;
          seoKeywords;
          modifiedAt = Time.now();
        };
        blogPostStore.add(id, updatedPost);
      };
    };
  };

  public shared ({ caller }) func deleteBlogPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };

    switch (blogPostStore.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?post) {
        blogPostStore.remove(id);
      };
    };
  };

  public shared ({ caller }) func publishBlogPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish blog posts");
    };

    switch (blogPostStore.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?post) {
        let updatedPost = { post with published = true };
        blogPostStore.add(id, updatedPost);
      };
    };
  };

  public shared ({ caller }) func unpublishBlogPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can unpublish blog posts");
    };

    switch (blogPostStore.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?post) {
        let updatedPost = { post with published = false };
        blogPostStore.add(id, updatedPost);
      };
    };
  };

  public query ({ caller }) func getBlogPost(id : Nat) : async ?BlogPost {
    switch (blogPostStore.get(id)) {
      case (null) { null };
      case (?post) {
        if (not post.published and not AccessControl.isAdmin(accessControlState, caller)) {
          null;
        } else {
          ?post;
        };
      };
    };
  };

  public query ({ caller }) func getAllBlogPosts() : async [BlogPost] {
    let allPosts = blogPostStore.values().toArray();
    if (AccessControl.isAdmin(accessControlState, caller)) {
      allPosts;
    } else {
      allPosts.filter(func(post) { post.published });
    };
  };

  private func getMuscleGroupName(mg : MuscleGroup) : ?Text {
    switch (mg) {
      case (#chest) { ?"Chest" };
      case (#back) { ?"Back" };
      case (#legs) { ?"Legs" };
      case (#shoulders) { ?"Shoulders" };
      case (#arms) { ?"Arms" };
      case (#core) { ?"Core" };
    };
  };

  private func getMuscleGroupEnum(groupName : Text) : ?MuscleGroup {
    if (groupName == "Chest") {
      ?#chest;
    } else if (groupName == "Back") {
      ?#back;
    } else if (groupName == "Legs") {
      ?#legs;
    } else if (groupName == "Shoulders") {
      ?#shoulders;
    } else if (groupName == "Arms") {
      ?#arms;
    } else if (groupName == "Core") {
      ?#core;
    } else {
      Runtime.trap("Invalid muscle group name: " # groupName);
    };
  };
};
