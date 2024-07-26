// script.js
document.addEventListener('DOMContentLoaded', () => {
    const currentDigitalClock = document.getElementById('current-digital-clock');
    const currentAnalogClock = document.getElementById('current-analog-clock');
    const futureDigitalClock = document.getElementById('future-digital-clock');
    const futureAnalogClock = document.getElementById('future-analog-clock');
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');

    let futureOffset = 20 * 60 * 60 * 1000; // 初期値: 20時間後

    function updateCurrentTime() {
        const now = new Date();
        currentDigitalClock.textContent = formatDate(now);
        drawClock(currentAnalogClock, now);
    }

    function updateFutureTime() {
        const now = new Date();
        const futureTime = new Date(now.getTime() + futureOffset);
        futureDigitalClock.textContent = formatDate(futureTime);
        drawClock(futureAnalogClock, futureTime);
    }

    function formatDate(date) {
        return date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    function drawClock(canvas, time) {
        const ctx = canvas.getContext('2d');
        const radius = canvas.height / 2;
        ctx.translate(radius, radius);
        ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        drawTime(ctx, radius, time);
        ctx.translate(-radius, -radius);
    }

    function drawFace(ctx, radius) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = radius * 0.1;
        ctx.stroke();
    }

    function drawNumbers(ctx, radius) {
        ctx.font = radius * 0.15 + 'px arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        for (let num = 1; num <= 12; num++) {
            const ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }
    }

    function drawTime(ctx, radius, time) {
        const hour = time.getHours();
        const minute = time.getMinutes();
        const second = time.getSeconds();
        const hourHandLength = radius * 0.5;
        const minuteHandLength = radius * 0.8;
        const secondHandLength = radius * 0.9;

        // Hour
        const hourAngle = (hour % 12) * Math.PI / 6 + minute * Math.PI / 360 + second * Math.PI / 21600;
        drawHand(ctx, hourAngle, hourHandLength, radius * 0.07);

        // Minute
        const minuteAngle = minute * Math.PI / 30 + second * Math.PI / 1800;
        drawHand(ctx, minuteAngle, minuteHandLength, radius * 0.07);

        // Second
        const secondAngle = second * Math.PI / 30;
        drawHand(ctx, secondAngle, secondHandLength, radius * 0.02);
    }

    function drawHand(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    function updateFutureOffset() {
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        futureOffset = (hours * 60 + minutes) * 60 * 1000;
    }

    hoursInput.addEventListener('input', () => {
        updateFutureOffset();
        updateFutureTime();
    });

    minutesInput.addEventListener('input', () => {
        updateFutureOffset();
        updateFutureTime();
    });

    setInterval(() => {
        updateCurrentTime();
        updateFutureTime();
    }, 1000);

    updateCurrentTime();
    updateFutureTime();
});