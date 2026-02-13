import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Storage "blob-storage/Storage";

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

  public type Exercise = {
    id : Nat;
    name : Text;
    primaryMuscle : MuscleGroup;
    secondaryMuscles : [MuscleGroup];
    equipmentType : EquipmentType;
    videoUrl : Text;
    cues : Text;
    imageUrl : Text;
    isPlaceholder : Bool;
  };

  public type ExercisePreview = {
    id : Nat;
    name : Text;
    primaryMuscle : MuscleGroup;
    imageUrl : Text;
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

  let exercises = Map.empty<Nat, Exercise>();
  let blogPosts = Map.empty<Nat, BlogPost>();
  let amazonProducts = Map.empty<Nat, AmazonProduct>();
  let memberships = Map.empty<Principal, Membership>();
  let muscleGroups = Map.empty<Text, MuscleGroupDetails>();
  let muscleGroupCards = Map.empty<Text, MuscleGroupCard>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextExerciseId = 1;
  var nextBlogPostId = 1;
  var nextAmazonProductId = 1;

  var stripeConfig : ?Stripe.StripeConfiguration = null;
  var miscConfig : ?MiscConfig = null;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };
    let config = switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?val) { val };
    };
    await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can check Stripe configuration status");
    };
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig := ?config;
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check session status");
    };
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?config) { await Stripe.getSessionStatus(config, sessionId, transform) };
    };
  };

  public query ({ caller }) func getAllExercises() : async [Exercise] {
    if (not hasActiveMembershipLocal(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only active members can view full exercise library");
    };
    exercises.values().toArray();
  };

  public query ({ caller }) func getAllExercisePreviews() : async [ExercisePreview] {
    exercises.values().toArray().map(func(exercise) { { id = exercise.id; name = exercise.name; primaryMuscle = exercise.primaryMuscle; imageUrl = exercise.imageUrl } });
  };

  public query ({ caller }) func getMuscleGroupExercises(muscleGroup : MuscleGroup) : async [Exercise] {
    if (not hasActiveMembershipLocal(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only active members can view full exercise library");
    };
    exercises.values().toArray().filter(func(exercise) { exercise.primaryMuscle == muscleGroup });
  };

  public query ({ caller }) func getMuscleGroupExercisePreviews(muscleGroup : MuscleGroup) : async [ExercisePreview] {
    exercises.values().toArray().filter(func(exercise) { exercise.primaryMuscle == muscleGroup }).map(func(exercise) { { id = exercise.id; name = exercise.name; primaryMuscle = exercise.primaryMuscle; imageUrl = exercise.imageUrl } });
  };

  public shared ({ caller }) func addExercise(
    name : Text,
    primaryMuscle : MuscleGroup,
    secondaryMuscles : [MuscleGroup],
    equipmentType : EquipmentType,
    videoUrl : Text,
    cues : Text,
    imageUrl : Text,
    isPlaceholder : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add exercises");
    };

    let exercise : Exercise = { id = nextExerciseId; name; primaryMuscle; secondaryMuscles; equipmentType; videoUrl; cues; imageUrl; isPlaceholder };
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
        let updatedMuscleGroup = {
          mg with
          exerciseIds = updatedExercises;
        };
        muscleGroups.add(muscleGroupToName(primaryMuscle), updatedMuscleGroup);
      };
    };

    nextExerciseId += 1;
  };

  public shared ({ caller }) func updateExercise(
    id : Nat,
    name : Text,
    primaryMuscle : MuscleGroup,
    secondaryMuscles : [MuscleGroup],
    equipmentType : EquipmentType,
    videoUrl : Text,
    cues : Text,
    imageUrl : Text,
    isPlaceholder : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update exercises");
    };

    let exercise = switch (exercises.get(id)) {
      case (null) { Runtime.trap("Could not find exercise with id=" # id.toText()) };
      case (?e) { e };
    };

    let updatedExercise = { id; name; primaryMuscle; secondaryMuscles; equipmentType; videoUrl; cues; imageUrl; isPlaceholder };
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
      case (null) { Runtime.trap("Exercise not found") };
      case (?e) { e };
    };

    switch (muscleGroups.get(muscleGroupToName(exercise.primaryMuscle))) {
      case (null) {};
      case (?mg) {
        let filtered = mg.exerciseIds.filter(func(exId) { exId != id });
        let updatedMuscleGroup = { mg with exerciseIds = filtered };
        muscleGroups.add(muscleGroupToName(exercise.primaryMuscle), updatedMuscleGroup);
      };
    };
    exercises.remove(id);
  };

  public shared ({ caller }) func createBlogPost(
    title : Text,
    content : Text,
    author : Text,
    memberOnly : Bool,
    seoTitle : Text,
    seoMetaDescription : Text,
    seoKeywords : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };

    let now = Time.now();
    let post = { id = nextBlogPostId; title; content; author; createdAt = now; modifiedAt = now; published = false; memberOnly; seoTitle; seoMetaDescription; seoKeywords };
    blogPosts.add(nextBlogPostId, post);
    nextBlogPostId += 1;
  };

  public shared ({ caller }) func updateBlogPost(
    id : Nat,
    title : Text,
    content : Text,
    author : Text,
    memberOnly : Bool,
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

    let updated = { post with title; content; author; memberOnly; seoTitle; seoMetaDescription; seoKeywords; modifiedAt = Time.now() };
    blogPosts.add(id, updated);
  };

  public shared ({ caller }) func deleteBlogPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };

    let _ = switch (blogPosts.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?post) { post };
    };
    blogPosts.remove(id);
  };

  public shared ({ caller }) func publishBlogPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish blog posts");
    };

    let post = switch (blogPosts.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?p) { p };
    };

    let updated = { post with published = true };
    blogPosts.add(id, updated);
  };

  public shared ({ caller }) func unpublishBlogPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can unpublish blog posts");
    };

    let post = switch (blogPosts.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?p) { p };
    };

    let updated = { post with published = false };
    blogPosts.add(id, updated);
  };

  public query ({ caller }) func getBlogPost(id : Nat) : async ?BlogPost {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    switch (blogPosts.get(id)) {
      case (null) { null };
      case (?post) {
        if (isAdmin) {
          return ?post;
        };

        if (not post.published) {
          return null;
        };

        if (post.memberOnly and not hasActiveMembershipLocal(caller)) {
          return null;
        };

        ?post;
      };
    };
  };

  public query ({ caller }) func getBlogPostPreview(id : Nat) : async ?BlogPostPreview {
    switch (blogPosts.get(id)) {
      case (null) { null };
      case (?post) {
        if (not post.published) {
          return null;
        };
        ?{
          id = post.id;
          title = post.title;
          author = post.author;
          createdAt = post.createdAt;
          memberOnly = post.memberOnly;
          seoTitle = post.seoTitle;
          seoMetaDescription = post.seoMetaDescription;
        };
      };
    };
  };

  public query ({ caller }) func getAllBlogPosts() : async [BlogPost] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let allPosts = blogPosts.values().toArray();

    if (isAdmin) {
      return allPosts;
    };

    allPosts.filter(func(post) { post.published and (not post.memberOnly or hasActiveMembershipLocal(caller)) });
  };

  public query ({ caller }) func getAllBlogPostPreviews() : async [BlogPostPreview] {
    let allPosts = blogPosts.values().toArray();
    allPosts.filter(func(post) { post.published }).map(func(post) { { id = post.id; title = post.title; author = post.author; createdAt = post.createdAt; memberOnly = post.memberOnly; seoTitle = post.seoTitle; seoMetaDescription = post.seoMetaDescription } });
  };

  public shared ({ caller }) func addAmazonProduct(
    name : Text,
    description : Text,
    imageUrl : Text,
    category : Text,
    affiliateLink : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let product = { id = nextAmazonProductId; name; description; imageUrl; category; affiliateLink };
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
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    let product = switch (amazonProducts.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };

    let updated = { product with name; description; imageUrl; category; affiliateLink };
    amazonProducts.add(id, updated);
  };

  public shared ({ caller }) func deleteAmazonProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    let _ = switch (amazonProducts.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?prod) { prod };
    };

    amazonProducts.remove(id);
  };

  public query func getAllAmazonProducts() : async [AmazonProduct] {
    amazonProducts.values().toArray();
  };

  public shared ({ caller }) func addMembership(stripeId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add memberships");
    };

    let membership : Membership = { principal = caller; active = true; stripeId };
    memberships.add(caller, membership);
  };

  public shared ({ caller }) func addMembershipForUser(user : Principal, stripeId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add memberships");
    };

    let membership : Membership = { principal = user; active = true; stripeId };
    memberships.add(user, membership);
  };

  public shared ({ caller }) func updateMembershipStatus(user : Principal, active : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update membership status");
    };

    let membership = switch (memberships.get(user)) {
      case (null) { Runtime.trap("Membership not found") };
      case (?m) { m };
    };
    let updated = { membership with active };
    memberships.add(user, updated);
  };

  public query ({ caller }) func hasActiveMembership() : async Bool {
    switch (memberships.get(caller)) {
      case (null) { false };
      case (?membership) { membership.active };
    };
  };

  public query ({ caller }) func getMembership() : async ?Membership {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view membership");
    };
    memberships.get(caller);
  };

  public query ({ caller }) func getAllMemberships() : async [Membership] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all memberships");
    };
    memberships.values().toArray();
  };

  public query ({ caller }) func getMuscleGroups() : async [MuscleGroupDetails] {
    muscleGroups.values().toArray();
  };

  public shared ({ caller }) func updateMuscleGroup(
    name : Text,
    description : Text,
    imageUrl : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update muscle groups");
    };

    let mg = switch (muscleGroups.get(name)) {
      case (null) { { name; description; imageUrl; exerciseIds = []; card = createDefaultMuscleGroupCardFromName(name) } };
      case (?existing) { { existing with description; imageUrl } };
    };

    muscleGroups.add(name, mg);
  };

  public query ({ caller }) func getMuscleGroupArtists() : async [MuscleGroupCard] {
    muscleGroupCards.values().toArray();
  };

  public query ({ caller }) func getMuscleGroupArtist(name : Text) : async ?MuscleGroupCard {
    muscleGroupCards.get(name);
  };

  public shared ({ caller }) func updateMuscleGroupArtist(name : Text, card : MuscleGroupCard) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update muscle group cards");
    };
    muscleGroupCards.add(name, card);
  };

  func hasActiveMembershipLocal(caller : Principal) : Bool {
    switch (memberships.get(caller)) {
      case (null) { false };
      case (?membership) { membership.active };
    };
  };

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

  func createDefaultMuscleGroupCardFromName(name : Text) : MuscleGroupCard {
    { title = name; description = getDefaultDescription(name); imageUrl = ""; heroImage = null };
  };

  func getDefaultDescription(name : Text) : Text {
    "This is the default description for the " # name # " muscle group. Please add a more detailed description.";
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

  public query ({ caller }) func getPrivacyPolicy() : async Text {
    "Your privacy is important to us. All content is copyright of Cerebral Physique LLC. We collect minimal data necessary for service delivery and do not share information with third parties outside of required payment processing. For support please contact us at support@cerebralphysique.com. By using our service, you agree to these terms.";
  };

  public query ({ caller }) func getAffiliateDisclosure() : async Text {
    "Cerebral Physique LLC participates in the Amazon Services LLC Associates Program. Purchases are completed on Amazon. By using our affiliate links, you support our platform at no additional cost to you.";
  };
};
