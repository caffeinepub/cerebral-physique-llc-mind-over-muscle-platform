import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  // Old Membership type without price field.
  type OldMembership = {
    principal : Principal;
    active : Bool;
    stripeId : Text;
  };

  // New Membership type with price field.
  type NewMembership = {
    principal : Principal;
    active : Bool;
    stripeId : Text;
    price : Nat;
  };

  // Old actor type
  type OldActor = {
    memberships : Map.Map<Principal, OldMembership>;
  };

  // New actor type
  type NewActor = {
    memberships : Map.Map<Principal, NewMembership>;
  };

  public func run(old : OldActor) : NewActor {
    let newMemberships = old.memberships.map<Principal, OldMembership, NewMembership>(
      func(_principal, oldMembership) {
        { oldMembership with price = 2499 /* Default price in cents */ };
      }
    );
    { memberships = newMemberships };
  };
};
