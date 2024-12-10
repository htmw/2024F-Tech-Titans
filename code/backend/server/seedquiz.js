// quizSeed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Quiz } from "./models.js";

dotenv.config();

const quizzes = [
  // Mathematics Quizzes
  {
    id: "math-1",
    title: "Advanced Mathematics",
    subject: "Mathematics",
    duration: 1800, // 30 minutes
    difficulty: "Advanced",
    xp: 50,
    questions: [
      {
        id: 1,
        question: "What is the derivative of e^x?",
        options: ["e^x", "x·e^x", "e^(x-1)", "1/e^x"],
        correctAnswer: 0,
        explanation: "The derivative of e^x is e^x.",
        points: 1,
      },
      {
        id: 2,
        question: "What is the integral of 1/x?",
        options: ["x", "ln|x| + C", "1/x² + C", "x·ln(x)"],
        correctAnswer: 1,
        explanation: "The integral of 1/x is ln|x| + C.",
        points: 1,
      },
      // (remaining questions are same as earlier for Mathematics)
    ],
  },
  {
    id: "math-2",
    title: "Calculus Fundamentals",
    subject: "Mathematics",
    duration: 1500, // 25 minutes
    difficulty: "Intermediate",
    xp: 40,
    questions: [
      {
        id: 1,
        question: "What is the derivative of x²?",
        options: ["x", "2x", "2", "x²"],
        correctAnswer: 1,
        explanation: "Using the power rule, the derivative of x² is 2x.",
        points: 1,
      },
      // (remaining questions are same as earlier for Mathematics)
    ],
  },

  // Physics Quizzes
  {
    id: "physics-1",
    title: "Quantum Mechanics",
    subject: "Physics",
    duration: 1500, // 25 minutes
    difficulty: "Advanced",
    xp: 50,
    questions: [
      {
        id: 1,
        question: "What is the Schrödinger equation used for?",
        options: [
          "Describing quantum state evolution",
          "Calculating classical momentum",
          "Measuring temperature",
          "Computing electrical resistance",
        ],
        correctAnswer: 0,
        explanation:
          "The Schrödinger equation describes how the quantum state of a physical system changes over time.",
        points: 1,
      },
      {
        id: 2,
        question: "What is the Heisenberg Uncertainty Principle?",
        options: [
          "Energy is always conserved",
          "Position and momentum cannot be simultaneously known with arbitrary precision",
          "All particles have wave-like properties",
          "Force equals mass times acceleration",
        ],
        correctAnswer: 1,
        explanation:
          "The Heisenberg Uncertainty Principle states that we cannot simultaneously know both the position and momentum of a particle with arbitrary precision.",
        points: 1,
      },
      {
        id: 3,
        question: "What does Planck's constant relate to?",
        options: [
          "Energy and momentum",
          "Energy and frequency",
          "Mass and velocity",
          "Temperature and pressure",
        ],
        correctAnswer: 1,
        explanation:
          "Planck's constant relates the energy of a photon to its frequency.",
        points: 1,
      },
      {
        id: 4,
        question: "What is a photon?",
        options: [
          "A particle of light",
          "A neutron",
          "A proton",
          "An electron",
        ],
        correctAnswer: 0,
        explanation:
          "A photon is a quantum of light or electromagnetic radiation.",
        points: 1,
      },
      {
        id: 5,
        question: "Who developed the theory of General Relativity?",
        options: [
          "Isaac Newton",
          "Albert Einstein",
          "Max Planck",
          "Niels Bohr",
        ],
        correctAnswer: 1,
        explanation:
          "Albert Einstein developed the theory of General Relativity.",
        points: 1,
      },
      {
        id: 6,
        question: "What does E=mc² represent?",
        options: [
          "Energy equals mass times acceleration squared",
          "Energy equals mass times the speed of light squared",
          "Energy equals momentum times velocity",
          "Energy equals temperature times entropy",
        ],
        correctAnswer: 1,
        explanation:
          "E=mc² means energy equals mass times the speed of light squared, a key concept in relativity.",
        points: 1,
      },
    ],
  },

  // Programming Quizzes
  {
    id: "prog-1",
    title: "Python Advanced Concepts",
    subject: "Programming",
    duration: 1800,
    difficulty: "Advanced",
    xp: 50,
    questions: [
      {
        id: 1,
        question: "What is a decorator in Python?",
        options: [
          "A type of variable",
          "A function that takes another function and extends its behavior",
          "A class attribute",
          "A type of loop",
        ],
        correctAnswer: 1,
        explanation:
          "A decorator is a function that takes another function and extends its behavior without explicitly modifying it.",
        points: 1,
      },
      {
        id: 2,
        question:
          "What is the purpose of the __init__ method in Python classes?",
        options: [
          "To initialize class variables",
          "To define class methods",
          "To delete objects",
          "To import modules",
        ],
        correctAnswer: 0,
        explanation:
          "The __init__ method is a constructor that initializes new object instances with any attributes they need at creation.",
        points: 1,
      },
      {
        id: 3,
        question: "What is the output of: print(type([]))?",
        options: [
          "<class 'list'>",
          "<class 'dict'>",
          "<class 'tuple'>",
          "Error",
        ],
        correctAnswer: 0,
        explanation:
          "An empty list `[]` in Python is of type `<class 'list'>`.",
        points: 1,
      },
      {
        id: 4,
        question: "What is Python's Global Interpreter Lock (GIL)?",
        options: [
          "A feature that allows threading",
          "A mutex that prevents multiple threads from executing Python bytecode simultaneously",
          "A mechanism for handling global variables",
          "A locking mechanism for debugging",
        ],
        correctAnswer: 1,
        explanation:
          "The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing simultaneously.",
        points: 1,
      },
      {
        id: 5,
        question: "What does 'PEP' stand for in Python?",
        options: [
          "Python Enhancement Proposal",
          "Python Execution Process",
          "Python Enterprise Program",
          "Python Element Parsing",
        ],
        correctAnswer: 0,
        explanation: "PEP stands for Python Enhancement Proposal.",
        points: 1,
      },
      {
        id: 6,
        question: "Which Python library is commonly used for data analysis?",
        options: ["NumPy", "Pandas", "Matplotlib", "Flask"],
        correctAnswer: 1,
        explanation:
          "Pandas is commonly used for data analysis due to its support for dataframes and manipulation.",
        points: 1,
      },
    ],
  },

  // Data Science Quizzes
  {
    id: "data-1",
    title: "Machine Learning Basics",
    subject: "Data Science",
    duration: 1800,
    difficulty: "Intermediate",
    xp: 50,
    questions: [
      {
        id: 1,
        question: "What is supervised learning?",
        options: [
          "Learning without any data",
          "Learning from labeled data",
          "Learning from unlabeled data",
          "Learning without a teacher",
        ],
        correctAnswer: 1,
        explanation:
          "Supervised learning is where the algorithm learns from labeled training data to make predictions.",
        points: 1,
      },
      {
        id: 2,
        question: "What is overfitting in a machine learning model?",
        options: [
          "When a model performs poorly on training data",
          "When a model performs well on all data",
          "When a model performs well on training data but poorly on new data",
          "When a model is too simple",
        ],
        correctAnswer: 2,
        explanation:
          "Overfitting occurs when a model learns the training data too well, including noise, leading to poor generalization.",
        points: 1,
      },
      {
        id: 3,
        question: "What is the role of a loss function in training a model?",
        options: [
          "To define the structure of the model",
          "To compute the difference between the predicted and actual values",
          "To adjust the weights of the model",
          "To preprocess the data",
        ],
        correctAnswer: 1,
        explanation:
          "The loss function measures the difference between the predicted and actual values, guiding the optimization process.",
        points: 1,
      },
      {
        id: 4,
        question: "Which algorithm is best suited for classification tasks?",
        options: [
          "Linear Regression",
          "K-Nearest Neighbors (KNN)",
          "K-Means Clustering",
          "Principal Component Analysis (PCA)",
        ],
        correctAnswer: 1,
        explanation:
          "K-Nearest Neighbors (KNN) is commonly used for classification tasks, as it groups similar data points.",
        points: 1,
      },
      {
        id: 5,
        question: "What does 'feature scaling' accomplish in machine learning?",
        options: [
          "Removes irrelevant features",
          "Transforms data to have a standard scale",
          "Increases the number of features",
          "Reduces overfitting",
        ],
        correctAnswer: 1,
        explanation:
          "Feature scaling transforms data to a standard scale to ensure all features contribute equally to the model.",
        points: 1,
      },
      {
        id: 6,
        question: "What is the purpose of cross-validation?",
        options: [
          "To split data into training and test sets",
          "To assess a model's performance on unseen data",
          "To train multiple models simultaneously",
          "To optimize hyperparameters",
        ],
        correctAnswer: 1,
        explanation:
          "Cross-validation evaluates a model's performance on unseen data by splitting the dataset into multiple folds for training and testing.",
        points: 1,
      },
    ],
  },
];

async function seedQuizzes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log("Cleared existing quizzes");

    // Insert new quizzes
    await Quiz.insertMany(quizzes);
    console.log("Quizzes seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding quizzes:", error);
    process.exit(1);
  }
}

seedQuizzes();
