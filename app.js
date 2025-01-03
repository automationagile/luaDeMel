const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 4000;

// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like the PDF)
app.use(express.static('public'));

// Questions and their correct answers
const questions = [
  { question: "What is 2 + 2?", answer: "4" },
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What color is the sky on a clear day?", answer: "blue" },
  { question: "What is 5 x 5?", answer: "25" },
  { question: "What is the square root of 16?", answer: "4" },
  { question: "What is the chemical symbol for water?", answer: "H2O" },
];

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit-answers', (req, res) => {
  const userAnswers = req.body['answers[]'];

  // Validate answers
  const allCorrect = questions.every((q, index) => 
    q.answer.toLowerCase() === (userAnswers[index] || "").toLowerCase()
  );

  if (allCorrect) {
    // If all answers are correct, send the PDF
    res.download(path.join(__dirname, 'public', 'example.pdf'), 'example.pdf');
  } else {
    // If answers are incorrect, redirect back to the form with an error
    res.send(`
      <script>
        alert("Some answers are incorrect. Please try again!");
        window.history.back();
      </script>
    `);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
