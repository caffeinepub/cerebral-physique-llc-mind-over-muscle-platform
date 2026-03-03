import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  // Add new WorkoutRoutine type for migration
  type WorkoutRoutine = {
    name : Text;
    exercises : [Nat];
    principal : Principal;
  };

  // Old actor type
  type OldActor = {
    // ... existing state
  };

  // New actor type (unchanged here for simplicity, as no state needs migrating)
  type NewActor = {
    workoutRoutines : Map.Map<Principal, [WorkoutRoutine]>;
  };

  public func run(old : OldActor) : NewActor {
    // Convert to new actor type
    let workoutRoutines = Map.empty<Principal, [WorkoutRoutine]>();
    { workoutRoutines };
  };
};
