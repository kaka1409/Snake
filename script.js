const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;

let highScore = localStorage.getItem('highScore') || 0; // lấy data trong local storage nếu ko có thì highsscore = 0
document.getElementById('highscore').innerText = 'High Score: ' + highScore;

(function setup() {
    snake = new Snake();
    food = new Food();
    food.pickLocation();

    window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        food.draw();
        snake.update();
        snake.draw();

        if (snake.eat(food)) {
            food.pickLocation();
        }

        snake.checkCollision();
        document.getElementById('score').innerText = 'Score: ' + snake.total;

        if (snake.total > highScore) {
            highScore = snake.total;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highscore').innerText = 'High Score: ' + highScore;
        }
    }, 100); // Decrease the interval to 100ms for smoother movement
}());

window.addEventListener('keydown', evt => {
    const direction = evt.key.replace('Arrow', '');
    snake.changeDirection(direction);
});

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1; // scale = 20
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = "#4caf50";

        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }

        ctx.fillRect(this.x, this.y, scale, scale);
    };

    this.update = function() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }

        this.tail[this.total - 1] = { x: this.x, y: this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= canvas.width) {
            this.x = 0;
        }

        if (this.y >= canvas.height) {
            this.y = 0;
        }

        if (this.x < 0) {
            this.x = canvas.width - scale;
        }

        if (this.y < 0) {
            this.y = canvas.height - scale;
        }
    };

    this.changeDirection = function(direction) {
        switch (direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    this.eat = function(food) {
        if (this.x === food.x && this.y === food.y) {
            this.total++;
            return true;
        }

        return false;
    };

    this.checkCollision = function() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                this.total = 0;
                this.tail = [];
            }
        }
    };
}

function Food() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = Math.floor(Math.random() * rows) * scale;
        this.y = Math.floor(Math.random() * columns) * scale;
    };

    this.draw = function() {
            ctx.fillStyle = "#d32f2f";
            ctx.fillRect(this.x, this.y, scale, scale);
    };
}

