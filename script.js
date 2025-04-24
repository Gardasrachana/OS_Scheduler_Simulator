// script.js

let processList = [];

function addProcess() {
    const pid = document.getElementById("pid").value;
    const arrival = parseInt(document.getElementById("arrivalTime").value);
    const burst = parseInt(document.getElementById("burstTime").value);
    const priority = parseInt(document.getElementById("priority").value) || 0;

    if (!pid || isNaN(arrival) || isNaN(burst)) {
        alert("Please enter valid PID, Arrival Time and Burst Time.");
        return;
    }

    const process = {
        pid,
        arrival,
        burst,
        priority
    };

    processList.push(process);
    displayProcesses();

    // Clear input fields
    document.getElementById("pid").value = "";
    document.getElementById("arrivalTime").value = "";
    document.getElementById("burstTime").value = "";
    document.getElementById("priority").value = "";
}

function clearProcesses() {
    processList = [];
    displayProcesses();
    document.getElementById("ganttChart").innerHTML = "";
}

function displayProcesses() {
    const tableBody = document.querySelector("#resultTable tbody");
    tableBody.innerHTML = "";

    for (const p of processList) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${p.pid}</td>
            <td>${p.arrival}</td>
            <td>${p.burst}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        `;

        tableBody.appendChild(row);
    }
}

// ---------------- Simulation Selector ----------------

function simulate() {
    const algorithm = document.getElementById("algorithm").value;

    if (processList.length === 0) {
        alert("No processes to simulate!");
        return;
    }

    if (algorithm === "fcfs") {
        runFCFS();
    } else if (algorithm === "sjf") {
        runSJF();
    } else if (algorithm === "priority") {
        runPriority();
    } else if (algorithm === "rr") {
        const quantum = parseInt(document.getElementById("quantum").value);
        if (isNaN(quantum) || quantum <= 0) {
            alert("Please enter a valid quantum time!");
            return;
        }
        runRoundRobin(quantum);
    } else {
        alert("Invalid algorithm selected.");
    }
}

// ---------------- FCFS Simulation ----------------

function runFCFS() {
    const sortedList = [...processList].sort((a, b) => a.arrival - b.arrival);

    let currentTime = 0;
    const resultRows = [];

    for (const p of sortedList) {
        if (currentTime < p.arrival) {
            currentTime = p.arrival;
        }

        const completion = currentTime + p.burst;
        const turnaround = completion - p.arrival;
        const waiting = turnaround - p.burst;

        resultRows.push({
            ...p,
            completion,
            turnaround,
            waiting
        });

        currentTime = completion;
    }

    displaySimulation(resultRows);
    drawGanttChart(resultRows);
}

// ---------------- SJF Simulation ----------------

function runSJF() {
    const processes = [...processList].map(p => ({ ...p, done: false }));
    const completed = [];
    let currentTime = 0;

    while (completed.length < processes.length) {
        const available = processes.filter(p => p.arrival <= currentTime && !p.done);

        if (available.length === 0) {
            currentTime++;
            continue;
        }

        available.sort((a, b) => a.burst - b.burst);
        const p = available[0];
        p.done = true;

        const completion = currentTime + p.burst;
        const turnaround = completion - p.arrival;
        const waiting = turnaround - p.burst;

        completed.push({
            ...p,
            completion,
            turnaround,
            waiting
        });

        currentTime = completion;
    }

    displaySimulation(completed);
    drawGanttChart(completed);
}

// ---------------- Priority Scheduling ----------------

function runPriority() {
    const processes = [...processList].map(p => ({ ...p, done: false }));
    const completed = [];
    let currentTime = 0;

    while (completed.length < processes.length) {
        const available = processes.filter(p => p.arrival <= currentTime && !p.done);

        if (available.length === 0) {
            currentTime++;
            continue;
        }

        available.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival);
        const p = available[0];
        p.done = true;

        const completion = currentTime + p.burst;
        const turnaround = completion - p.arrival;
        const waiting = turnaround - p.burst;

        completed.push({
            ...p,
            completion,
            turnaround,
            waiting
        });

        currentTime = completion;
    }

    displaySimulation(completed);
    drawGanttChart(completed);
}

// ---------------- Round Robin Simulation ----------------

function runRoundRobin(quantum) {
    const processes = [...processList].map(p => ({
        ...p,
        remaining: p.burst,
        completed: false,
        start: null
    }));

    let time = 0;
    const queue = [];
    const completed = [];
    const gantt = [];

    while (completed.length < processes.length) {
        processes.forEach(p => {
            if (p.arrival <= time && !queue.includes(p) && p.remaining > 0 && !p.completed) {
                queue.push(p);
            }
        });

        if (queue.length === 0) {
            gantt.push({ pid: "IDLE", burst: 1 });
            time++;
            continue;
        }

        const current = queue.shift();
        const execTime = Math.min(current.remaining, quantum);

        gantt.push({ pid: current.pid, burst: execTime });

        if (current.start === null) {
            current.start = time;
        }

        time += execTime;
        current.remaining -= execTime;

        processes.forEach(p => {
            if (p.arrival <= time && !queue.includes(p) && p.remaining > 0 && !p.completed && p !== current) {
                queue.push(p);
            }
        });

        if (current.remaining > 0) {
            queue.push(current);
        } else {
            current.completion = time;
            current.turnaround = current.completion - current.arrival;
            current.waiting = current.turnaround - current.burst;
            current.completed = true;
            completed.push(current);
        }
    }

    displaySimulation(completed);
    drawGanttChart(gantt);
}

// ---------------- Display Output ----------------

function displaySimulation(data) {
    const tableBody = document.querySelector("#resultTable tbody");
    tableBody.innerHTML = "";

    for (const p of data) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${p.pid}</td>
            <td>${p.arrival}</td>
            <td>${p.burst}</td>
            <td>${p.completion}</td>
            <td>${p.turnaround}</td>
            <td>${p.waiting}</td>
        `;

        tableBody.appendChild(row);
    }
}

function drawGanttChart(data) {
    const chart = document.getElementById("ganttChart");
    chart.innerHTML = "";

    for (const p of data) {
        const box = document.createElement("div");
        box.style.display = "inline-block";
        box.style.margin = "5px";
        box.style.padding = "10px";
        box.style.backgroundColor = p.pid === "IDLE" ? "#999" : "#28a745";
        box.style.color = "#fff";
        box.style.borderRadius = "5px";
        box.style.minWidth = "60px";
        box.style.textAlign = "center";
        box.textContent = `${p.pid} (${p.burst})`;
        chart.appendChild(box);
    }
}
