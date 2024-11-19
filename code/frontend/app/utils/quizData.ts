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
      articleId: "2",
      question: "What is the primary focus of linear algebra?",
      options: [
        "Curved spaces and surfaces",
        "Linear equations and vector spaces",
        "Differential equations",
        "Complex numbers",
      ],
      correctAnswer: 1,
      explanation:
        "Linear algebra focuses on linear equations, linear functions, and their representations through matrices and vector spaces.",
      topic: "Linear Algebra",
      difficulty: 0.6,
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
      articleId: "7",
      question: "What is the fundamental principle of quantum mechanics?",
      options: [
        "Conservation of energy",
        "Wave-particle duality",
        "Special relativity",
        "Thermodynamics",
      ],
      correctAnswer: 1,
      explanation:
        "Wave-particle duality is a fundamental principle of quantum mechanics, stating that all matter and energy exhibit both wave and particle characteristics.",
      topic: "Quantum Mechanics",
      difficulty: 0.8,
    },
  ],
  "3": [
    // Chemistry
    {
      id: "c1",
      articleId: "11",
      question: "How are elements arranged in the periodic table?",
      options: [
        "Alphabetically",
        "By atomic number",
        "By atomic mass",
        "By discovery date",
      ],
      correctAnswer: 1,
      explanation:
        "Elements in the periodic table are arranged by atomic number (number of protons) in increasing order.",
      topic: "Periodic Table",
      difficulty: 0.5,
    },
    {
      id: "c2",
      articleId: "12",
      question: "What is a covalent bond?",
      options: [
        "Transfer of electrons between atoms",
        "Sharing of electrons between atoms",
        "Force between oppositely charged ions",
        "Bond between metal atoms",
      ],
      correctAnswer: 1,
      explanation:
        "A covalent bond is formed when atoms share electrons between them.",
      topic: "Chemical Bonding",
      difficulty: 0.6,
    },
  ],
};
