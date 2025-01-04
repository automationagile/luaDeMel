const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

// Middleware to parse JSON and URL-encoded body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static('public'));

// Questions and answers stored securely on the server
const questions = [
  { question: "What is 2 + 2?", answer: "4" },
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What color is the sky on a clear day?", answer: "Blue" },
  { question: "What is 5 x 5?", answer: "25" },
  { question: "What is the square root of 16?", answer: "4" },
  { question: "What is the chemical symbol for water?", answer: "H2O" },
];

// Serve a question based on its index
app.get('/question', (req, res) => {
  const index = parseInt(req.query.index, 10);

  if (index < questions.length) {
    const question = questions[index];
    res.json({ question: question.question });
  } else {
    res.status(404).send('No more questions.');
  }
});

const failImages = [
  "error1.png",
  "error2.png",
  "error3.png",
  "error4.png",
  "error5.png",
];

// Validate the user's answer
app.post('/answer', (req, res) => {
  const index = parseInt(req.query.index, 10);
  const userAnswer = req.body.answer;

  if (index < questions.length) {
    const correctAnswer = questions[index].answer;
    if (userAnswer && userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      res.json({ correct: true });
    } else {
      // Pick a random fail image
      const randomImage = failImages[Math.floor(Math.random() * failImages.length)];
      res.json({
        correct: false,
        message: "Grandes nabos! Com essa resposta quem vai aproveitar a viagem somos nós.",
        imageUrl: randomImage, // Send the random image URL
      });
    }
  } else {
    res.status(404).send('Invalid question index.');
  }
});

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to download the PDF
app.get('/download/doc1', (req, res) => {
  res.download(path.join(__dirname, 'public', 'viagem.pdf'), 'viagem.pdf');
});
app.get('/download/doc2', (req, res) => {
  res.download(path.join(__dirname, 'public', 'seguro.pdf'), 'seguro.pdf');
});
app.get('/download/doc3', (req, res) => {
  res.download(path.join(__dirname, 'public', 'atividade.pdf'), 'atividade.pdf');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
