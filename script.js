let score = 0;
let correctAnswers = 0;
const targetCorrectAnswers = 5; // Respuestas necesarias para subir de nivel
let level = 1;
let currentQuestion;
let currentAnswer;
let selectedTable = 2; // Tabla inicial
let errors = []; // Lista de errores pendientes

function startGame() {
    correctAnswers = 0;
    document.getElementById("score").textContent = "Puntaje: $" + score;
    document.getElementById("level").textContent = "Nivel: " + level;
    generateQuestion();
    document.getElementById("answer").focus(); // Enfocar en el campo de respuesta
}

function generateQuestion() {
    if (errors.length > 0) {
        // Prioriza resolver errores pendientes
        const nextError = errors[0];
        currentQuestion = nextError.question;
        currentAnswer = nextError.correctAnswer;
    } else {
        const num = Math.floor(Math.random() * 11); // Número aleatorio entre 0 y 10
        currentQuestion = `¿Cuánto es ${selectedTable} x ${num}?`;
        currentAnswer = selectedTable * num;
    }
    document.getElementById("question").textContent = currentQuestion;
    document.getElementById("message").textContent = "";
    document.getElementById("answer").value = ""; // Limpiar respuesta
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById("answer").value);
    const gameDiv = document.getElementById("game");
    if (userAnswer === currentAnswer) {
        // Respuesta correcta
        score += 10;
        correctAnswers++;
        document.getElementById("score").textContent = "Puntaje: $" + score;
        gameDiv.classList.add("correct");
        setTimeout(() => gameDiv.classList.remove("correct"), 500);

        // Eliminar el error si se resolvió
        const resolvedIndex = errors.findIndex(error => error.correctAnswer === currentAnswer);
        if (resolvedIndex !== -1) {
            errors.splice(resolvedIndex, 1);
            updateErrorList();
        }

        if (correctAnswers >= targetCorrectAnswers) {
            level++;
            correctAnswers = 0;
            document.getElementById("level").textContent = "Nivel: " + level;
            document.getElementById("message").textContent = "¡Excelente! Has subido de nivel.";
            setTimeout(() => document.getElementById("message").textContent = "", 2000);
        }
        generateQuestion();
    } else {
        // Respuesta incorrecta
        document.getElementById("message").textContent = "¡Incorrecto! Pierdes todo. Sigue intentándolo.";
        score = 0;
        correctAnswers = 0;
        document.getElementById("score").textContent = "Puntaje: $" + score;
        document.getElementById("level").textContent = "Nivel: " + level;
        gameDiv.classList.add("incorrect");
        setTimeout(() => gameDiv.classList.remove("incorrect"), 500);

        // Registrar el error si no existe ya en la lista
        const existingError = errors.find(error => error.correctAnswer === currentAnswer);
        if (!existingError) {
            errors.push({ question: currentQuestion, correctAnswer: currentAnswer });
            updateErrorList();
        }
    }
}

function updateErrorList() {
    const errorList = document.getElementById("errorList");
    errorList.innerHTML = ""; // Limpiar la lista actual
    errors.forEach(error => {
        const listItem = document.createElement("li");
        listItem.textContent = `${error.question} Respuesta correcta: ${error.correctAnswer}`;
        errorList.appendChild(listItem);
    });
}

function changeTable() {
    selectedTable = parseInt(document.getElementById("tableSelect").value);
    generateQuestion(); // Generar nueva pregunta al cambiar tabla
}

document.getElementById("answer").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});
