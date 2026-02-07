import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldActor = {
    exercises : Map.Map<Nat, OldExercise>;
    blogPosts : Map.Map<Nat, BlogPost>;
    amazonProducts : Map.Map<Nat, AmazonProduct>;
    memberships : Map.Map<Principal, Membership>;
    muscleGroups : Map.Map<Text, OldMuscleGroupDetails>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextExerciseId : Nat;
    nextBlogPostId : Nat;
    nextAmazonProductId : Nat;
    stripeConfig : ?StripeConfiguration;
    miscConfig : ?MiscConfig;
  };

  type OldExercise = {
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

  type OldMuscleGroupDetails = {
    name : Text;
    description : Text;
    imageUrl : Text;
    exerciseIds : [Nat];
  };

  type NewMuscleGroupCard = {
    title : Text;
    description : Text;
    imageUrl : Text;
    heroImage : ?Storage.ExternalBlob;
  };

  type NewMuscleGroupDetails = {
    name : Text;
    description : Text;
    imageUrl : Text;
    exerciseIds : [Nat];
    card : NewMuscleGroupCard;
  };

  type BlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    createdAt : Int;
    modifiedAt : Int;
    published : Bool;
    memberOnly : Bool;
    seoTitle : Text;
    seoMetaDescription : Text;
    seoKeywords : [Text];
  };

  type AmazonProduct = {
    id : Nat;
    name : Text;
    description : Text;
    imageUrl : Text;
    category : Text;
    affiliateLink : Text;
  };

  type Membership = {
    principal : Principal;
    active : Bool;
    stripeId : Text;
  };

  type UserProfile = {
    name : Text;
    email : ?Text;
    membershipStatus : ?Text;
  };

  type MiscConfig = {
    adminContactEmail : Text;
    supportContactEmail : Text;
  };

  type StripeConfiguration = {
    secretKey : Text;
    allowedCountries : [Text];
  };

  type MuscleGroup = { #chest; #back; #shoulders; #biceps; #triceps; #quads; #hamstrings; #glutes; #calves; #core };
  type EquipmentType = { #machine; #dumbbell; #cable; #bodyweight };

  type NewActor = {
    exercises : Map.Map<Nat, OldExercise>;
    blogPosts : Map.Map<Nat, BlogPost>;
    amazonProducts : Map.Map<Nat, AmazonProduct>;
    memberships : Map.Map<Principal, Membership>;
    muscleGroups : Map.Map<Text, NewMuscleGroupDetails>;
    muscleGroupCards : Map.Map<Text, NewMuscleGroupCard>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextExerciseId : Nat;
    nextBlogPostId : Nat;
    nextAmazonProductId : Nat;
    stripeConfig : ?StripeConfiguration;
    miscConfig : ?MiscConfig;
  };

  func createDefaultMuscleGroupCard(name : Text) : NewMuscleGroupCard {
    {
      title = name;
      description = "This is the default description for the " # name # " muscle group. Please add a more detailed description.";
      imageUrl = "";
      heroImage = null;
    };
  };

  public func run(old : OldActor) : NewActor {
    let newMuscleGroups = old.muscleGroups.map<Text, OldMuscleGroupDetails, NewMuscleGroupDetails>(
      func(_name, oldMg) {
        {
          oldMg with
          card = createDefaultMuscleGroupCard(oldMg.name)
        };
      }
    );

    let muscleGroupCards = Map.empty<Text, NewMuscleGroupCard>();

    {
      old with
      muscleGroups = newMuscleGroups;
      muscleGroupCards;
    };
  };
};
