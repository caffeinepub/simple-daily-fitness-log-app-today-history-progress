export interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  restSeconds?: number;
}

export interface WorkoutSection {
  name: string;
  exercises: Exercise[];
}

export interface WorkoutDay {
  name: string;
  isRestDay: boolean;
  sections: WorkoutSection[];
}

export const workoutPlan: WorkoutDay[] = [
  {
    name: 'Push (Intermediate)',
    isRestDay: false,
    sections: [
      {
        name: 'Warm-up',
        exercises: [
          { name: 'Arm Circles', duration: '2 min', reps: '15 each direction' },
          { name: 'Band Pull-Aparts', duration: '2 min', reps: '15' },
          { name: 'Light Cardio', duration: '5 min' },
        ],
      },
      {
        name: 'Strength Training',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '8-10', restSeconds: 90 },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', restSeconds: 75 },
          { name: 'Overhead Press', sets: 4, reps: '8-10', restSeconds: 90 },
          { name: 'Dumbbell Lateral Raises', sets: 3, reps: '12-15', restSeconds: 60 },
          { name: 'Tricep Dips (Weighted)', sets: 3, reps: '10-12', restSeconds: 60 },
          { name: 'Cable Tricep Pushdowns', sets: 3, reps: '12-15', restSeconds: 60 },
          { name: 'Dumbbell Chest Flyes', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Cardio',
        exercises: [
          { name: 'Incline Treadmill Walk', duration: '10 min' },
        ],
      },
      {
        name: 'Cool-down',
        exercises: [
          { name: 'Chest Doorway Stretch', duration: '90 sec' },
          { name: 'Shoulder Stretch', duration: '90 sec each side' },
          { name: 'Tricep Overhead Stretch', duration: '90 sec each arm' },
        ],
      },
    ],
  },
  {
    name: 'Pull (Intermediate)',
    isRestDay: false,
    sections: [
      {
        name: 'Warm-up',
        exercises: [
          { name: 'Band Pull-Aparts', duration: '2 min', reps: '15' },
          { name: 'Scapular Retractions', duration: '2 min', reps: '15' },
          { name: 'Light Rowing', duration: '5 min' },
        ],
      },
      {
        name: 'Strength Training',
        exercises: [
          { name: 'Deadlifts', sets: 4, reps: '6-8', restSeconds: 120 },
          { name: 'Pull-ups or Lat Pulldowns', sets: 4, reps: '8-10', restSeconds: 90 },
          { name: 'Barbell Rows', sets: 4, reps: '8-10', restSeconds: 90 },
          { name: 'Seated Cable Rows', sets: 3, reps: '10-12', restSeconds: 75 },
          { name: 'Face Pulls', sets: 3, reps: '15-20', restSeconds: 60 },
          { name: 'Barbell Bicep Curls', sets: 3, reps: '10-12', restSeconds: 60 },
          { name: 'Hammer Curls', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Cardio',
        exercises: [
          { name: 'Rowing Machine', duration: '10 min' },
        ],
      },
      {
        name: 'Cool-down',
        exercises: [
          { name: 'Lat Stretch', duration: '90 sec each side' },
          { name: 'Lower Back Stretch', duration: '2 min' },
          { name: 'Bicep Stretch', duration: '90 sec each arm' },
        ],
      },
    ],
  },
  {
    name: 'Legs (Intermediate)',
    isRestDay: false,
    sections: [
      {
        name: 'Warm-up',
        exercises: [
          { name: 'Leg Swings', duration: '2 min', reps: '15 each leg' },
          { name: 'Hip Circles', duration: '2 min', reps: '15 each direction' },
          { name: 'Bodyweight Squats', duration: '3 min', reps: '20' },
          { name: 'Light Cycling', duration: '5 min' },
        ],
      },
      {
        name: 'Strength Training',
        exercises: [
          { name: 'Barbell Back Squats', sets: 4, reps: '8-10', restSeconds: 120 },
          { name: 'Romanian Deadlifts', sets: 4, reps: '10-12', restSeconds: 90 },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '10-12 each leg', restSeconds: 75 },
          { name: 'Leg Press', sets: 4, reps: '12-15', restSeconds: 75 },
          { name: 'Leg Curls', sets: 3, reps: '12-15', restSeconds: 60 },
          { name: 'Calf Raises', sets: 4, reps: '15-20', restSeconds: 60 },
          { name: 'Hanging Leg Raises', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Cardio',
        exercises: [
          { name: 'Stair Climber', duration: '10 min' },
        ],
      },
      {
        name: 'Cool-down',
        exercises: [
          { name: 'Quad Stretch', duration: '90 sec each leg' },
          { name: 'Hamstring Stretch', duration: '90 sec each leg' },
          { name: 'Hip Flexor Stretch', duration: '90 sec each side' },
          { name: 'Calf Stretch', duration: '90 sec each leg' },
        ],
      },
    ],
  },
  {
    name: 'Push (Intermediate)',
    isRestDay: false,
    sections: [
      {
        name: 'Warm-up',
        exercises: [
          { name: 'Arm Circles', duration: '2 min', reps: '15 each direction' },
          { name: 'Band Pull-Aparts', duration: '2 min', reps: '15' },
          { name: 'Light Cardio', duration: '5 min' },
        ],
      },
      {
        name: 'Strength Training',
        exercises: [
          { name: 'Dumbbell Bench Press', sets: 4, reps: '10-12', restSeconds: 90 },
          { name: 'Incline Barbell Press', sets: 4, reps: '8-10', restSeconds: 90 },
          { name: 'Dumbbell Shoulder Press', sets: 4, reps: '10-12', restSeconds: 75 },
          { name: 'Cable Lateral Raises', sets: 3, reps: '15-20', restSeconds: 60 },
          { name: 'Close-Grip Bench Press', sets: 3, reps: '10-12', restSeconds: 75 },
          { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { name: 'Cable Chest Flyes', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
      {
        name: 'Cardio',
        exercises: [
          { name: 'Elliptical', duration: '10 min' },
        ],
      },
      {
        name: 'Cool-down',
        exercises: [
          { name: 'Chest Doorway Stretch', duration: '90 sec' },
          { name: 'Shoulder Stretch', duration: '90 sec each side' },
          { name: 'Tricep Overhead Stretch', duration: '90 sec each arm' },
        ],
      },
    ],
  },
  {
    name: 'Pull (Intermediate)',
    isRestDay: false,
    sections: [
      {
        name: 'Warm-up',
        exercises: [
          { name: 'Band Pull-Aparts', duration: '2 min', reps: '15' },
          { name: 'Scapular Retractions', duration: '2 min', reps: '15' },
          { name: 'Light Rowing', duration: '5 min' },
        ],
      },
      {
        name: 'Strength Training',
        exercises: [
          { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', restSeconds: 120 },
          { name: 'T-Bar Rows', sets: 4, reps: '10-12', restSeconds: 90 },
          { name: 'Wide-Grip Lat Pulldowns', sets: 4, reps: '10-12', restSeconds: 75 },
          { name: 'Single-Arm Dumbbell Rows', sets: 3, reps: '10-12 each', restSeconds: 75 },
          { name: 'Reverse Flyes', sets: 3, reps: '15-20', restSeconds: 60 },
          { name: 'EZ-Bar Curls', sets: 3, reps: '10-12', restSeconds: 60 },
          { name: 'Cable Curls', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Cardio',
        exercises: [
          { name: 'Assault Bike', duration: '10 min' },
        ],
      },
      {
        name: 'Cool-down',
        exercises: [
          { name: 'Lat Stretch', duration: '90 sec each side' },
          { name: 'Lower Back Stretch', duration: '2 min' },
          { name: 'Bicep Stretch', duration: '90 sec each arm' },
        ],
      },
    ],
  },
  {
    name: 'Legs (Intermediate)',
    isRestDay: false,
    sections: [
      {
        name: 'Warm-up',
        exercises: [
          { name: 'Leg Swings', duration: '2 min', reps: '15 each leg' },
          { name: 'Hip Circles', duration: '2 min', reps: '15 each direction' },
          { name: 'Bodyweight Squats', duration: '3 min', reps: '20' },
          { name: 'Light Cycling', duration: '5 min' },
        ],
      },
      {
        name: 'Strength Training',
        exercises: [
          { name: 'Front Squats', sets: 4, reps: '8-10', restSeconds: 120 },
          { name: 'Sumo Deadlifts', sets: 4, reps: '8-10', restSeconds: 120 },
          { name: 'Walking Lunges', sets: 3, reps: '12 each leg', restSeconds: 75 },
          { name: 'Leg Extensions', sets: 3, reps: '12-15', restSeconds: 60 },
          { name: 'Lying Leg Curls', sets: 3, reps: '12-15', restSeconds: 60 },
          { name: 'Seated Calf Raises', sets: 4, reps: '15-20', restSeconds: 60 },
          { name: 'Cable Crunches', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
      {
        name: 'Cardio',
        exercises: [
          { name: 'Incline Walking', duration: '10 min' },
        ],
      },
      {
        name: 'Cool-down',
        exercises: [
          { name: 'Quad Stretch', duration: '90 sec each leg' },
          { name: 'Hamstring Stretch', duration: '90 sec each leg' },
          { name: 'Hip Flexor Stretch', duration: '90 sec each side' },
          { name: 'Calf Stretch', duration: '90 sec each leg' },
        ],
      },
    ],
  },
  {
    name: 'Rest Day',
    isRestDay: true,
    sections: [],
  },
];
