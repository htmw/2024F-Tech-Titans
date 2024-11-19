// quizData.ts

import { QuizQuestion } from "../types/quiz";

export const QUESTIONS_PER_SESSION = 5;

export interface QuizSession {
  subjectId: string;
  completedQuestions: string[];
  currentSession: number;
  lastSessionDate: Date | null;
  isSubjectCompleted: boolean;
}

export const quizSessions = new Map<string, QuizSession>();

export const quizQuestions: Record<string, QuizQuestion[]> = {
  "1": [
    // Mathematics
    {
      id: "m1",
      articleId: "1",
      question: "What are the two main branches of calculus?",
      options: [
        "Algebra and Geometry",
        "Differential and Integral",
        "Linear and Non-linear",
        "Real and Complex",
      ],
      correctAnswer: 1,
      explanation:
        "The two main branches of calculus are differential calculus, which studies rates of change and slopes, and integral calculus, which studies accumulation and areas.",
      topic: "Calculus",
      difficulty: 0.7,
    },
    {
      id: "m2",
      articleId: "1",
      question: "What does differential calculus primarily study?",
      options: [
        "Areas under curves",
        "Rates of change",
        "Volume of solids",
        "Integration techniques",
      ],
      correctAnswer: 1,
      explanation:
        "Differential calculus primarily studies rates of change and the slopes of curves.",
      topic: "Calculus",
      difficulty: 0.6,
    },
    {
      id: "m3",
      articleId: "1",
      question: "What is a derivative?",
      options: [
        "The area under a curve",
        "The instantaneous rate of change",
        "The sum of a series",
        "The volume of a solid",
      ],
      correctAnswer: 1,
      explanation:
        "A derivative represents the instantaneous rate of change of a function at any given point.",
      topic: "Calculus",
      difficulty: 0.7,
    },
    {
      id: "m4",
      articleId: "1",
      question: "What is the fundamental theorem of calculus about?",
      options: [
        "Prime numbers",
        "Complex numbers",
        "The relationship between differentiation and integration",
        "Matrix multiplication",
      ],
      correctAnswer: 2,
      explanation:
        "The fundamental theorem of calculus establishes the relationship between differentiation and integration as inverse operations.",
      topic: "Calculus",
      difficulty: 0.8,
    },
    {
      id: "m5",
      articleId: "1",
      question: "What is an integral used to find?",
      options: [
        "Instantaneous rate of change",
        "Accumulated value or area",
        "Maximum value",
        "Minimum value",
      ],
      correctAnswer: 1,
      explanation:
        "Integrals are used to find accumulated values or areas under curves.",
      topic: "Calculus",
      difficulty: 0.7,
    },
    {
      id: "m6",
      articleId: "2",
      question: "What is a vector space?",
      options: [
        "A collection of vectors",
        "A mathematical structure with addition and scalar multiplication",
        "A three-dimensional space",
        "A geometric plane",
      ],
      correctAnswer: 1,
      explanation:
        "A vector space is a mathematical structure where elements (vectors) can be added and multiplied by scalars.",
      topic: "Linear Algebra",
      difficulty: 0.7,
    },
    {
      id: "m7",
      articleId: "2",
      question: "What is a matrix?",
      options: [
        "A single number",
        "A rectangular array of numbers",
        "A vector",
        "A function",
      ],
      correctAnswer: 1,
      explanation:
        "A matrix is a rectangular array of numbers arranged in rows and columns.",
      topic: "Linear Algebra",
      difficulty: 0.5,
    },
    {
      id: "m8",
      articleId: "2",
      question: "What is an eigenvalue?",
      options: [
        "A type of matrix",
        "A scalar that satisfies the eigenvalue equation",
        "A vector space",
        "A determinant",
      ],
      correctAnswer: 1,
      explanation:
        "An eigenvalue is a scalar that, when multiplied by an eigenvector, results in a vector parallel to the original.",
      topic: "Linear Algebra",
      difficulty: 0.9,
    },
    {
      id: "m9",
      articleId: "2",
      question: "What is the rank of a matrix?",
      options: [
        "The number of rows",
        "The number of columns",
        "The number of linearly independent rows or columns",
        "The sum of all elements",
      ],
      correctAnswer: 2,
      explanation:
        "The rank of a matrix is the number of linearly independent rows or columns in the matrix.",
      topic: "Linear Algebra",
      difficulty: 0.8,
    },
    {
      id: "m10",
      articleId: "2",
      question: "What is a linear transformation?",
      options: [
        "Any function between vector spaces",
        "A function that preserves vector addition and scalar multiplication",
        "A matrix multiplication",
        "A change of basis",
      ],
      correctAnswer: 1,
      explanation:
        "A linear transformation is a function between vector spaces that preserves vector addition and scalar multiplication.",
      topic: "Linear Algebra",
      difficulty: 0.7,
    },
    {
      id: "m11",
      articleId: "3",
      question: "What is probability?",
      options: [
        "The study of random events",
        "The likelihood of an event occurring",
        "Statistical analysis",
        "Data collection",
      ],
      correctAnswer: 1,
      explanation:
        "Probability is a measure of the likelihood of an event occurring.",
      topic: "Probability",
      difficulty: 0.5,
    },
    {
      id: "m12",
      articleId: "3",
      question: "What is conditional probability?",
      options: [
        "The probability of any event",
        "The probability of an event given another event has occurred",
        "The sum of probabilities",
        "The product of probabilities",
      ],
      correctAnswer: 1,
      explanation:
        "Conditional probability is the probability of an event occurring given that another event has already occurred.",
      topic: "Probability",
      difficulty: 0.7,
    },
    {
      id: "m13",
      articleId: "3",
      question: "What is a random variable?",
      options: [
        "Any number",
        "A function that assigns values to random events",
        "A probability",
        "A statistical measure",
      ],
      correctAnswer: 1,
      explanation:
        "A random variable is a function that assigns numerical values to outcomes of a random phenomenon.",
      topic: "Probability",
      difficulty: 0.6,
    },
    {
      id: "m14",
      articleId: "3",
      question: "What is the standard deviation?",
      options: [
        "The average value",
        "The spread of values around the mean",
        "The maximum value",
        "The minimum value",
      ],
      correctAnswer: 1,
      explanation:
        "The standard deviation measures the amount of variation or dispersion of a set of values from their mean.",
      topic: "Statistics",
      difficulty: 0.6,
    },
    {
      id: "m15",
      articleId: "3",
      question: "What is regression analysis?",
      options: [
        "Data collection",
        "A statistical method to model relationships between variables",
        "Probability calculation",
        "Random sampling",
      ],
      correctAnswer: 1,
      explanation:
        "Regression analysis is a statistical method used to model and analyze the relationship between variables.",
      topic: "Statistics",
      difficulty: 0.8,
    },
  ],
  "2": [
    // Physics
    {
      id: "p1",
      articleId: "6",
      question: "What is Newton's First Law of Motion?",
      options: [
        "Force equals mass times acceleration",
        "For every action, there is an equal and opposite reaction",
        "An object at rest stays at rest unless acted upon by a force",
        "Energy cannot be created or destroyed",
      ],
      correctAnswer: 2,
      explanation:
        "Newton's First Law states that an object maintains its state of rest or uniform motion unless acted upon by an external force.",
      topic: "Classical Mechanics",
      difficulty: 0.5,
    },
    {
      id: "p2",
      articleId: "6",
      question: "What is Newton's Second Law of Motion?",
      options: [
        "F = ma",
        "Objects in motion stay in motion",
        "Equal and opposite reactions",
        "Conservation of energy",
      ],
      correctAnswer: 0,
      explanation:
        "Newton's Second Law states that force equals mass times acceleration (F = ma).",
      topic: "Classical Mechanics",
      difficulty: 0.6,
    },
    {
      id: "p3",
      articleId: "6",
      question: "What is Newton's Third Law of Motion?",
      options: [
        "Inertia",
        "F = ma",
        "For every action, there is an equal and opposite reaction",
        "Conservation of momentum",
      ],
      correctAnswer: 2,
      explanation:
        "Newton's Third Law states that for every action, there is an equal and opposite reaction.",
      topic: "Classical Mechanics",
      difficulty: 0.6,
    },
    {
      id: "p4",
      articleId: "6",
      question: "What is momentum?",
      options: [
        "Force times distance",
        "Mass times velocity",
        "Force times time",
        "Mass times acceleration",
      ],
      correctAnswer: 1,
      explanation: "Momentum is defined as mass times velocity (p = mv).",
      topic: "Classical Mechanics",
      difficulty: 0.7,
    },
    {
      id: "p5",
      articleId: "6",
      question: "What is kinetic energy?",
      options: [
        "Energy of motion",
        "Energy of position",
        "Heat energy",
        "Potential energy",
      ],
      correctAnswer: 0,
      explanation:
        "Kinetic energy is the energy that an object possesses due to its motion.",
      topic: "Energy",
      difficulty: 0.5,
    },
    {
      id: "p6",
      articleId: "7",
      question: "What is the Heisenberg Uncertainty Principle?",
      options: [
        "Energy conservation",
        "Cannot precisely know both position and momentum simultaneously",
        "Wave-particle duality",
        "Conservation of mass",
      ],
      correctAnswer: 1,
      explanation:
        "The Heisenberg Uncertainty Principle states that we cannot simultaneously know both the position and momentum of a particle with absolute precision.",
      topic: "Quantum Mechanics",
      difficulty: 0.9,
    },
    {
      id: "p7",
      articleId: "7",
      question: "What is quantum entanglement?",
      options: [
        "Wave function collapse",
        "Particle spin",
        "Correlation between quantum particles regardless of distance",
        "Energy levels in atoms",
      ],
      correctAnswer: 2,
      explanation:
        "Quantum entanglement is a phenomenon where particles become correlated and maintain this correlation regardless of distance.",
      topic: "Quantum Mechanics",
      difficulty: 0.8,
    },
    {
      id: "p8",
      articleId: "8",
      question: "What is the First Law of Thermodynamics?",
      options: [
        "Energy cannot be created or destroyed",
        "Entropy always increases",
        "Heat flows from hot to cold",
        "Work equals force times distance",
      ],
      correctAnswer: 0,
      explanation:
        "The First Law of Thermodynamics states that energy cannot be created or destroyed, only transformed.",
      topic: "Thermodynamics",
      difficulty: 0.7,
    },
    {
      id: "p9",
      articleId: "8",
      question: "What is the Second Law of Thermodynamics?",
      options: [
        "Conservation of energy",
        "Entropy of an isolated system always increases",
        "Temperature equilibrium",
        "Heat transfer direction",
      ],
      correctAnswer: 1,
      explanation:
        "The Second Law of Thermodynamics states that the entropy of an isolated system always increases over time.",
      topic: "Thermodynamics",
      difficulty: 0.8,
    },
    {
      id: "p10",
      articleId: "9",
      question: "What is Coulomb's Law?",
      options: [
        "Law of magnetic force",
        "Electric force between charges",
        "Electromagnetic induction",
        "Conservation of charge",
      ],
      correctAnswer: 1,
      explanation:
        "Coulomb's Law describes the electric force between charged particles.",
      topic: "Electromagnetism",
      difficulty: 0.7,
    },
    {
      id: "p11",
      articleId: "9",
      question: "What is Faraday's Law?",
      options: [
        "Conservation of charge",
        "Magnetic field lines",
        "Electromagnetic induction",
        "Electric potential",
      ],
      correctAnswer: 2,
      explanation:
        "Faraday's Law describes electromagnetic induction, where changing magnetic fields induce electric currents.",
      topic: "Electromagnetism",
      difficulty: 0.8,
    },
    {
      id: "p12",
      articleId: "10",
      question: "What is the speed of light in vacuum?",
      options: ["3 × 10⁸ m/s", "2 × 10⁸ m/s", "1 × 10⁸ m/s", "4 × 10⁸ m/s"],
      correctAnswer: 0,
      explanation:
        "The speed of light in vacuum is approximately 3 × 10⁸ meters per second.",
      topic: "Optics",
      difficulty: 0.6,
    },
    {
      id: "p13",
      articleId: "10",
      question: "What is interference?",
      options: [
        "Bending of light",
        "Combination of waves",
        "Reflection of light",
        "Refraction of light",
      ],
      correctAnswer: 1,
      explanation:
        "Interference is the combination of waves that results in a new wave pattern.",
      topic: "Waves",
      difficulty: 0.7,
    },
    {
      id: "p14",
      articleId: "10",
      question: "What is diffraction?",
      options: [
        "Bending of waves around obstacles",
        "Reflection of waves",
        "Wave speed",
        "Wave amplitude",
      ],
      correctAnswer: 0,
      explanation:
        "Diffraction is the bending of waves around obstacles or through openings.",
      topic: "Waves",
      difficulty: 0.7,
    },
    {
      id: "p15",
      articleId: "10",
      question: "What is polarization?",
      options: [
        "Wave reflection",
        "Wave refraction",
        "Wave oscillation in one plane",
        "Wave interference",
      ],
      correctAnswer: 2,
      explanation:
        "Polarization is the restriction of wave oscillations to a single plane.",
      topic: "Waves",
      difficulty: 0.8,
    },
  ],
  "3": [
    // Chemistry
    {
      id: "c1",
      articleId: "11",
      question: "What determines an element's atomic number?",
      options: [
        "Number of electrons",
        "Number of protons",
        "Number of neutrons",
        "Atomic mass",
      ],
      correctAnswer: 1,
      explanation:
        "An element's atomic number is determined by the number of protons in its nucleus.",
      topic: "Atomic Structure",
      difficulty: 0.5,
    },
    {
      id: "c2",
      articleId: "11",
      question: "What are isotopes?",
      options: [
        "Atoms with different numbers of protons",
        "Atoms with different numbers of electrons",
        "Atoms with different numbers of neutrons",
        "Different elements",
      ],
      correctAnswer: 2,
      explanation:
        "Isotopes are atoms of the same element with different numbers of neutrons.",
      topic: "Atomic Structure",
      difficulty: 0.6,
    },
    {
      id: "c3",
      articleId: "11",
      question: "What is the electron configuration of sodium (Na)?",
      options: ["1s²2s²2p⁶3s¹", "1s²2s²2p⁶", "1s²2s²2p⁵", "1s²2s²2p⁶3s²"],
      correctAnswer: 0,
      explanation: "Sodium's electron configuration is 1s²2s²2p⁶3s¹.",
      topic: "Electronic Structure",
      difficulty: 0.7,
    },
    {
      id: "c4",
      articleId: "11",
      question: "What is the octet rule?",
      options: [
        "Having 8 protons",
        "Having 8 neutrons",
        "Having 8 valence electrons",
        "Having 8 electron shells",
      ],
      correctAnswer: 2,
      explanation:
        "The octet rule states that atoms tend to gain, lose, or share electrons to achieve 8 valence electrons.",
      topic: "Chemical Bonding",
      difficulty: 0.6,
    },
    {
      id: "c5",
      articleId: "12",
      question: "What is an ionic bond?",
      options: [
        "Sharing of electrons",
        "Transfer of electrons",
        "Metallic bonding",
        "Hydrogen bonding",
      ],
      correctAnswer: 1,
      explanation:
        "An ionic bond is formed by the transfer of electrons from one atom to another.",
      topic: "Chemical Bonding",
      difficulty: 0.6,
    },
    {
      id: "c6",
      articleId: "12",
      question: "What is a polar covalent bond?",
      options: [
        "Equal sharing of electrons",
        "Unequal sharing of electrons",
        "Transfer of electrons",
        "No sharing of electrons",
      ],
      correctAnswer: 1,
      explanation:
        "A polar covalent bond involves the unequal sharing of electrons between atoms.",
      topic: "Chemical Bonding",
      difficulty: 0.7,
    },
    {
      id: "c7",
      articleId: "13",
      question: "What is a limiting reagent?",
      options: [
        "Catalyst",
        "Reagent that limits product formation",
        "Most abundant reagent",
        "Fastest reacting reagent",
      ],
      correctAnswer: 1,
      explanation:
        "A limiting reagent is the reactant that determines the maximum amount of product that can be formed.",
      topic: "Stoichiometry",
      difficulty: 0.8,
    },
    {
      id: "c8",
      articleId: "13",
      question: "What is the law of conservation of mass?",
      options: [
        "Mass can be created",
        "Mass can be destroyed",
        "Mass is conserved in chemical reactions",
        "Mass changes in reactions",
      ],
      correctAnswer: 2,
      explanation:
        "The law of conservation of mass states that mass is neither created nor destroyed in chemical reactions.",
      topic: "Chemical Reactions",
      difficulty: 0.6,
    },
    {
      id: "c9",
      articleId: "14",
      question: "What is pH?",
      options: [
        "Measure of temperature",
        "Measure of acidity or basicity",
        "Measure of pressure",
        "Measure of volume",
      ],
      correctAnswer: 1,
      explanation: "pH is a measure of the acidity or basicity of a solution.",
      topic: "Acids and Bases",
      difficulty: 0.5,
    },
    {
      id: "c10",
      articleId: "14",
      question: "What is a buffer?",
      options: [
        "Pure acid",
        "Pure base",
        "Solution resistant to pH changes",
        "Neutral solution",
      ],
      correctAnswer: 2,
      explanation:
        "A buffer is a solution that resists changes in pH when small amounts of acid or base are added.",
      topic: "Acids and Bases",
      difficulty: 0.8,
    },
    {
      id: "c11",
      articleId: "15",
      question: "What is an alkane?",
      options: [
        "Hydrocarbon with double bonds",
        "Hydrocarbon with single bonds only",
        "Hydrocarbon with triple bonds",
        "Aromatic hydrocarbon",
      ],
      correctAnswer: 1,
      explanation:
        "An alkane is a hydrocarbon containing only single bonds between carbon atoms.",
      topic: "Organic Chemistry",
      difficulty: 0.7,
    },
    {
      id: "c12",
      articleId: "15",
      question: "What is a functional group?",
      options: [
        "Atom arrangement that defines chemical behavior",
        "Carbon chain",
        "Single bond",
        "Double bond",
      ],
      correctAnswer: 0,
      explanation:
        "A functional group is a specific arrangement of atoms that gives a molecule its characteristic chemical behavior.",
      topic: "Organic Chemistry",
      difficulty: 0.7,
    },
    {
      id: "c13",
      articleId: "15",
      question: "What is isomerism?",
      options: [
        "Same molecular formula, different structure",
        "Different molecular formula, same structure",
        "Same structure and formula",
        "Different structure and formula",
      ],
      correctAnswer: 0,
      explanation:
        "Isomerism occurs when compounds have the same molecular formula but different structural arrangements.",
      topic: "Organic Chemistry",
      difficulty: 0.8,
    },
    {
      id: "c14",
      articleId: "15",
      question: "What is a catalyst?",
      options: [
        "Reactant",
        "Product",
        "Substance that speeds up reaction without being consumed",
        "Substance that slows down reaction",
      ],
      correctAnswer: 2,
      explanation:
        "A catalyst is a substance that increases the rate of a reaction without being consumed in the process.",
      topic: "Chemical Kinetics",
      difficulty: 0.6,
    },
    {
      id: "c15",
      articleId: "15",
      question: "What is activation energy?",
      options: [
        "Energy released in reaction",
        "Energy absorbed in reaction",
        "Minimum energy needed for reaction",
        "Maximum energy in reaction",
      ],
      correctAnswer: 2,
      explanation:
        "Activation energy is the minimum amount of energy required for a chemical reaction to occur.",
      topic: "Chemical Kinetics",
      difficulty: 0.7,
    },
  ],
};

