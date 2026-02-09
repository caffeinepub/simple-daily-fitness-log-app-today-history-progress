import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Float "mo:core/Float";
import Int "mo:core/Int";



actor {
  type WeightEntry = {
    timestamp : Time.Time;
    weightKg : Float;
  };
  module WeightEntry {
    public func compare(a : WeightEntry, b : WeightEntry) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  type WorkoutCompletionRecord = {
    completions : [Bool];
  };

  module WorkoutCompletionRecord {
    public func compare(a : WorkoutCompletionRecord, b : WorkoutCompletionRecord) : Order.Order {
      Text.compare(a.completions.toText(), b.completions.toText());
    };
  };

  public type UserProfile = {
    name : Text;
    startWeight : Float;
    targetWeight : Float;
    weeklyWorkoutFrequency : Int;
    dailyDurationHours : Float;
    createdAt : Time.Time;
  };

  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      Int.compare(a.createdAt, b.createdAt);
    };

    public func compareByStartWeight(a : UserProfile, b : UserProfile) : Order.Order {
      Float.compare(a.startWeight, b.startWeight);
    };
  };

  public type Exercise = {
    id : Nat;
    name : Text;
    reps : Int;
    sets : Int;
    weightKg : Float;
  };

  public type WorkoutSection = {
    name : Text;
    exercises : [Exercise];
  };

  public type WorkoutDay = {
    dayName : Text;
    sections : [WorkoutSection];
  };

  public type WorkoutContent = {
    days : [WorkoutDay];
  };

  public type CalendarKey = {
    principal : Principal;
    date : Text;
  };

  module CalendarKey {
    public func compare(a : CalendarKey, b : CalendarKey) : Order.Order {
      switch (Principal.compare(a.principal, b.principal)) {
        case (#less) { #less };
        case (#greater) { #greater };
        case (#equal) { Text.compare(a.date, b.date) };
      };
    };

    public func toText(key : CalendarKey) : Text {
      key.principal.toText() # ":" # key.date;
    };

    public func fromText(text : Text) : ?CalendarKey {
      let parts = text.split(#char ':');
      let partsArray = parts.toArray();
      if (partsArray.size() != 2) {
        return null;
      };
      ?{
        principal = Principal.fromText(partsArray[0]);
        date = partsArray[1];
      };
    };
  };

  type CompletionStatus = {
    isCompleted : Bool;
    completedAt : ?Time.Time;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let defaultWorkoutFrequency : Int = 6;
  let defaultDailyDuration : Float = 2.0;
  let profiles = Map.empty<Principal, UserProfile>();
  let workoutRecords = Map.empty<Principal, [WorkoutCompletionRecord]>();
  let weightEntries = Map.empty<Principal, [WeightEntry]>();
  let calendarCompletions = Map.empty<Text, Bool>();
  let customWorkouts = Map.empty<Text, WorkoutContent>();
  let skippedWorkouts = Map.empty<Text, Bool>();

  func makeCalendarKey(principal : Principal, date : Text) : Text {
    principal.toText() # ":" # date;
  };

  public shared ({ caller }) func updateProfile(name : Text, weight : Float, targetWeight : Float, frequency : Int, duration : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    let profile : UserProfile = {
      name;
      startWeight = weight;
      targetWeight;
      weeklyWorkoutFrequency = frequency;
      dailyDurationHours = duration;
      createdAt = Time.now();
    };

    profiles.add(caller, profile);
  };

  public shared ({ caller }) func updateDefaultProfile() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    let profile : UserProfile = {
      name = "User";
      startWeight = 80.0;
      targetWeight = 67.0;
      weeklyWorkoutFrequency = defaultWorkoutFrequency;
      dailyDurationHours = defaultDailyDuration;
      createdAt = Time.now();
    };

    profiles.add(caller, profile);
  };

  public shared ({ caller }) func markWorkoutCompleted() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark workout completion");
    };

    let newCompletion : WorkoutCompletionRecord = {
      completions = [true];
    };

    switch (workoutRecords.get(caller)) {
      case (null) {
        workoutRecords.add(caller, [newCompletion]);
      };
      case (?records) {
        let updatedRecords = [newCompletion].concat(records);
        let limitedRecords = if (updatedRecords.size() > 7) {
          updatedRecords.sliceToArray(0, 7);
        } else {
          updatedRecords;
        };
        workoutRecords.add(caller, limitedRecords);
      };
    };
  };

  public shared ({ caller }) func addWeightEntry(weight : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add weight entries");
    };

    let entry : WeightEntry = {
      timestamp = Time.now();
      weightKg = weight;
    };

    switch (weightEntries.get(caller)) {
      case (null) {
        weightEntries.add(caller, [entry]);
      };
      case (?entries) {
        weightEntries.add(caller, entries.concat([entry]));
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getWorkoutRecords() : async [WorkoutCompletionRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view workout records");
    };
    switch (workoutRecords.get(caller)) {
      case (null) { [] };
      case (?records) { records };
    };
  };

  public query ({ caller }) func getWeightEntries() : async [WeightEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view weight entries");
    };
    switch (weightEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries };
    };
  };

  public query ({ caller }) func getLatestWeight() : async ?WeightEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view weight entries");
    };
    switch (weightEntries.get(caller)) {
      case (null) { null };
      case (?entries) {
        if (entries.size() == 0) { return null };
        ?entries[0];
      };
    };
  };

  public query ({ caller }) func getWorkoutCompletionCount() : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view workout statistics");
    };
    switch (workoutRecords.get(caller)) {
      case (null) { 0 };
      case (?records) {
        var count = 0;
        for (record in records.values()) {
          let completed = record.completions.filter(func(c) { c }).size();
          count += completed;
        };
        count;
      };
    };
  };

  public query ({ caller }) func getWorkoutStreak() : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view workout statistics");
    };
    switch (workoutRecords.get(caller)) {
      case (null) { 0 };
      case (?records) {
        var streak = 0;
        for (record in records.values()) {
          let first = if (record.completions.size() > 0) { record.completions[0] } else {
            false;
          };
          if (first) { streak += 1 } else { return streak };
        };
        streak;
      };
    };
  };

  public shared ({ caller }) func resetWorkoutRecords() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reset workout records");
    };

    let emptyRecord : WorkoutCompletionRecord = {
      completions = [];
    };

    let emptyRecords = Array.repeat(emptyRecord, 7);
    workoutRecords.add(caller, emptyRecords);
  };

  public shared ({ caller }) func markWorkoutCompletedForDate(date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark workout completion");
    };
    let key = makeCalendarKey(caller, date);
    calendarCompletions.add(key, true);
  };

  public shared ({ caller }) func markWorkoutIncompleteForDate(date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark workout as incomplete");
    };
    let key = makeCalendarKey(caller, date);
    calendarCompletions.add(key, false);
  };

  public query ({ caller }) func getWorkoutCompletionForDate(date : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view workout completions");
    };
    let key = makeCalendarKey(caller, date);
    switch (calendarCompletions.get(key)) {
      case (?completed) { completed };
      case (null) { false };
    };
  };

  public query ({ caller }) func getWorkoutCompletionsForDateRange(_startDate : Text, _endDate : Text) : async [(Text, Bool)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view workout completions");
    };
    let rangeSize = 30;
    let range = Array.tabulate(
      rangeSize,
      func(i) {
        let date = "2023-07-" # (rangeSize - i).toText();
        let key = makeCalendarKey(caller, date);
        switch (calendarCompletions.get(key)) {
          case (?completed) { (date, completed) };
          case (null) { (date, false) };
        };
      },
    );
    range;
  };

  public shared ({ caller }) func saveCustomWorkoutForDate(date : Text, workout : WorkoutContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save custom workouts");
    };
    let key = makeCalendarKey(caller, date);
    customWorkouts.add(key, workout);
  };

  public shared ({ caller }) func clearCustomWorkoutForDate(date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear custom workouts");
    };
    let key = makeCalendarKey(caller, date);
    customWorkouts.remove(key);
  };

  public query ({ caller }) func getWorkoutForDate(date : Text) : async ?WorkoutContent {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view workouts");
    };
    let key = makeCalendarKey(caller, date);
    customWorkouts.get(key);
  };

  public shared ({ caller }) func toggleWorkoutCompletionForDate(date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle workout completion");
    };
    let key = makeCalendarKey(caller, date);
    switch (calendarCompletions.get(key)) {
      case (?completed) {
        calendarCompletions.add(key, not completed);
      };
      case (null) { calendarCompletions.add(key, true) };
    };
  };

  public shared ({ caller }) func setWorkoutSkippedForDate(date : Text, skipped : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage skipped status");
    };
    let key = makeCalendarKey(caller, date);

    if (skipped) {
      calendarCompletions.remove(key);
    };

    skippedWorkouts.add(key, skipped);
  };

  public shared ({ caller }) func toggleWorkoutSkippedForDate(date : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle skipped status");
    };

    let currentStatus = isWorkoutSkippedInternal(caller, date);
    let newStatus = not currentStatus;

    let key = makeCalendarKey(caller, date);

    if (newStatus) {
      calendarCompletions.remove(key);
    };

    skippedWorkouts.add(key, newStatus);

    newStatus;
  };

  public query ({ caller }) func isWorkoutSkippedForDate(date : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check skipped status");
    };
    isWorkoutSkippedInternal(caller, date);
  };

  func isWorkoutSkippedInternal(caller : Principal, date : Text) : Bool {
    switch (skippedWorkouts.get(makeCalendarKey(caller, date))) {
      case (?skipped) { skipped };
      case (null) { false };
    };
  };
};
