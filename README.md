🖥️ OS Scheduling Simulator

A simple and interactive web-based simulator to understand how different CPU scheduling algorithms work in real-time.


 📌 Table of Contents

1. [Introduction](#introduction)  
2. [Objective](#objective)  
3. [Technologies Used](#technologies-used)  
4. [Algorithms Implemented](#algorithms-implemented)  
5. [Simulator Features](#simulator-features)  
6. [Sample Use Case](#sample-use-case)  
7. [Key Learnings](#key-learnings)  
8. [Conclusion](#conclusion)

---

 🧠 Introduction

Scheduling is a core concept in operating systems. This project visualizes how CPU scheduling algorithms like FCFS, SJF, Priority, and Round Robin behave using Gantt charts and timing metrics.

---

 🎯 Objective

To bridge the gap between theory and practice by offering an easy-to-use visual simulator that demonstrates real-time scheduling behavior, performance metrics (waiting time, turnaround time), and process execution flow.

---

 🛠️ Technologies Used

- HTML5 & CSS3  
- Vanilla JavaScript  
- Chart.js  
- VS Code with Live Server (for testing)

---

 📊 Algorithms Implemented

1. FCFS (First Come First Serve)
- Simple queue-based scheduling based on arrival time.
- No priority or burst consideration.

2. SJF (Shortest Job First - Non-Preemptive)
- Picks the shortest burst process that has arrived.
- Great for optimizing average wait time.

3. Priority Scheduling (Non-Preemptive)
- Chooses the process with the highest priority (lowest number).
- Uses arrival time as tie-breaker.

4. Round Robin
- Uses time-slicing (quantum).
- Fair to all processes, good for time-sharing systems.

---

 🧩 Simulator Features

- 🔸 Dynamic input: Add processes with custom arrival, burst, and priority
- 🔸 Dropdown to select algorithm
- 🔸 Quantum field appears only when RR selected
- 🔸 Live Gantt chart generation
- 🔸 Automatic calculation of turnaround and waiting time
- 🔸 Animated transitions