export const getQuestionsForSession = (
  userId: string,
  subjectId: string,
): QuizQuestion[] => {
  let session = quizSessions.get(`${userId}_${subjectId}`);
  const allQuestions = quizQuestions[subjectId] || [];

  // Initialize session if it doesn't exist
  if (!session) {
    session = {
      subjectId,
      completedQuestions: [],
      currentSession: 1,
      lastSessionDate: null,
      isSubjectCompleted: false,
    };
    quizSessions.set(`${userId}_${subjectId}`, session);
  }

  // Check if subject is completed
  if (session.isSubjectCompleted) {
    return [];
  }

  // Get available questions (not completed)
  const availableQuestions = allQuestions.filter(
    (q) => !session!.completedQuestions.includes(q.id),
  );

  // If no questions left, mark subject as completed
  if (availableQuestions.length === 0) {
    session.isSubjectCompleted = true;
    quizSessions.set(`${userId}_${subjectId}`, session);
    return [];
  }

  // Get next batch of questions
  return availableQuestions.slice(0, QUESTIONS_PER_SESSION);
};

export const markQuestionComplete = (
  userId: string,
  subjectId: string,
  questionId: string,
) => {
  const sessionKey = `${userId}_${subjectId}`;
  const session = quizSessions.get(sessionKey);

  if (session) {
    session.completedQuestions.push(questionId);
    if (session.completedQuestions.length >= quizQuestions[subjectId].length) {
      session.isSubjectCompleted = true;
    }
    session.lastSessionDate = new Date();
    quizSessions.set(sessionKey, session);
  }
};

export const getSessionProgress = (
  userId: string,
  subjectId: string,
): { completed: number; total: number; currentSession: number } => {
  const session = quizSessions.get(`${userId}_${subjectId}`);
  const totalQuestions = quizQuestions[subjectId]?.length || 0;

  return {
    completed: session?.completedQuestions.length || 0,
    total: totalQuestions,
    currentSession: session?.currentSession || 1,
  };
};

export const resetSubjectProgress = (userId: string, subjectId: string) => {
  quizSessions.delete(`${userId}_${subjectId}`);
};
