import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import { Category } from '../models/Category.js';
import { Subject } from '../models/Subject.js';
import { Course } from '../models/Course.js';
import { OneShot } from '../models/OneShot.js';

const categories = [
  {
    name: 'Core Computer Science',
    slug: 'core-computer-science',
    description: 'Foundational concepts in networking, operating systems, database management, and system design.',
    order: 1
  },
  {
    name: 'Programming',
    slug: 'programming',
    description: 'Master in-demand programming languages from low-level systems to modern object-oriented paradigms.',
    order: 2
  },
  {
    name: 'AI & Machine Learning',
    slug: 'ai-machine-learning',
    description: 'Neural networks, machine learning algorithms, deep learning, and mathematical foundations.',
    order: 3
  },
  {
    name: 'Cloud & DevOps',
    slug: 'cloud-devops',
    description: 'Distributed cloud architectures, containerization, orchestration, and infrastructure as code.',
    order: 4
  },
  {
    name: 'Development',
    slug: 'development',
    description: 'Full stack development, APIs, reactive frontend frameworks, and production architectures.',
    order: 5
  },
  {
    name: 'Cyber Security',
    slug: 'cyber-security',
    description: 'Defensive security, ethical hacking, cryptography, and network defense.',
    order: 6
  }
];

const subjects = [
  {
    name: 'Computer Networks',
    slug: 'computer-networks',
    description: 'Master network architectures, OSI & TCP/IP models, routing protocols, transport layer flows, and socket communication.',
    icon: 'Network',
    category: 'Core Computer Science',
    featured: true,
    order: 1,
    popularTopics: ['OSI Model', 'TCP/IP 4-Layer Architecture', 'Subnetting & CIDR', 'Routing Algorithms (Dijkstra/Bellman-Ford)', 'Congestion Control', 'DNS & HTTP/3']
  },
  {
    name: 'Operating Systems',
    slug: 'operating-systems',
    description: 'Learn process management, CPU scheduling, synchronization, deadlocks, virtual memory, and file systems architecture.',
    icon: 'Cpu',
    category: 'Core Computer Science',
    featured: true,
    order: 2,
    popularTopics: ['Process vs Thread', 'CPU Scheduling Algorithms', 'Semaphores & Mutex', 'Banker Algorithm & Deadlock', 'Paging & Virtual Memory', 'Page Replacement Policies']
  },
  {
    name: 'DBMS',
    slug: 'dbms',
    description: 'Comprehensive study of relational databases, SQL queries, normalization, ACID properties, indexing, and transaction management.',
    icon: 'Database',
    category: 'Core Computer Science',
    featured: true,
    order: 3,
    popularTopics: ['ER Modeling & Relational Algebra', 'SQL Queries & Joins', 'Normalization (1NF to BCNF)', 'ACID Properties', 'B+ Tree Indexing', 'Concurrency Control & 2PL']
  },
  {
    name: 'Data Structures & Algorithms',
    slug: 'data-structures-algorithms',
    description: 'In-depth exploration of arrays, trees, graphs, dynamic programming, sorting, and algorithmic complexity analysis.',
    icon: 'Binary',
    category: 'Core Computer Science',
    featured: true,
    order: 4,
    popularTopics: ['Asymptotic Time Complexity', 'Binary Search Trees & AVL', 'Graph Traversals (BFS/DFS)', 'Dynamic Programming', 'Tries & Disjoint Sets', 'Heap & Priority Queues']
  },
  {
    name: 'Compiler Design',
    slug: 'compiler-design',
    description: 'Explore the phases of compiler construction: lexical analysis, syntax parsing, semantic checking, and intermediate code generation.',
    icon: 'Layers',
    category: 'Core Computer Science',
    featured: false,
    order: 5,
    popularTopics: ['Lexical Analysis & DFA', 'LL(1) & LR(1) Parsers', 'Syntax Directed Translation', 'Type Checking', 'Intermediate Code Generation', 'Code Optimization']
  },
  {
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    description: 'Understand cloud service models (IaaS, PaaS, SaaS), virtualization, AWS/GCP architecture, serverless, and cloud resilience.',
    icon: 'Cloud',
    category: 'Cloud & DevOps',
    featured: true,
    order: 6,
    popularTopics: ['IaaS vs PaaS vs SaaS', 'Virtualization & Hypervisors', 'AWS Core Infrastructure', 'Docker & Microservices', 'Serverless Functions', 'Cloud Security & IAM']
  },
  {
    name: 'Machine Learning',
    slug: 'machine-learning',
    description: 'Supervised learning, unsupervised clustering, regression models, gradient descent, neural networks, and model evaluation.',
    icon: 'BrainCircuit',
    category: 'AI & Machine Learning',
    featured: true,
    order: 7,
    popularTopics: ['Linear & Logistic Regression', 'Gradient Descent Optimization', 'Decision Trees & Random Forests', 'Support Vector Machines', 'K-Means Clustering', 'Neural Networks & Backprop']
  },
  {
    name: 'Java',
    slug: 'java',
    description: 'Object-oriented programming in Java, Collections Framework, Multithreading, JVM architecture, Memory management, and Streams API.',
    icon: 'Code',
    category: 'Programming',
    featured: false,
    order: 8,
    popularTopics: ['OOP Principles (Polymorphism/Inheritance)', 'Collections Framework', 'Multithreading & Concurrency', 'JVM Memory (Heap/Stack/GC)', 'Java 8 Streams & Lambdas', 'Exception Handling']
  }
];

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('[Seed] Connected.');

    console.log('[Seed] Cleaning old collection data & indexes...');
    try {
      await Promise.all([
        Category.collection.drop().catch(() => {}),
        Subject.collection.drop().catch(() => {}),
        Course.collection.drop().catch(() => {}),
        OneShot.collection.drop().catch(() => {})
      ]);
    } catch (e) {
      console.log('[Seed] Collection drop notice:', e);
    }

    // Ensure models create indexes with language_override: 'none'
    await Promise.all([
      Category.createIndexes(),
      Subject.createIndexes(),
      Course.createIndexes(),
      OneShot.createIndexes()
    ]);

    console.log('[Seed] Inserting Categories...');
    await Category.insertMany(categories);

    console.log('[Seed] Inserting Subjects...');
    const insertedSubjects = await Subject.insertMany(subjects);
    const subjectMap = new Map<string, mongoose.Types.ObjectId>();
    insertedSubjects.forEach((s) => subjectMap.set(s.slug, s._id as mongoose.Types.ObjectId));

    console.log('[Seed] Inserting Courses...');
    const coursesData = [
      {
        title: 'Computer Networks Full Course for Beginners',
        slug: 'computer-networks-full-course',
        description: 'Complete end-to-end curriculum on computer networking fundamentals, covering the OSI 7-layer model, TCP/IP, IP addressing, socket programming, routing protocols, and web protocols.',
        subject: subjectMap.get('computer-networks'),
        subjectSlug: 'computer-networks',
        instructor: 'Prof. David J. Malan & NetworkChuck',
        thumbnail: 'https://img.youtube.com/vi/qiQR5rTSshw/hqdefault.jpg',
        level: 'Beginner',
        language: 'English',
        totalDuration: '9h 25m',
        totalLessons: 8,
        featured: true,
        tags: ['Networking', 'OSI Model', 'TCP/IP', 'Routing', 'Subnetting'],
        modules: [
          {
            title: 'Module 1: Fundamentals & Network Models',
            description: 'Core concepts of network topologies, protocol layers, and the standard models.',
            order: 1,
            lessons: [
              {
                title: '01. Introduction to Computer Networking',
                description: 'What is a computer network? LAN vs WAN vs MAN, topologies, and basic communication principles.',
                youtubeVideoId: 'qiQR5rTSshw',
                duration: '1h 12m',
                order: 1,
                important: true,
                resources: [
                  { title: 'OSI Reference Guide PDF', url: 'https://en.wikipedia.org/wiki/OSI_model' },
                  { title: 'RFC 1122 - Requirements for Internet Hosts', url: 'https://datatracker.ietf.org/doc/html/rfc1122' }
                ]
              },
              {
                title: '02. OSI 7 Layer Model Explained in Depth',
                description: 'Detailed breakdown of Physical, Data Link, Network, Transport, Session, Presentation, and Application layers.',
                youtubeVideoId: '7_LPdttKXPc',
                duration: '45m',
                order: 2,
                important: true,
                resources: [
                  { title: 'OSI Model Cheat Sheet', url: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/' }
                ]
              },
              {
                title: '03. TCP/IP Suite vs OSI Model',
                description: 'Mapping the 4-layer architectural model of the Internet to the 7-layer theoretical standard.',
                youtubeVideoId: 'PpsEaqJV_A0',
                duration: '35m',
                order: 3,
                important: false,
                resources: []
              }
            ]
          },
          {
            title: 'Module 2: Network Layer & IP Addressing',
            description: 'IP v4/v6 addressing, subnet masks, CIDR notation, and packet routing.',
            order: 2,
            lessons: [
              {
                title: '04. IPv4 Addressing and Subnetting Made Easy',
                description: 'Binary to decimal IP conversions, classful vs classless CIDR subnet calculations, and default gateways.',
                youtubeVideoId: 's_Ntt6eTn94',
                duration: '1h 20m',
                order: 4,
                important: true,
                resources: [
                  { title: 'Subnet Calculator Reference', url: 'https://www.subnet-calculator.com/' }
                ]
              },
              {
                title: '05. Routing Protocols: OSPF, BGP & Distance Vector',
                description: 'Interior vs exterior gateway protocols, Dijkstra shortest path algorithm, and Autonomous Systems.',
                youtubeVideoId: '2b_3Xp8E-7I',
                duration: '1h 05m',
                order: 5,
                important: true,
                resources: []
              }
            ]
          },
          {
            title: 'Module 3: Transport & Application Layers',
            description: 'Reliable transport, 3-way handshakes, UDP streaming, and modern protocols.',
            order: 3,
            lessons: [
              {
                title: '06. TCP 3-Way Handshake & Flow Control',
                description: 'SYN, SYN-ACK, ACK sequence numbers, sliding window protocol, and congestion control mechanisms.',
                youtubeVideoId: 'F27PLin3TV0',
                duration: '52m',
                order: 6,
                important: true,
                resources: [
                  { title: 'TCP Sliding Window RFC 793', url: 'https://datatracker.ietf.org/doc/html/rfc793' }
                ]
              },
              {
                title: '07. UDP vs TCP: Deep Architectural Comparison',
                description: 'When to choose connectionless low-latency transport over guaranteed ordered delivery.',
                youtubeVideoId: 'Vdc8TCESIg8',
                duration: '38m',
                order: 7,
                important: false,
                resources: []
              },
              {
                title: '08. DNS, DHCP, HTTP/2 & HTTP/3 Protocol Stack',
                description: 'Recursive DNS resolvers, dynamic IP leasing with DORA, TLS 1.3 handshake, and QUIC over UDP.',
                youtubeVideoId: 'Wj0od2ag5sk',
                duration: '1h 15m',
                order: 8,
                important: true,
                resources: [
                  { title: 'Cloudflare DNS Overview', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/' }
                ]
              }
            ]
          }
        ]
      },
      {
        title: 'Operating Systems: Architecture & Internals',
        slug: 'operating-systems-architecture',
        description: 'Complete university-grade course covering OS kernel design, process states, POSIX threads, synchronization primitives, deadlock avoidance, virtual memory paging, and storage subsystems.',
        subject: subjectMap.get('operating-systems'),
        subjectSlug: 'operating-systems',
        instructor: 'Neso Academy & Sanchit Jain',
        thumbnail: 'https://img.youtube.com/vi/vBURTt97EkA/hqdefault.jpg',
        level: 'Intermediate',
        language: 'English',
        totalDuration: '10h 15m',
        totalLessons: 7,
        featured: true,
        tags: ['OS', 'Kernel', 'Processes', 'Threads', 'Virtual Memory', 'Deadlocks'],
        modules: [
          {
            title: 'Module 1: Process Management & CPU Scheduling',
            description: 'Process life cycle, PCB, context switching, and scheduling algorithms.',
            order: 1,
            lessons: [
              {
                title: '01. Operating System Architecture & Dual-Mode Operations',
                description: 'Kernel mode vs User mode, system calls mechanism, interrupt handling, and monolithic vs microkernels.',
                youtubeVideoId: 'vBURTt97EkA',
                duration: '1h 10m',
                order: 1,
                important: true,
                resources: [
                  { title: 'OS Concepts Silberschatz Chapter 1', url: 'https://os-book.com/' }
                ]
              },
              {
                title: '02. Process Control Block & Context Switching',
                description: 'Process states (New, Ready, Running, Waiting, Terminated), PCB structures, and CPU switch latency.',
                youtubeVideoId: 'OrM7nZcxXZU',
                duration: '48m',
                order: 2,
                important: false,
                resources: []
              },
              {
                title: '03. CPU Scheduling Algorithms (FCFS, SJF, Round Robin, Priority)',
                description: 'Comparative calculation of Turnaround Time, Waiting Time, Response Time, and Gantt charts.',
                youtubeVideoId: 'EWkqlLflcr0',
                duration: '1h 30m',
                order: 3,
                important: true,
                resources: []
              }
            ]
          },
          {
            title: 'Module 2: Process Synchronization & Deadlocks',
            description: 'Critical section problem, semaphores, monitors, and deadlock handling.',
            order: 2,
            lessons: [
              {
                title: '04. Critical Section Problem & Peterson Solution',
                description: 'Mutual exclusion, progress, bounded waiting criteria, and hardware-assisted synchronization.',
                youtubeVideoId: 'ut587q_T8dM',
                duration: '1h 05m',
                order: 4,
                important: true,
                resources: []
              },
              {
                title: '05. Semaphores, Mutex & Classical Sync Problems',
                description: 'Counting vs Binary Semaphores, Dining Philosophers, Producer-Consumer, and Readers-Writers.',
                youtubeVideoId: 'ukM_zzrIeXs',
                duration: '1h 15m',
                order: 5,
                important: true,
                resources: []
              },
              {
                title: '06. Deadlocks: 4 Conditions & Banker Algorithm',
                description: 'Resource allocation graphs, deadlock prevention, detection, and avoidance with safety algorithm.',
                youtubeVideoId: 'UVo9mUbPtEQ',
                duration: '1h 22m',
                order: 6,
                important: true,
                resources: []
              }
            ]
          },
          {
            title: 'Module 3: Memory Management & Paging',
            description: 'Logical to physical address translation, paging, TLB, and page replacement.',
            order: 3,
            lessons: [
              {
                title: '07. Virtual Memory, Paging, TLB & Inverted Page Tables',
                description: 'Page tables, page faults handling, TLB hits/misses, FIFO, LRU, and Optimal page replacement algorithms.',
                youtubeVideoId: 'qlH4-oHnBb8',
                duration: '1h 45m',
                order: 7,
                important: true,
                resources: []
              }
            ]
          }
        ]
      },
      {
        title: 'Complete DBMS & SQL Masterclass',
        slug: 'complete-dbms-sql-masterclass',
        description: 'Comprehensive course covering relational database systems, SQL query construction, schema design, normalization from 1NF to BCNF, transactions, and indexing.',
        subject: subjectMap.get('dbms'),
        subjectSlug: 'dbms',
        instructor: 'Love Babbar & Gate Smashers',
        thumbnail: 'https://img.youtube.com/vi/kBdlM6hNDAE/hqdefault.jpg',
        level: 'Beginner',
        language: 'English',
        totalDuration: '8h 50m',
        totalLessons: 6,
        featured: true,
        tags: ['DBMS', 'SQL', 'Normalization', 'Relational Database', 'ACID', 'Transactions'],
        modules: [
          {
            title: 'Module 1: Relational Model & SQL',
            description: 'Core concepts of schemas, ER diagrams, and practical SQL operations.',
            order: 1,
            lessons: [
              {
                title: '01. DBMS Architecture & 3-Schema Level',
                description: 'Physical, Logical, and View levels. Data independence and relational model essentials.',
                youtubeVideoId: 'kBdlM6hNDAE',
                duration: '1h 15m',
                order: 1,
                important: true,
                resources: []
              },
              {
                title: '02. Master SQL Queries: Joins, Group By, Subqueries',
                description: 'Inner, Left, Right, Full Outer joins, aggregate functions, HAVING clause, and nested queries.',
                youtubeVideoId: 'HXV3zeQKqGY',
                duration: '2h 10m',
                order: 2,
                important: true,
                resources: [
                  { title: 'SQL Practice Exercises', url: 'https://sqlzoo.net/' }
                ]
              }
            ]
          },
          {
            title: 'Module 2: Normalization & Functional Dependencies',
            description: 'Eliminating anomalies and designing clean schemas.',
            order: 2,
            lessons: [
              {
                title: '03. Functional Dependencies & Attribute Closure',
                description: 'Finding candidate keys, prime vs non-prime attributes, and Armstrong axioms.',
                youtubeVideoId: 'p3qvj9hzk_k',
                duration: '1h 10m',
                order: 3,
                important: true,
                resources: []
              },
              {
                title: '04. Normal Forms: 1NF, 2NF, 3NF, BCNF Step by Step',
                description: 'Full functional dependencies, transitive dependencies, lossy vs lossless decomposition.',
                youtubeVideoId: 'GFQaEYEc8_8',
                duration: '1h 35m',
                order: 4,
                important: true,
                resources: []
              }
            ]
          },
          {
            title: 'Module 3: Transactions & Concurrency Control',
            description: 'ACID properties, schedules, and serializability.',
            order: 3,
            lessons: [
              {
                title: '05. ACID Properties & Transaction States',
                description: 'Atomicity, Consistency, Isolation, Durability. Active, Partially Committed, and Aborted states.',
                youtubeVideoId: '5YDCa_bVff0',
                duration: '50m',
                order: 5,
                important: false,
                resources: []
              },
              {
                title: '06. Conflict Serializability & Two-Phase Locking (2PL)',
                description: 'Precedence graph method for conflict serializability, strict 2PL, and deadlock handling.',
                youtubeVideoId: '1UwwqDqgWlE',
                duration: '1h 10m',
                order: 6,
                important: true,
                resources: []
              }
            ]
          }
        ]
      },
      {
        title: 'Data Structures & Algorithms in C++ / Java',
        slug: 'data-structures-and-algorithms-mastery',
        description: 'Complete foundation in algorithmic thinking: big-O analysis, linked lists, binary trees, heaps, dynamic programming, and graph algorithms with practical coding examples.',
        subject: subjectMap.get('data-structures-algorithms'),
        subjectSlug: 'data-structures-algorithms',
        instructor: 'Striver (Take U Forward)',
        thumbnail: 'https://img.youtube.com/vi/rZ41y93P2Qo/hqdefault.jpg',
        level: 'All Levels',
        language: 'English',
        totalDuration: '14h 20m',
        totalLessons: 7,
        featured: true,
        tags: ['DSA', 'Algorithms', 'Binary Trees', 'Graphs', 'Dynamic Programming', 'Recursion'],
        modules: [
          {
            title: 'Module 1: Complexity & Linear Structures',
            description: 'Time/space bounds and foundational structures.',
            order: 1,
            lessons: [
              {
                title: '01. Time & Space Complexity Masterclass',
                description: 'Big-O, Big-Omega, Big-Theta, asymptotic analysis of iterative and recursive algorithms.',
                youtubeVideoId: 'FPu9Uld7W-E',
                duration: '1h 15m',
                order: 1,
                important: true,
                resources: []
              },
              {
                title: '02. Arrays, Strings & Two Pointer Patterns',
                description: 'Kadane algorithm, Dutch National Flag, sliding window, and two pointer techniques.',
                youtubeVideoId: '37E9ckMDdTk',
                duration: '1h 45m',
                order: 2,
                important: false,
                resources: []
              }
            ]
          },
          {
            title: 'Module 2: Trees & Hierarchical Structures',
            description: 'Binary trees, traversal, BST, and balancing.',
            order: 2,
            lessons: [
              {
                title: '03. Binary Trees: Preorder, Inorder, Postorder & Level Order',
                description: 'Iterative vs recursive traversals, diameter of tree, boundary traversals, and lowest common ancestor.',
                youtubeVideoId: '_ANrF3FJm7I',
                duration: '2h 10m',
                order: 3,
                important: true,
                resources: []
              },
              {
                title: '04. Binary Search Trees & AVL Balancing',
                description: 'Search, insertion, deletion in BST, LCA in BST, validation, and rotation mechanics.',
                youtubeVideoId: 'pYT9F8_Lamo',
                duration: '1h 30m',
                order: 4,
                important: true,
                resources: []
              }
            ]
          },
          {
            title: 'Module 3: Graphs & Dynamic Programming',
            description: 'Graph algorithms and memoization/tabulation patterns.',
            order: 3,
            lessons: [
              {
                title: '05. Graph BFS, DFS & Cycle Detection',
                description: 'Adjacency list representation, connected components, and cycle detection in directed/undirected graphs.',
                youtubeVideoId: '-tgVpUgsQ5A',
                duration: '2h 05m',
                order: 5,
                important: true,
                resources: []
              },
              {
                title: '06. Shortest Path: Dijkstra & Bellman-Ford Algorithms',
                description: 'Priority queue implementation of Dijkstra, handling negative edges with Bellman-Ford.',
                youtubeVideoId: 'V6H1qAeB-l4',
                duration: '1h 40m',
                order: 6,
                important: true,
                resources: []
              },
              {
                title: '07. Dynamic Programming: 0/1 Knapsack & LCS Patterns',
                description: 'Overlapping subproblems, optimal substructure, 1D/2D DP table transitions, and space optimization.',
                youtubeVideoId: 'GqOmJHQZivw',
                duration: '2h 35m',
                order: 7,
                important: true,
                resources: []
              }
            ]
          }
        ]
      },
      {
        title: 'Cloud Computing & AWS Architecture Fundamentals',
        slug: 'cloud-computing-aws-fundamentals',
        description: 'Learn scalable distributed architectures on AWS: EC2 compute, S3 object storage, VPC networking, IAM security, RDS databases, and serverless Lambda functions.',
        subject: subjectMap.get('cloud-computing'),
        subjectSlug: 'cloud-computing',
        instructor: 'Andrew Brown & freeCodeCamp',
        thumbnail: 'https://img.youtube.com/vi/SOTamWNgDKc/hqdefault.jpg',
        level: 'Beginner',
        language: 'English',
        totalDuration: '7h 45m',
        totalLessons: 5,
        featured: true,
        tags: ['Cloud', 'AWS', 'VPC', 'EC2', 'S3', 'Serverless'],
        modules: [
          {
            title: 'Module 1: Cloud Concepts & Global Infrastructure',
            description: 'Regions, Availability Zones, and Compute Services.',
            order: 1,
            lessons: [
              {
                title: '01. Cloud Models (IaaS, PaaS, SaaS) & AWS Overview',
                description: 'Shared responsibility model, high availability, fault tolerance, and elasticity.',
                youtubeVideoId: 'SOTamWNgDKc',
                duration: '1h 30m',
                order: 1,
                important: true,
                resources: []
              },
              {
                title: '02. Amazon EC2 Compute & Auto Scaling Groups',
                description: 'Instance types, EBS volumes, AMI templates, and horizontal scaling policies.',
                youtubeVideoId: 'gX6O_6C_2o0',
                duration: '1h 15m',
                order: 2,
                important: true,
                resources: []
              }
            ]
          },
          {
            title: 'Module 2: Networking & Security',
            description: 'VPC subnets, routing, security groups, and IAM policies.',
            order: 2,
            lessons: [
              {
                title: '03. Amazon VPC Architecture: Subnets, NAT & Internet Gateways',
                description: 'Designing private vs public subnets, route tables, and NACLs.',
                youtubeVideoId: 'g2JOHLHh4rI',
                duration: '1h 40m',
                order: 3,
                important: true,
                resources: []
              },
              {
                title: '04. AWS IAM: Users, Roles, Policies & Least Privilege',
                description: 'Role-based access control, cross-service assumption, and policy documents JSON.',
                youtubeVideoId: 'YQdcDo_sEa8',
                duration: '50m',
                order: 4,
                important: true,
                resources: []
              }
            ]
          },
          {
            title: 'Module 3: Storage & Serverless',
            description: 'Object storage and event-driven computing.',
            order: 3,
            lessons: [
              {
                title: '05. Amazon S3 Storage Classes & AWS Lambda',
                description: 'Standard, Glacier, lifecycle rules, S3 bucket policies, and trigger-based serverless functions.',
                youtubeVideoId: 'e-5obm1G_FY',
                duration: '1h 30m',
                order: 5,
                important: true,
                resources: []
              }
            ]
          }
        ]
      },
      {
        title: 'Machine Learning from Scratch with Python',
        slug: 'machine-learning-python-course',
        description: 'Comprehensive mathematical and practical guide to Machine Learning: linear regression, classification, decision trees, support vector machines, clustering, and neural networks with Scikit-Learn.',
        subject: subjectMap.get('machine-learning'),
        subjectSlug: 'machine-learning',
        instructor: 'StatQuest & Krish Naik',
        thumbnail: 'https://img.youtube.com/vi/7eh4d6sabA0/hqdefault.jpg',
        level: 'Intermediate',
        language: 'English',
        totalDuration: '8h 20m',
        totalLessons: 5,
        featured: true,
        tags: ['ML', 'Python', 'Scikit-Learn', 'Data Science', 'Neural Networks', 'Math'],
        modules: [
          {
            title: 'Module 1: Supervised Regression & Classification',
            description: 'Foundations of predictive statistical modeling.',
            order: 1,
            lessons: [
              {
                title: '01. Linear Regression & Cost Function Mathematics',
                description: 'Ordinary Least Squares, Mean Squared Error, and Gradient Descent step size convergence.',
                youtubeVideoId: '7eh4d6sabA0',
                duration: '1h 25m',
                order: 1,
                important: true,
                resources: []
              },
              {
                title: '02. Logistic Regression & Classification Metrics',
                description: 'Sigmoid activation, cross-entropy loss, confusion matrix, Precision, Recall, and ROC-AUC.',
                youtubeVideoId: 'yIYKR4sgzI8',
                duration: '1h 30m',
                order: 2,
                important: true,
                resources: []
              }
            ]
          },
          {
            title: 'Module 2: Tree-Based Models & Clustering',
            description: 'Non-linear boundaries and unsupervised structures.',
            order: 2,
            lessons: [
              {
                title: '03. Decision Trees, Random Forests & Ensemble Learning',
                description: 'Gini impurity, Information Gain (Entropy), bagging, feature importance, and boosting intuition.',
                youtubeVideoId: '_L39rN6gz7Y',
                duration: '1h 45m',
                order: 3,
                important: true,
                resources: []
              },
              {
                title: '04. K-Means Clustering & Dimensionality Reduction (PCA)',
                description: 'Elbow method for optimal k, centroid initialization, and Principal Component Analysis variance maximization.',
                youtubeVideoId: '4b5d3muPQmA',
                duration: '1h 15m',
                order: 4,
                important: false,
                resources: []
              }
            ]
          },
          {
            title: 'Module 3: Neural Networks Foundations',
            description: 'Multilayer perceptrons and backpropagation.',
            order: 3,
            lessons: [
              {
                title: '05. Neural Networks Architecture & Backpropagation Explained',
                description: 'Perceptrons, forward propagation, chain rule gradient calculations, and loss landscape optimization.',
                youtubeVideoId: 'aircAruvnKk',
                duration: '1h 50m',
                order: 5,
                important: true,
                resources: []
              }
            ]
          }
        ]
      },
      {
        title: 'Compiler Design Complete Course',
        slug: 'compiler-design-complete-course',
        description: 'Comprehensive curriculum on compiler architecture from Knowledge Gate: Lexical Analysis, Syntax Analysis, LL(1) & LR Parsing, Syntax Directed Translation, and Code Optimization.',
        subject: subjectMap.get('compiler-design'),
        subjectSlug: 'compiler-design',
        instructor: 'Sanchit Jain (Knowledge Gate)',
        thumbnail: 'https://img.youtube.com/vi/Cb46_P12bMY/hqdefault.jpg',
        level: 'Intermediate',
        language: 'English / Hindi',
        totalDuration: '10h 30m',
        totalLessons: 6,
        featured: true,
        tags: ['Compiler Design', 'Lexical Analysis', 'Parsing', 'LL(1)', 'LR Parsing', 'GATE CS'],
        modules: [
          {
            title: 'Module 1: Introduction & Lexical Analysis',
            description: 'Phases of compiler, tokenization, regular expressions, and DFA construction.',
            order: 1,
            lessons: [
              {
                title: '01. Introduction to Compiler Design & Phases of Compiler',
                description: 'Overview of Analysis and Synthesis phases, Lexical Analyzer, Syntax Analyzer, Semantic Analyzer, and Target Code Generator.',
                youtubeVideoId: 'Cb46_P12bMY',
                duration: '45m',
                order: 1,
                important: true,
                resources: []
              },
              {
                title: '02. Lexical Analysis & Token Recognition with DFA',
                description: 'Tokens, Patterns, Lexemes, regular expressions to DFA minimization, and handling input buffering.',
                youtubeVideoId: '5k8d9n7j09w',
                duration: '1h 15m',
                order: 2,
                important: true,
                resources: []
              }
            ]
          },
          {
            title: 'Module 2: Syntax Analysis & Top-Down Parsing',
            description: 'Context-free grammars, ambiguity, First & Follow sets, and LL(1) parse table construction.',
            order: 2,
            lessons: [
              {
                title: '03. Context Free Grammars & Ambiguity Removal',
                description: 'Derivations, parse trees, resolving left recursion, and left factoring techniques.',
                youtubeVideoId: 'R9f4_p2ZfM4',
                duration: '1h 20m',
                order: 3,
                important: true,
                resources: []
              },
              {
                title: '04. First and Follow Sets & LL(1) Parsing Table',
                description: 'Systematic calculation of First and Follow sets, predictive parsing table construction, and conflict detection.',
                youtubeVideoId: 'X9T8mGk4q9c',
                duration: '1h 40m',
                order: 4,
                important: true,
                resources: []
              }
            ]
          },
          {
            title: 'Module 3: Bottom-Up Parsing & Code Generation',
            description: 'Shift-Reduce parsing, LR(0), SLR(1), CLR(1), LALR(1), and Intermediate Code Generation.',
            order: 3,
            lessons: [
              {
                title: '05. LR Parsers: LR(0), SLR(1) & LALR(1) Parsing Tables',
                description: 'Canonical collection of LR items, shift-reduce conflicts, and parsing table construction rules.',
                youtubeVideoId: 'T8mK_9pQ3v0',
                duration: '2h 10m',
                order: 5,
                important: true,
                resources: []
              },
              {
                title: '06. Syntax Directed Translation & Intermediate Code (Three-Address Code)',
                description: 'Synthesized vs inherited attributes, S-attributed vs L-attributed definitions, Quadruples, Triples, and DAG representation.',
                youtubeVideoId: 'Q5_6W9aB7c0',
                duration: '1h 35m',
                order: 6,
                important: true,
                resources: []
              }
            ]
          }
        ]
      },
      {
        title: 'Complete SQL Master Course (Database Queries to Advanced Optimization)',
        slug: 'complete-sql-master-course',
        description: 'Complete hands-on SQL course from Knowledge Gate: Basic SELECT queries, joins, subqueries, grouping, aggregate functions, DDL/DML, and query optimization.',
        subject: subjectMap.get('dbms'),
        subjectSlug: 'dbms',
        instructor: 'Sanchit Jain (Knowledge Gate)',
        thumbnail: 'https://img.youtube.com/vi/323H_mOOWQ4/hqdefault.jpg',
        level: 'All Levels',
        language: 'English / Hindi',
        totalDuration: '9h 15m',
        totalLessons: 6,
        featured: true,
        tags: ['SQL', 'DBMS', 'Relational Database', 'Joins', 'Queries', 'Knowledge Gate'],
        modules: [
          {
            title: 'Module 1: Introduction to SQL & DDL Commands',
            description: 'Relational model, CREATE, ALTER, DROP, TRUNCATE, and constraints.',
            order: 1,
            lessons: [
              {
                title: '01. Introduction to SQL & Relational Database Architecture',
                description: 'Understanding tables, schemas, data types, primary keys, foreign keys, and SQL command categories.',
                youtubeVideoId: '323H_mOOWQ4',
                duration: '50m',
                order: 1,
                important: true,
                resources: []
              },
              {
                title: '02. DDL & DML Commands: CREATE, INSERT, UPDATE, DELETE',
                description: 'Hands-on table creation, data insertion, integrity constraints (UNIQUE, NOT NULL, CHECK), and modifications.',
                youtubeVideoId: 'k7S_m9pL0Qw',
                duration: '1h 20m',
                order: 2,
                important: true,
                resources: []
              }
            ]
          },
          {
            title: 'Module 2: Querying Data & Joins',
            description: 'SELECT filtering, sorting, WHERE clause, and multi-table joins.',
            order: 2,
            lessons: [
              {
                title: '03. Master SQL Joins: INNER, LEFT, RIGHT, FULL OUTER & CROSS Joins',
                description: 'Relational join mechanics, Venn diagrams for join logic, ON vs WHERE filtering, and multi-table joining.',
                youtubeVideoId: 'HXV3zeQKqGY',
                duration: '1h 45m',
                order: 3,
                important: true,
                resources: []
              },
              {
                title: '04. Aggregations, GROUP BY, and HAVING Clause',
                description: 'COUNT, SUM, AVG, MIN, MAX calculations, grouping records, and filtering grouped datasets with HAVING.',
                youtubeVideoId: 'W8_6LqT0p9o',
                duration: '1h 15m',
                order: 4,
                important: true,
                resources: []
              }
            ]
          },
          {
            title: 'Module 3: Advanced SQL & Subqueries',
            description: 'Nested subqueries, correlated subqueries, views, and indexes.',
            order: 3,
            lessons: [
              {
                title: '05. Nested Subqueries & Correlated Queries in SQL',
                description: 'Single-row vs multi-row subqueries, IN, ANY, ALL operators, and correlated row-by-row subquery evaluation.',
                youtubeVideoId: '1UwwqDqgWlE',
                duration: '1h 35m',
                order: 5,
                important: true,
                resources: []
              },
              {
                title: '06. Views, Transactions, ACID & Indexing in SQL',
                description: 'Creating virtual views, COMMIT/ROLLBACK transaction control, Clustered vs Non-Clustered index performance tuning.',
                youtubeVideoId: 'kBdlM6hNDAE',
                duration: '1h 30m',
                order: 6,
                important: true,
                resources: []
              }
            ]
          }
        ]
      }
    ];

    await Course.insertMany(coursesData);

    console.log('[Seed] Inserting One-Shots (Revision Videos)...');
    const oneShotsData = [
      {
        title: 'Computer Networks in One Shot — Complete GATE & Semester Revision',
        slug: 'computer-networks-complete-revision-one-shot',
        description: 'Complete revision of Computer Networks in a single sitting covering OSI, TCP/IP, Subnetting, Routing algorithms, and Application protocols with formula sheets and summary charts.',
        subject: subjectMap.get('computer-networks'),
        subjectSlug: 'computer-networks',
        instructor: 'Gate Smashers',
        youtubeVideoId: 'JFF2vJaN0Cw',
        thumbnail: 'https://img.youtube.com/vi/JFF2vJaN0Cw/hqdefault.jpg',
        duration: '3h 30m',
        level: 'All Levels',
        language: 'English / Hindi',
        tags: ['Computer Networks', 'OSI', 'TCP/IP', 'Subnetting', 'One Shot', 'GATE CS'],
        featured: true
      },
      {
        title: 'Operating Systems in One Shot — Complete Marathon for Placements & Exams',
        slug: 'operating-systems-complete-marathon-one-shot',
        description: 'Comprehensive 4-hour review of process synchronization, CPU scheduling, Bankers algorithm, deadlocks, paging, and memory management algorithms.',
        subject: subjectMap.get('operating-systems'),
        subjectSlug: 'operating-systems',
        instructor: 'Knowledge Gate (Sanchit Jain)',
        youtubeVideoId: 'bkSWJJZNgf8',
        thumbnail: 'https://img.youtube.com/vi/bkSWJJZNgf8/hqdefault.jpg',
        duration: '4h 15m',
        level: 'All Levels',
        language: 'English / Hindi',
        tags: ['Operating Systems', 'Processes', 'Scheduling', 'Paging', 'One Shot', 'GATE CS'],
        featured: true
      },
      {
        title: 'DBMS Complete Revision in One Shot',
        slug: 'dbms-complete-revision-one-shot',
        description: 'High-yield revision session for DBMS: ER diagrams, functional dependencies, 1NF to BCNF normalization algorithms, conflict serializability, and transaction recovery.',
        subject: subjectMap.get('dbms'),
        subjectSlug: 'dbms',
        instructor: 'Gate Smashers',
        youtubeVideoId: '6Iu45VZGQDk',
        thumbnail: 'https://img.youtube.com/vi/6Iu45VZGQDk/hqdefault.jpg',
        duration: '2h 45m',
        level: 'All Levels',
        language: 'English / Hindi',
        tags: ['DBMS', 'SQL', 'Normalization', 'One Shot', 'GATE CS'],
        featured: true
      },
      {
        title: 'Data Structures and Algorithms in 5 Hours (Full Revision)',
        slug: 'dsa-full-revision-5-hours',
        description: 'Every essential data structure and algorithm pattern reviewed with visual animations, complexity tables, and code snippets.',
        subject: subjectMap.get('data-structures-algorithms'),
        subjectSlug: 'data-structures-algorithms',
        instructor: 'freeCodeCamp (Beau Carnes)',
        youtubeVideoId: 'zg9ih6SVACc',
        thumbnail: 'https://img.youtube.com/vi/zg9ih6SVACc/hqdefault.jpg',
        duration: '5h 15m',
        level: 'All Levels',
        language: 'English',
        tags: ['DSA', 'Algorithms', 'Interview Prep', 'One Shot'],
        featured: true
      },
      {
        title: 'Dynamic Programming Patterns in 2 Hours',
        slug: 'dynamic-programming-patterns-one-shot',
        description: 'Master the 5 core DP patterns (0/1 Knapsack, Unbounded Knapsack, Fibonacci, LCS, Matrix Chain) in one comprehensive revision session.',
        subject: subjectMap.get('data-structures-algorithms'),
        subjectSlug: 'data-structures-algorithms',
        instructor: 'NeetCode',
        youtubeVideoId: 'Hdr64lKQ3e4',
        thumbnail: 'https://img.youtube.com/vi/Hdr64lKQ3e4/hqdefault.jpg',
        duration: '2h 00m',
        level: 'Intermediate',
        language: 'English',
        tags: ['Dynamic Programming', 'LeetCode', 'Algorithms', 'Patterns'],
        featured: true
      },
      {
        title: 'AWS Certified Cloud Practitioner in 4 Hours (Full Course Revision)',
        slug: 'aws-cloud-practitioner-4-hours-revision',
        description: 'Everything required to pass the AWS Cloud Practitioner CLF-C02 exam in a single session with core architecture blueprints and billing tips.',
        subject: subjectMap.get('cloud-computing'),
        subjectSlug: 'cloud-computing',
        instructor: 'freeCodeCamp (Andrew Brown)',
        youtubeVideoId: 'SOTamWNgDKc',
        thumbnail: 'https://img.youtube.com/vi/SOTamWNgDKc/hqdefault.jpg',
        duration: '4h 10m',
        level: 'Beginner',
        language: 'English',
        tags: ['AWS', 'Cloud Practitioner', 'Certification', 'One Shot'],
        featured: true
      },
      {
        title: 'Machine Learning in 100 Minutes (Mathematical & Practical Summary)',
        slug: 'machine-learning-in-100-minutes',
        description: 'Complete high-density overview of machine learning algorithms, loss functions, optimization, and real-world evaluation metrics.',
        subject: subjectMap.get('machine-learning'),
        subjectSlug: 'machine-learning',
        instructor: 'StatQuest with Josh Starmer',
        youtubeVideoId: 'Gv9_4yMHFhI',
        thumbnail: 'https://img.youtube.com/vi/Gv9_4yMHFhI/hqdefault.jpg',
        duration: '1h 40m',
        level: 'Intermediate',
        language: 'English',
        tags: ['Machine Learning', 'Data Science', 'AI', 'StatQuest'],
        featured: true
      },
      {
        title: 'Compiler Design One Shot Revision for Exams',
        slug: 'compiler-design-one-shot-revision',
        description: 'Lexical analysis tokens, LL(1) First & Follow calculation algorithms, LR parsing tables, and Syntax Directed Definition summary in full detail.',
        subject: subjectMap.get('compiler-design'),
        subjectSlug: 'compiler-design',
        instructor: 'Knowledge Gate (Sanchit Jain)',
        youtubeVideoId: '7Tq2Amm15g8',
        thumbnail: 'https://img.youtube.com/vi/7Tq2Amm15g8/hqdefault.jpg',
        duration: '3h 30m',
        level: 'Intermediate',
        language: 'English / Hindi',
        tags: ['Compiler Design', 'Parsing', 'DFA', 'One Shot', 'GATE CS'],
        featured: true
      },
      {
        title: 'Java Full Course in 12 Hours (One-Shot Beginner to Advanced)',
        slug: 'java-full-course-one-shot',
        description: 'Master Java from syntax to OOP, memory model, multithreading, collections, lambda expressions, and file I/O in a single marathon video.',
        subject: subjectMap.get('java'),
        subjectSlug: 'java',
        instructor: 'Bro Code',
        youtubeVideoId: 'xk4_1vDrzzo',
        thumbnail: 'https://img.youtube.com/vi/xk4_1vDrzzo/hqdefault.jpg',
        duration: '12h 00m',
        level: 'Beginner',
        language: 'English',
        tags: ['Java', 'Programming', 'OOP', 'Full Course', 'One Shot'],
        featured: true
      }
    ];

    await OneShot.insertMany(oneShotsData);

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
