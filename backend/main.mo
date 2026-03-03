import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Storage "blob-storage/Storage";
import Migration "migration";

// Data migration on upgrade
(with migration = Migration.run)
actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type MuscleGroup = {
    #chest;
    #back;
    #shoulders;
    #biceps;
    #triceps;
    #quads;
    #hamstrings;
    #glutes;
    #calves;
    #core;
  };

  type EquipmentType = {
    #machine;
    #dumbbell;
    #cable;
    #bodyweight;
  };

  public type ExerciseMedia = {
    imageUrls : [Text];
    videoUrls : [Text];
  };

  public type Exercise = {
    id : Nat;
    name : Text;
    description : Text;
    primaryMuscle : MuscleGroup;
    secondaryMuscles : [MuscleGroup];
    equipmentType : EquipmentType;
    videoUrl : Text;
    cues : Text;
    media : ExerciseMedia;
    isPlaceholder : Bool;
  };

  public type ExercisePreview = {
    id : Nat;
    name : Text;
    primaryMuscle : MuscleGroup;
    imageUrl : Text;
  };

  public type BlogMedia = {
    imageUrls : [Text];
    videoUrls : [Text];
  };

  public type BlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    createdAt : Time.Time;
    modifiedAt : Time.Time;
    published : Bool;
    memberOnly : Bool;
    media : BlogMedia;
    seoTitle : Text;
    seoMetaDescription : Text;
    seoKeywords : [Text];
  };

  public type BlogPostPreview = {
    id : Nat;
    title : Text;
    author : Text;
    createdAt : Time.Time;
    memberOnly : Bool;
    seoTitle : Text;
    seoMetaDescription : Text;
  };

  public type NutritionArticle = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    createdAt : Time.Time;
    media : BlogMedia;
    published : Bool;
    memberOnly : Bool;
  };

  public type NutritionArticlePreview = {
    id : Nat;
    title : Text;
    author : Text;
    createdAt : Time.Time;
    memberOnly : Bool;
  };

  public type AmazonProduct = {
    id : Nat;
    name : Text;
    description : Text;
    imageUrl : Text;
    category : Text;
    affiliateLink : Text;
  };

  public type Membership = {
    principal : Principal;
    active : Bool;
    stripeId : Text;
    price : Nat; // Price in cents
  };

  public type MuscleGroupCard = {
    title : Text;
    description : Text;
    imageUrl : Text;
    heroImage : ?Storage.ExternalBlob;
  };

  public type MuscleGroupDetails = {
    name : Text;
    description : Text;
    imageUrl : Text;
    exerciseIds : [Nat];
    card : MuscleGroupCard;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    membershipStatus : ?Text;
  };

  public type StripeConfig = {
    secretKey : Text;
    allowedCountries : [Text];
  };

  public type MiscConfig = {
    adminContactEmail : Text;
    supportContactEmail : Text;
  };

  public type WorkoutRoutine = {
    name : Text;
    exercises : [Nat];
    principal : Principal;
  };

  let exercises = Map.empty<Nat, Exercise>();
  let blogPosts = Map.empty<Nat, BlogPost>();
  let nutritionArticles = Map.empty<Nat, NutritionArticle>();
  let amazonProducts = Map.empty<Nat, AmazonProduct>();
  let memberships = Map.empty<Principal, Membership>();
  let muscleGroups = Map.empty<Text, MuscleGroupDetails>();
  let muscleGroupCards = Map.empty<Text, MuscleGroupCard>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let workoutRoutines = Map.empty<Principal, [WorkoutRoutine]>();

  var nextExerciseId = 1;
  var nextBlogPostId = 1;
  var nextNutritionArticleId = 1;
  var nextAmazonProductId = 1;

  var stripeConfig : ?Stripe.StripeConfiguration = null;
  var miscConfig : ?MiscConfig = null;

  // ── User Profile ──────────────────────────────────────────────────────────
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Exercise CRUD ─────────────────────────────────────────────────────────
  public shared ({ caller }) func addExercise(
    name : Text,
    description : Text,
    primaryMuscle : MuscleGroup,
    secondaryMuscles : [MuscleGroup],
    equipmentType : EquipmentType,
    videoUrl : Text,
    cues : Text,
    media : ExerciseMedia,
    isPlaceholder : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add exercises");
    };

    let exercise : Exercise = {
      id = nextExerciseId;
      name;
      description;
      primaryMuscle;
      secondaryMuscles;
      equipmentType;
      videoUrl;
      cues;
      media;
      isPlaceholder;
    };

    exercises.add(nextExerciseId, exercise);

    switch (muscleGroups.get(muscleGroupToName(primaryMuscle))) {
      case (null) {
        let newMuscleGroup : MuscleGroupDetails = {
          name = muscleGroupToName(primaryMuscle);
          description = "";
          imageUrl = "";
          exerciseIds = [nextExerciseId];
          card = createDefaultMuscleGroupCard(primaryMuscle);
        };
        muscleGroups.add(muscleGroupToName(primaryMuscle), newMuscleGroup);
      };
      case (?mg) {
        let updatedExercises = mg.exerciseIds.concat([nextExerciseId]);
        let updatedMuscleGroup = { mg with exerciseIds = updatedExercises };
        muscleGroups.add(muscleGroupToName(primaryMuscle), updatedMuscleGroup);
      };
    };

    nextExerciseId += 1;
  };

  public shared ({ caller }) func updateExercise(
    id : Nat,
    name : Text,
    description : Text,
    primaryMuscle : MuscleGroup,
    secondaryMuscles : [MuscleGroup],
    equipmentType : EquipmentType,
    videoUrl : Text,
    cues : Text,
    media : ExerciseMedia,
    isPlaceholder : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update exercises");
    };

    let exercise = switch (exercises.get(id)) {
      case (null) { Runtime.trap("Could not find exercise with id=" # id.toText()) };
      case (?e) { e };
    };

    let updatedExercise = {
      id;
      name;
      description;
      primaryMuscle;
      secondaryMuscles;
      equipmentType;
      videoUrl;
      cues;
      media;
      isPlaceholder;
    };
    exercises.add(id, updatedExercise);

    switch (muscleGroups.get(muscleGroupToName(exercise.primaryMuscle))) {
      case (null) {};
      case (?mg) {
        let filtered = mg.exerciseIds.filter(func(exId) { exId != id });
        let updatedMg = { mg with exerciseIds = filtered };
        muscleGroups.add(muscleGroupToName(exercise.primaryMuscle), updatedMg);
      };
    };

    switch (muscleGroups.get(muscleGroupToName(primaryMuscle))) {
      case (null) {
        let newMuscleGroup : MuscleGroupDetails = {
          name = muscleGroupToName(primaryMuscle);
          description = "";
          imageUrl = "";
          exerciseIds = [id];
          card = createDefaultMuscleGroupCard(primaryMuscle);
        };
        muscleGroups.add(muscleGroupToName(primaryMuscle), newMuscleGroup);
      };
      case (?mg) {
        let updatedExercises = mg.exerciseIds.concat([id]);
        let updatedMuscleGroup = { mg with exerciseIds = updatedExercises };
        muscleGroups.add(muscleGroupToName(primaryMuscle), updatedMuscleGroup);
      };
    };
  };

  public shared ({ caller }) func deleteExercise(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete exercises");
    };

    let exercise = switch (exercises.get(id)) {
      case (null) { Runtime.trap("Could not find exercise with id=" # id.toText()) };
      case (?e) { e };
    };

    exercises.remove(id);

    switch (muscleGroups.get(muscleGroupToName(exercise.primaryMuscle))) {
      case (null) {};
      case (?mg) {
        let filtered = mg.exerciseIds.filter(func(exId) { exId != id });
        let updatedMg = { mg with exerciseIds = filtered };
        muscleGroups.add(muscleGroupToName(exercise.primaryMuscle), updatedMg);
      };
    };
  };

  // Public read — no auth required (exercises are public content)
  public query func getAllExercisePreviews() : async [ExercisePreview] {
    exercises.values().toArray().map(
      func(exercise) {
        {
          id = exercise.id;
          name = exercise.name;
          primaryMuscle = exercise.primaryMuscle;
          imageUrl = switch (exercise.media.imageUrls.size()) {
            case (0) { "" };
            case (_) { exercise.media.imageUrls[0] };
          };
        };
      }
    );
  };

  // Public read — no auth required
  public query func getExercise(id : Nat) : async ?Exercise {
    exercises.get(id);
  };

  // Public read — no auth required
  public query func getExercisesByMuscleGroup(muscleGroup : MuscleGroup) : async [Exercise] {
    exercises.values().toArray().filter(
      func(e) { e.primaryMuscle == muscleGroup }
    );
  };

  // Admin read — full list including unpublished
  public query ({ caller }) func getAllExercisesAdmin() : async [Exercise] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all exercises");
    };
    exercises.values().toArray();
  };

  // ── Muscle Group ──────────────────────────────────────────────────────────

  // Public read — no auth required
  public query func getMuscleGroupDetails(name : Text) : async ?MuscleGroupDetails {
    muscleGroups.get(name);
  };

  // Public read — no auth required
  public query func getAllMuscleGroups() : async [MuscleGroupDetails] {
    muscleGroups.values().toArray();
  };

  public shared ({ caller }) func updateMuscleGroupCard(name : Text, card : MuscleGroupCard) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update muscle group cards");
    };
    switch (muscleGroups.get(name)) {
      case (null) { Runtime.trap("Muscle group not found") };
      case (?mg) {
        let updated = { mg with card };
        muscleGroups.add(name, updated);
      };
    };
  };

  // ── Blog CRUD ─────────────────────────────────────────────────────────────

  public shared ({ caller }) func createBlogPost(
    title : Text,
    content : Text,
    author : Text,
    memberOnly : Bool,
    media : BlogMedia,
    seoTitle : Text,
    seoMetaDescription : Text,
    seoKeywords : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };

    let now = Time.now();
    let post = {
      id = nextBlogPostId;
      title;
      content;
      author;
      createdAt = now;
      modifiedAt = now;
      published = false;
      memberOnly;
      media;
      seoTitle;
      seoMetaDescription;
      seoKeywords;
    };
    blogPosts.add(nextBlogPostId, post);
    nextBlogPostId += 1;
  };

  public shared ({ caller }) func updateBlogPost(
    id : Nat,
    title : Text,
    content : Text,
    author : Text,
    memberOnly : Bool,
    media : BlogMedia,
    seoTitle : Text,
    seoMetaDescription : Text,
    seoKeywords : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };

    let post = switch (blogPosts.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?p) { p };
    };

    let updated = {
      post with
      title;
      content;
      author;
      memberOnly;
      media;
      seoTitle;
      seoMetaDescription;
      seoKeywords;
      modifiedAt = Time.now();
    };
    blogPosts.add(id, updated);
  };

  public shared ({ caller }) func publishBlogPost(id : Nat, published : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish blog posts");
    };

    let post = switch (blogPosts.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?p) { p };
    };

    blogPosts.add(id, { post with published; modifiedAt = Time.now() });
  };

  public shared ({ caller }) func deleteBlogPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };

    switch (blogPosts.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?_) { blogPosts.remove(id) };
    };
  };

  // Public read — published posts only; member-only posts require #user role
  public query ({ caller }) func getBlogPost(id : Nat) : async ?BlogPost {
    switch (blogPosts.get(id)) {
      case (null) { null };
      case (?post) {
        if (not post.published) {
          // Unpublished posts are admin-only
          if (not (AccessControl.isAdmin(accessControlState, caller))) {
            return null;
          };
        };
        if (post.memberOnly) {
          if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: This post is for members only");
          };
        };
        ?post;
      };
    };
  };

  // Public read — returns previews of published posts; member-only previews visible to all but content gated
  public query func getPublishedBlogPostPreviews() : async [BlogPostPreview] {
    blogPosts.values().toArray()
      .filter(func(p) { p.published })
      .map(func(p) {
        {
          id = p.id;
          title = p.title;
          author = p.author;
          createdAt = p.createdAt;
          memberOnly = p.memberOnly;
          seoTitle = p.seoTitle;
          seoMetaDescription = p.seoMetaDescription;
        };
      });
  };

  // Admin read — all posts including unpublished
  public query ({ caller }) func getAllBlogPostsAdmin() : async [BlogPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all blog posts");
    };
    blogPosts.values().toArray();
  };

  // ── Nutrition CRUD ────────────────────────────────────────────────────────

  public shared ({ caller }) func createNutritionArticle(
    title : Text,
    content : Text,
    author : Text,
    media : BlogMedia,
    memberOnly : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create nutrition articles");
    };

    let article : NutritionArticle = {
      id = nextNutritionArticleId;
      title;
      content;
      author;
      createdAt = Time.now();
      media;
      published = false;
      memberOnly;
    };

    nutritionArticles.add(nextNutritionArticleId, article);
    nextNutritionArticleId += 1;
  };

  public shared ({ caller }) func updateNutritionArticle(
    id : Nat,
    title : Text,
    content : Text,
    author : Text,
    media : BlogMedia,
    memberOnly : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update nutrition articles");
    };

    let article = switch (nutritionArticles.get(id)) {
      case (null) { Runtime.trap("Nutrition article not found") };
      case (?a) { a };
    };

    let updated = {
      article with
      title;
      content;
      author;
      media;
      memberOnly;
    };
    nutritionArticles.add(id, updated);
  };

  public shared ({ caller }) func publishNutritionArticle(id : Nat, published : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish nutrition articles");
    };

    let article = switch (nutritionArticles.get(id)) {
      case (null) { Runtime.trap("Nutrition article not found") };
      case (?a) { a };
    };

    nutritionArticles.add(id, { article with published });
  };

  public shared ({ caller }) func deleteNutritionArticle(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete nutrition articles");
    };

    switch (nutritionArticles.get(id)) {
      case (null) { Runtime.trap("Nutrition article not found") };
      case (?_) { nutritionArticles.remove(id) };
    };
  };

  // Public read — published articles only; member-only content requires #user role
  public query ({ caller }) func getNutritionArticle(id : Nat) : async ?NutritionArticle {
    switch (nutritionArticles.get(id)) {
      case (null) { null };
      case (?article) {
        if (not article.published) {
          if (not (AccessControl.isAdmin(accessControlState, caller))) {
            return null;
          };
        };
        if (article.memberOnly) {
          if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: This article is for members only");
          };
        };
        ?article;
      };
    };
  };

  // Public read — previews of published nutrition articles
  public query func getPublishedNutritionArticlePreviews() : async [NutritionArticlePreview] {
    nutritionArticles.values().toArray()
      .filter(func(a) { a.published })
      .map(func(a) {
        {
          id = a.id;
          title = a.title;
          author = a.author;
          createdAt = a.createdAt;
          memberOnly = a.memberOnly;
        };
      });
  };

  // Admin read — all nutrition articles including unpublished
  public query ({ caller }) func getAllNutritionArticlesAdmin() : async [NutritionArticle] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all nutrition articles");
    };
    nutritionArticles.values().toArray();
  };

  // ── Amazon Products ───────────────────────────────────────────────────────

  public shared ({ caller }) func addAmazonProduct(
    name : Text,
    description : Text,
    imageUrl : Text,
    category : Text,
    affiliateLink : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add Amazon products");
    };

    let product : AmazonProduct = {
      id = nextAmazonProductId;
      name;
      description;
      imageUrl;
      category;
      affiliateLink;
    };
    amazonProducts.add(nextAmazonProductId, product);
    nextAmazonProductId += 1;
  };

  public shared ({ caller }) func updateAmazonProduct(
    id : Nat,
    name : Text,
    description : Text,
    imageUrl : Text,
    category : Text,
    affiliateLink : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update Amazon products");
    };

    switch (amazonProducts.get(id)) {
      case (null) { Runtime.trap("Amazon product not found") };
      case (?_) {
        amazonProducts.add(id, { id; name; description; imageUrl; category; affiliateLink });
      };
    };
  };

  public shared ({ caller }) func deleteAmazonProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete Amazon products");
    };

    switch (amazonProducts.get(id)) {
      case (null) { Runtime.trap("Amazon product not found") };
      case (?_) { amazonProducts.remove(id) };
    };
  };

  // Public read — no auth required
  public query func getAllAmazonProducts() : async [AmazonProduct] {
    amazonProducts.values().toArray();
  };

  // ── Memberships ───────────────────────────────────────────────────────────

  public shared ({ caller }) func setMembership(
    user : Principal,
    active : Bool,
    stripeId : Text,
    price : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set memberships");
    };

    let membership : Membership = {
      principal = user;
      active;
      stripeId;
      price;
    };
    memberships.add(user, membership);
  };

  public query ({ caller }) func getMyMembership() : async ?Membership {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their membership");
    };
    memberships.get(caller);
  };

  public query ({ caller }) func getMembership(user : Principal) : async ?Membership {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own membership");
    };
    memberships.get(user);
  };

  // ── Stripe Integration ────────────────────────────────────────────────────

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe config");
    };
    stripeConfig := ?config;
  };

  public query ({ caller }) func getStripeConfig() : async ?Stripe.StripeConfiguration {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view Stripe config");
    };
    stripeConfig;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  // Public read — session status must be checkable after payment redirect (no auth required)
  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  // Only authenticated users can initiate a checkout session
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  // ── Misc Config ───────────────────────────────────────────────────────────

  public shared ({ caller }) func setMiscConfig(config : MiscConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set misc config");
    };
    miscConfig := ?config;
  };

  // Public read — no auth required
  public query func getMiscConfig() : async ?MiscConfig {
    miscConfig;
  };

  // ── Workout Routine CRUD ──────────────────────────────────────────────────

  public shared ({ caller }) func createWorkoutRoutine(name : Text, exerciseIds : [Nat]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create routines");
    };

    let routine : WorkoutRoutine = {
      name;
      exercises = exerciseIds;
      principal = caller;
    };

    let current = switch (workoutRoutines.get(caller)) {
      case (null) { [] };
      case (?existing) { existing };
    };

    let updated = current.concat([routine]);
    workoutRoutines.add(caller, updated);
  };

  public shared ({ caller }) func updateWorkoutRoutine(name : Text, exerciseIds : [Nat]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update routines");
    };

    let current = switch (workoutRoutines.get(caller)) {
      case (null) { Runtime.trap("Routine not found") };
      case (?existing) { existing };
    };

    let updated = current.map(
      func(r) {
        if (r.name == name) { { r with exercises = exerciseIds } } else { r };
      }
    );
    workoutRoutines.add(caller, updated);
  };

  public shared ({ caller }) func deleteWorkoutRoutine(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete routines");
    };

    let current = switch (workoutRoutines.get(caller)) {
      case (null) { Runtime.trap("Routine not found") };
      case (?existing) { existing };
    };

    let filtered = current.filter(func(r) { r.name != name });
    workoutRoutines.add(caller, filtered);
  };

  public query ({ caller }) func getCallerWorkoutRoutines() : async [WorkoutRoutine] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their routines");
    };

    switch (workoutRoutines.get(caller)) {
      case (null) { [] };
      case (?routines) { routines };
    };
  };

  public query ({ caller }) func getUserWorkoutRoutines(user : Principal) : async [WorkoutRoutine] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own routines");
    };

    switch (workoutRoutines.get(user)) {
      case (null) { [] };
      case (?routines) { routines };
    };
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  func muscleGroupToName(mg : MuscleGroup) : Text {
    switch (mg) {
      case (#chest) { "Chest" };
      case (#back) { "Back" };
      case (#shoulders) { "Shoulders" };
      case (#biceps) { "Biceps" };
      case (#triceps) { "Triceps" };
      case (#quads) { "Quads" };
      case (#hamstrings) { "Hamstrings" };
      case (#glutes) { "Glutes" };
      case (#calves) { "Calves" };
      case (#core) { "Core" };
    };
  };

  func createDefaultMuscleGroupCard(mg : MuscleGroup) : MuscleGroupCard {
    {
      title = muscleGroupToName(mg);
      description = getDefaultDescription(muscleGroupToName(mg));
      imageUrl = getDefaultImageUrl(mg);
      heroImage = null;
    };
  };

  func getDefaultDescription(name : Text) : Text {
    "Default description for: " # name;
  };

  func getDefaultImageUrl(mg : MuscleGroup) : Text {
    switch (mg) {
      case (#chest) { "https://media.discordapp.net/attachments/746090787591151747/1245354939349575801/CP_Chest.png?rl=true" };
      case (#shoulders) { "https://media.discordapp.net/attachments/746090787591151747/1245354940952635454/CP_Shoulders.png?rl=true" };
      case (#biceps) { "https://media.discordapp.net/attachments/746090787591151747/1245354939710216272/CP_Biceps.png?rl=true" };
      case (#triceps) { "https://media.discordapp.net/attachments/746090787591151747/1245354941572986912/CP_Triceps.png?rl=true" };
      case (#calves) { "https://media.discordapp.net/attachments/746090787591151747/1245354938075947110/CP_Calves.png?rl=true" };
      case (#quads) { "https://media.discordapp.net/attachments/746090787591151747/1245354941259016242/CP_Quads.png?rl=true" };
      case (#back) { "https://media.discordapp.net/attachments/746090787591151747/1245354938934306929/CP_Back.png?rl=true" };
      case (#core) { "https://media.discordapp.net/attachments/746090787591151747/1245354939400689754/CP_Core.png?rl=true" };
      case (#hamstrings) { "https://media.discordapp.net/attachments/746090787591151747/1245354940676634815/CP_Hamstrings.png?rl=true" };
      case (#glutes) { "https://cdn.discordapp.com/attachments/746090787591151747/1245354940294127646/CP_Glutes.png?rl=true" };
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Public read — no auth required
  public query func getPrivacyPolicy() : async Text {
    "Your privacy is important to us. All content is copyright of Cerebral Physique LLC. We collect minimal data necessary for service delivery and do not share information with third parties outside of required payment processing. For support please contact us at support@cerebralphysique.com. By using our service, you agree to these terms.";
  };
};
