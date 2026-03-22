/* ═══════════════════════════════════════════════════════
   NEURAL-NETWORK CANVAS BACKGROUND ANIMATION
═══════════════════════════════════════════════════════ */
class NeuralCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx    = canvas.getContext('2d');
        this.particles = [];
        this.mouse  = { x: -9999, y: -9999 };
        this.N      = 75;
        this.LINK   = 140;   // max distance to draw a line
        this.MOUSE_R = 130;  // mouse influence radius
        this.raf    = null;
        this._init();
    }

    _init() {
        this._resize();
        window.addEventListener('resize', () => this._resize());

        const host = this.canvas.parentElement;
        host.addEventListener('mousemove', e => {
            const r = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - r.left;
            this.mouse.y = e.clientY - r.top;
        });
        host.addEventListener('mouseleave', () => {
            this.mouse.x = -9999; this.mouse.y = -9999;
        });

        for (let i = 0; i < this.N; i++) this.particles.push(this._mkParticle());
        this._loop();
    }

    _resize() {
        this.canvas.width  = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    _mkParticle() {
        return {
            x:  Math.random() * this.canvas.width,
            y:  Math.random() * this.canvas.height,
            vx: (Math.random() - .5) * .45,
            vy: (Math.random() - .5) * .45,
            r:  Math.random() * 2.2 + 1.2,
            ph: Math.random() * Math.PI * 2,
            ps: Math.random() * .025 + .008
        };
    }

    _loop() {
        const ctx = this.ctx;
        const W = this.canvas.width, H = this.canvas.height;
        ctx.clearRect(0, 0, W, H);

        /* ── update particles ── */
        for (const p of this.particles) {
            p.x  += p.vx;
            p.y  += p.vy;
            p.ph += p.ps;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;

            // gentle mouse attraction
            const dx = this.mouse.x - p.x, dy = this.mouse.y - p.y;
            const d  = Math.hypot(dx, dy);
            if (d < this.MOUSE_R) {
                const f = (this.MOUSE_R - d) / this.MOUSE_R * 0.018;
                p.vx += dx * f; p.vy += dy * f;
                const spd = Math.hypot(p.vx, p.vy);
                if (spd > 1.8) { p.vx = p.vx/spd*1.8; p.vy = p.vy/spd*1.8; }
            }
        }

        /* ── draw connections ── */
        for (let i = 0; i < this.particles.length; i++) {
            const a = this.particles[i];
            for (let j = i + 1; j < this.particles.length; j++) {
                const b = this.particles[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < this.LINK) {
                    const alpha = (1 - d / this.LINK) * .38;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
                    ctx.lineWidth = .8;
                    ctx.stroke();
                }
            }
        }

        /* ── draw particles ── */
        for (const p of this.particles) {
            const pulse = .85 + Math.sin(p.ph) * .15;
            const r = p.r * pulse;

            // soft glow
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
            g.addColorStop(0, 'rgba(59,130,246,.55)');
            g.addColorStop(1, 'rgba(37,99,235,0)');
            ctx.beginPath();
            ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
            ctx.fillStyle = g; ctx.fill();

            // core dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(37,99,235,.9)';
            ctx.fill();
        }

        this.raf = requestAnimationFrame(() => this._loop());
    }

    stop() { cancelAnimationFrame(this.raf); }
}

/* ═══════════════════════════════════════════════════════
   PORTFOLIO CLASS
═══════════════════════════════════════════════════════ */
class Portfolio {
    constructor() {
        // Section order (matches DOM order inside .sections-track)
        this.sectionOrder = ['home', 'projects', 'research', 'journey', 'contact', 'certificates'];
        this.currentIdx   = 0;
        this.neuralCanvas = null;
        this._init();
    }

    _init() {
        this._setupNavigation();
        this._setupMobileMenu();
        this._setupModalSystem();
        this._setupExpandableCards();
        this._buildScrollHint();
        this._setupArrows();
        this._setupKeyboard();
        this._initCanvas();
        this._goTo(0, false); // show home without animation on load
        this._addModalStyles();
    }

    /* ── Canvas ─────────────────────────────── */
    _initCanvas() {
        const el = document.getElementById('neuralCanvas');
        if (el) this.neuralCanvas = new NeuralCanvas(el);
    }

    /* ── Navigation ─────────────────────────── */
    _setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const id = link.getAttribute('data-section');
                const idx = this.sectionOrder.indexOf(id);
                if (idx !== -1) this._goTo(idx);
                document.querySelector('.hamburger').classList.remove('active');
                document.querySelector('.nav-menu').classList.remove('active');
            });
        });
    }

    _setupMobileMenu() {
        const hb = document.querySelector('.hamburger');
        const nm = document.querySelector('.nav-menu');
        hb.addEventListener('click', () => {
            hb.classList.toggle('active');
            nm.classList.toggle('active');
        });
    }

    _setupKeyboard() {
        document.addEventListener('keydown', e => {
            if (document.getElementById('modalOverlay').classList.contains('active')) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  this._next();
            if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    this._prev();
        });
    }

    /* ── Scroll Hint (dots + arrows) ─────────── */
    _buildScrollHint() {
        const dotsEl = document.getElementById('scrollDots');
        const visible = this.sectionOrder.filter(id => id !== 'certificates');
        visible.forEach((id, i) => {
            const dot = document.createElement('button');
            dot.className = 'scroll-dot' + (i === 0 ? ' active' : '');
            dot.title = id.charAt(0).toUpperCase() + id.slice(1);
            dot.addEventListener('click', () => {
                const realIdx = this.sectionOrder.indexOf(id);
                this._goTo(realIdx);
            });
            dotsEl.appendChild(dot);
        });
    }

    _updateDots() {
        const visible = this.sectionOrder.filter(id => id !== 'certificates');
        const dots    = document.querySelectorAll('.scroll-dot');
        const sectionId = this.sectionOrder[this.currentIdx];
        const dotIdx    = visible.indexOf(sectionId);
        dots.forEach((d, i) => d.classList.toggle('active', i === dotIdx));
    }

    _setupArrows() {
        document.getElementById('scrollLeft') .addEventListener('click', () => this._prev());
        document.getElementById('scrollRight').addEventListener('click', () => this._next());
    }

    _next() {
        // Skip certificates in normal flow
        let next = this.currentIdx + 1;
        if (this.sectionOrder[next] === 'certificates') next++;
        if (next < this.sectionOrder.length) this._goTo(next);
    }
    _prev() {
        let prev = this.currentIdx - 1;
        if (this.sectionOrder[prev] === 'certificates') prev--;
        if (prev >= 0) this._goTo(prev);
    }

    /* ── Core section switcher ─────────────── */
    _goTo(idx, animate = true) {
        this.currentIdx = idx;
        const track = document.getElementById('sectionsTrack');
        if (!animate) track.style.transition = 'none';
        track.style.transform = `translateX(-${idx * 100}vw)`;
        if (!animate) requestAnimationFrame(() => { track.style.transition = ''; });

        // Update active section class
        document.querySelectorAll('.section').forEach((s, i) => {
            s.classList.toggle('active', i === idx);
        });

        // Update nav link
        const id = this.sectionOrder[idx];
        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.toggle('active', l.getAttribute('data-section') === id);
        });

        this._updateDots();
        this._animateSection(document.getElementById(id));
    }

    _animateSection(section) {
        if (!section) return;
        const els = section.querySelectorAll(
            '.project-card, .research-card, .journey-card, .award-card, .contact-card, .certificate-card'
        );
        els.forEach((el, i) => {
            el.style.opacity   = '0';
            el.style.transform = 'translateY(24px)';
            setTimeout(() => {
                el.style.transition = 'all .45s ease';
                el.style.opacity    = '1';
                el.style.transform  = 'translateY(0)';
            }, i * 80);
        });
    }

    /* ── Modal System ───────────────────────── */
    _setupModalSystem() {
        const overlay = document.getElementById('modalOverlay');
        document.getElementById('modalClose').addEventListener('click', () => this._closeModal());
        overlay.addEventListener('click', e => { if (e.target === overlay) this._closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') this._closeModal(); });
    }

    _setupExpandableCards() {
        document.querySelectorAll('.project-card').forEach(c =>
            c.addEventListener('click', () => this._openModal(this._projectContent(this.getProjectData(c.dataset.project)))));
        document.querySelectorAll('.research-card').forEach(c =>
            c.addEventListener('click', () => this._openModal(this._researchContent(this.getResearchData(c.dataset.research)))));
        document.querySelectorAll('.journey-card').forEach(c =>
            c.addEventListener('click', () => this._openModal(this._journeyContent(this.getJourneyData(c.dataset.journey)))));
        document.querySelectorAll('.certificate-card').forEach(c =>
            c.addEventListener('click', () => this._openModal(this._certificateContent(this.getCertificateData(c.dataset.certificate)))));
    }

    _openModal(html) {
        document.getElementById('modalBody').innerHTML = html;
        document.getElementById('modalOverlay').classList.add('active');
        document.body.classList.add('modal-active');
    }
    _closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        document.body.classList.remove('modal-active');
    }

    /* ═══════════════════════════════════════════
       DATA STORES
    ═══════════════════════════════════════════ */
    getJourneyData(id) {
        const d = {
            'exatorial': {
                title: 'Generative AI Developer',
                institution: 'Exatorial · India (Remote)',
                duration: 'Jun 2024 – Jan 2025',
                type: 'Industry',
                description: 'Built production multi-agent AI systems for automated document intelligence, combining advanced RAG architectures with robust OCR pipelines to process heterogeneous enterprise data at scale.',
                projects: [
                    'Multi-agent orchestration for multilingual transcripts and heterogeneous documents (PDFs, DOCX, Excel, images)',
                    'Advanced OCR/image-parsing workflows with fallback strategies for noisy, mixed-content inputs',
                    'Weighted retrieval agent merging multiple vector stores with query expansion, re-ranking, and metadata-based filtering',
                    'End-to-end RAG pipeline evaluation and latency optimisation for production deployment'
                ],
                achievements: [
                    'Reduced manual document-processing time by ~60% through agent automation',
                    'High-precision retrieval system across 5+ heterogeneous file formats',
                    'Deployed robust fallback OCR pipeline handling corrupted and scanned inputs'
                ],
                skills: 'LangChain, LangGraph, RAG, Pinecone, ChromaDB, LLMs, Python, OCR, Vector Search, Multi-agent Systems'
            },
            'kiel': {
                title: 'AI / ML Intern',
                institution: 'Christian-Albrechts-Universität zu Kiel · Germany (Remote)',
                duration: 'Jun 2023 – Feb 2025',
                type: 'Research',
                description: 'Led deep-learning research for real-time structural health monitoring — designing novel transformer-CNN hybrid architectures for microcrack detection in ultrasonic wave fields.',
                projects: [
                    'MicroCrackAttNet50E — transformer-CNN hybrid with self-attention and 1D convolutions (+15% accuracy, −30% overhead)',
                    'Hybrid CNN-GRU with custom loss functions for damage localisation in SHM datasets',
                    'MCMN (MicroCracksMetaNet50E) — SAM-inspired decoder for multi-material crack detection (ICMLA 2024)',
                    'Wave-Based Neural Network with attention mechanism for physics-informed damage localisation (ICMLA 2024)'
                ],
                achievements: [
                    '+15% classification accuracy over CNN baseline on ultrasonic sensor data',
                    '−30% computational overhead via 1D convolution and attention optimisation',
                    'Co-authored 4 peer-reviewed publications: MDPI Sensors, Nature Scientific Reports, IEEE ICMLA ×2'
                ],
                skills: 'PyTorch, TensorFlow, Transformer, CNN, GRU, Signal Processing, Weights & Biases, TensorBoard, Detectron2, YOLO'
            },
            'buckingham': {
                title: 'AI / ML Research Intern',
                institution: 'University of Buckingham · United Kingdom (Remote)',
                duration: 'Mar – May 2023',
                type: 'Research',
                description: 'Developed a GAN-based real-time video enhancement pipeline for Autonomous Underwater Vehicles, addressing the challenge of low-visibility detection in turbid marine environments.',
                projects: [
                    'U-Net–based GAN (CycleGAN) for unpaired real-world underwater image enhancement',
                    'YOLOv8 fine-tuning for tiny object detection on GAN-enhanced AUV imagery',
                    'Benchmarking: enhancement quality vs. downstream detection accuracy trade-off analysis'
                ],
                achievements: [
                    '+15% precision and F1-score on underwater object detection vs. raw-image baseline',
                    'Real-time enhancement pipeline suitable for AUV onboard inference',
                    'Published at SPIE Defense + Commercial Sensing 2024'
                ],
                skills: 'YOLOv8, GAN, U-Net, CycleGAN, OpenCV, Computer Vision, TensorFlow, AUV, Image Enhancement'
            },
            'education': {
                title: 'B.Tech, Computer Engineering',
                institution: 'Zakir Husain College of Engineering & Technology, AMU · Aligarh, India',
                duration: '2021 – 2025',
                type: 'Education',
                description: 'Four-year honours degree in Computer Engineering with a focus on AI, Machine Learning, Computer Vision, Robotics, and Autonomous Systems.',
                coursework: [
                    'Machine Learning & Deep Learning',
                    'Computer Vision & Image Processing',
                    'Data Structures & Algorithms',
                    'Operating Systems & Computer Networks',
                    'Embedded Systems & Microcontrollers',
                    'Database Management Systems',
                    'Robotics & Control Systems',
                    'Signal Processing'
                ],
                achievements: [
                    'CGPA: 8.67 / 10.0',
                    'Led AUV-ZHCET Club software team for competitive underwater robotics',
                    '3 national-level awards during undergraduate programme',
                    'Completed 3 international research internships alongside coursework'
                ],
                skills: 'Python, C/C++, Machine Learning, Computer Vision, Robotics, Algorithms, Linux, Embedded Systems'
            }
        };
        return d[id] || {};
    }

    getProjectData(id) {
        const p = {
            'rovc': {
                title: 'ROVC2.0 – Remotely Operated Vehicle',
                description: 'Comprehensive ROV system integrating object detection, GUI control interface, precision thruster management, IMU calibration, and pressure-sensor-based depth monitoring for underwater exploration.',
                technologies: ['Python','Computer Vision','OpenCV','PyQt/Tkinter','Robotics Control','Serial Communication'],
                features: [
                    'Real-time object detection and tracking',
                    'Intuitive graphical user interface',
                    'Precision thruster control system',
                    'IMU sensor calibration and orientation tracking',
                    'Pressure sensor integration for depth monitoring',
                    'Custom control libraries for ROV operations'
                ],
                github: 'https://github.com/hasanyusuf01/ROVC2.0',
                challenges: 'Integrating multiple sensor streams while ensuring real-time performance and reliable underwater communication.',
                outcome: 'Fully functional ROV capable of autonomous underwater navigation and object detection — secured 3rd prize at AMUROVc 2.0.'
            },
            'stewart-platform': {
                title: 'Stewart Platform – 6DoF Parallel Robot',
                description: 'AI-powered control tool for a 6-DOF Stewart Platform using multimodal neural networks (ResNet50, VGG, PoseNet) to predict platform motion from live video with IMU fusion.',
                technologies: ['PyTorch','TensorFlow','OpenCV','ArUco Markers','Streamlit','IMU Fusion'],
                features: [
                    'Multimodal neural network (ResNet50 + VGG + PoseNet) for 6-DOF prediction',
                    'Live video processing pipeline with IMU data fusion',
                    'ArUco marker tracking for real-time pose estimation',
                    'Streamlit-based interactive control dashboard',
                    'Real-time robot state monitoring and logging'
                ],
                github: 'https://github.com/hasanyusuf01/Stewart-Platform-',
                challenges: 'Achieving accurate 6-DOF predictions from monocular video while compensating for vibration and sensor noise.',
                outcome: 'Achieved high-precision 6-DOF prediction enabling smooth, accurate parallel robot movement control.'
            },
            'ni3d': {
                title: 'Ni3D – Photogrammetry 3D Reconstruction',
                description: 'Low-cost 3D reconstruction pipeline using photogrammetry — multi-view stereo, feature matching, point-cloud generation, mesh reconstruction, and UV texture mapping from 2D images.',
                technologies: ['Python','OpenCV','Open3D','Photogrammetry','Point Cloud Processing'],
                features: [
                    'Multi-view stereo reconstruction pipeline',
                    'Automatic feature matching and tracking',
                    'Point cloud generation and outlier removal',
                    'Mesh reconstruction and Laplacian smoothing',
                    'UV texture mapping',
                    'Cost-effective alternative to commercial 3D scanners'
                ],
                github: 'https://github.com/hasanyusuf01/Ni3D',
                challenges: 'High-quality reconstruction with minimal hardware requirements and arbitrary unstructured image sets.',
                outcome: 'Accessible open-source 3D reconstruction pipeline producing quality models at a fraction of commercial scanner costs.'
            },
            'und-assessment': {
                title: 'Drone-Nav-Agent',
                description: 'Deep Deterministic Policy Gradient (DDPG) reinforcement learning framework for autonomous drone navigation in a continuous 2D custom OpenAI Gym environment.',
                technologies: ['Python','PyTorch','Reinforcement Learning','OpenAI Gym','NumPy','Matplotlib'],
                features: [
                    'Custom 2D continuous-action Gym environment',
                    'Full DDPG implementation: actor-critic networks, experience replay, target networks',
                    'Comprehensive data logging and trajectory visualisation',
                    'Reward shaping for efficient navigation',
                    'Convergence diagnostics and training dashboards'
                ],
                github: 'https://github.com/hasanyusuf01/und_assessment',
                challenges: 'Stable training in continuous action spaces with sparse rewards — addressed via reward shaping and prioritised replay.',
                outcome: 'Successfully trained drone agent capable of reaching arbitrary goal positions in a 2D obstacle environment.'
            },
            'webhook-system': {
                title: 'Webhook Integration System',
                description: 'Real-time webhook system designed for automated data processing and seamless integration between services.',
                technologies: ['HTML','JavaScript','Node.js','HTTP Protocols','Real-time Processing'],
                features: [
                    'Real-time webhook ingestion and routing',
                    'Multi-service integration support',
                    'Automated data processing pipelines',
                    'Error handling and exponential-backoff retry',
                    'Request logging and monitoring dashboard'
                ],
                github: 'https://github.com/hasanyusuf01/webhook-repo',
                challenges: 'Handling high-concurrency webhook bursts while guaranteeing delivery ordering and idempotency.',
                outcome: 'Robust automation system enabling seamless event-driven integration workflows.'
            },
            'codes-collection': {
                title: 'ML/DL Projects Collection',
                description: 'Comprehensive repository of machine learning, deep learning, signal processing, and image processing implementations with documentation and tutorials.',
                technologies: ['Python','Jupyter Notebook','scikit-learn','PyTorch','NumPy','Pandas'],
                features: [
                    'Classical ML algorithms from scratch',
                    'CNN, RNN, LSTM architectures',
                    'Signal processing and FFT analysis',
                    'Image segmentation and object detection experiments',
                    'Educational notebooks with explanations'
                ],
                github: 'https://github.com/hasanyusuf01/Codes',
                challenges: 'Covering a breadth of domains while maintaining code quality, reproducibility, and documentation.',
                outcome: 'Comprehensive learning resource demonstrating multi-domain ML/DL proficiency.'
            }
        };
        return p[id] || {};
    }

    getResearchData(id) {
        const r = {
            'neural-anomaly': {
                title: 'Neural Network Based Anomaly Detection for Network Datasets',
                abstract: 'Advanced neural network approach for detecting anomalies in network security datasets using deep learning to identify unusual patterns in network traffic.',
                authors: ['B Zahid Hussain','Yusuf Hasan','Irfan Khan'],
                venue: 'Authorea Preprints', year: '2024',
                doi: 'https://www.authorea.com/doi/full/10.36227/techrxiv.170906907.74394397',
                keywords: ['Neural Networks','Anomaly Detection','Network Security','Machine Learning'],
                methodology: 'Specialised neural architecture optimised for network anomaly detection, trained on large-scale traffic datasets.',
                results: 'High detection accuracy with reduced false positives vs. traditional rule-based methods.',
                impact: '5 citations — contributes to network security research.',
                citations: 5
            },
            'damage-localization': {
                title: 'Hybrid Neural Network Method for Damage Localization in Structural Health Monitoring',
                abstract: 'Hybrid RNN-CNN model for structural damage localisation, demonstrating superior accuracy over pure CNNs while reducing parameter count.',
                authors: ['F Moreh','Yusuf Hasan','Zarghaam Rizvi','Sven Tomforde','Frank Wuttke'],
                venue: 'Nature Scientific Reports', year: '2025',
                doi: 'https://doi.org/10.1038/s41598-025-92396-9',
                keywords: ['Structural Health Monitoring','Hybrid RNN-CNN','Damage Detection'],
                methodology: 'Single-RNN-layer hybrid with supporting convolutional blocks for multi-modal damage detection.',
                results: 'Superior damage localisation with fewer parameters than pure-CNN baseline.',
                impact: '2 citations in high-impact journal.',
                citations: 2
            },
            'auv-software': {
                title: "Design and Implementation of Autonomous Underwater Vehicles' Software Stack",
                abstract: 'Comprehensive software architecture for AUV systems: real-time control, navigation, object detection, and sensor fusion.',
                authors: ['D Singh','K Masood','N Jamshed','Y Farooq','Yusuf Hasan','H Ahmad'],
                venue: 'IEEE PIECON 2023', year: '2023',
                doi: '10.1109/PIECON56912.2023.10085802',
                keywords: ['AUV','Software Architecture','Robotics','Control Systems'],
                methodology: 'Modular ROS-based software stack with real-time detection, depth control, and IMU fusion.',
                results: 'Successfully deployed at national AUV competition; stable autonomous missions.',
                impact: '2 citations.',
                citations: 2
            },
            'microcrack-detection': {
                title: 'MCMN Deep Learning Model for Precise Microcrack Detection in Various Materials',
                abstract: 'MicroCracksMetaNet50E — a SAM-inspired deep learning model with novel decoder for multi-material microcrack detection.',
                authors: ['F Moreh','Yusuf Hasan','Zarghaam Rizvi','Frank Wuttke','Sven Tomforde'],
                venue: 'IEEE ICMLA 2024', year: '2024',
                doi: 'https://doi.org/10.1109/ICMLA61862.2024.00297',
                keywords: ['Deep Learning','Computer Vision','Microcrack Detection','Materials Science'],
                methodology: 'Multi-Channel Microcrack Network inspired by Meta\'s SAM; novel decoder head for high-precision detection.',
                results: 'State-of-the-art performance across multiple material types.',
                impact: '1 citation.',
                citations: 1
            },
            'wave-neural-network': {
                title: 'Wave-Based Neural Network with Attention Mechanism for Damage Localization',
                abstract: 'Attention-driven wave propagation neural network for precise structural damage localisation with reduced model complexity.',
                authors: ['F Moreh','Yusuf Hasan','Zarghaam Rizvi','Frank Wuttke','Sven Tomforde'],
                venue: 'IEEE ICMLA 2024', year: '2024',
                doi: 'https://doi.org/10.1109/ICMLA61862.2024.00023',
                keywords: ['Wave Analysis','Attention Mechanism','Neural Networks','Damage Localisation'],
                methodology: 'Physics-informed attention over wave propagation features for enhanced spatial localisation.',
                results: 'Competitive localisation accuracy with significantly reduced parameter count.',
                impact: '1 citation.',
                citations: 1
            },
            'underwater-enhancement': {
                title: 'Real-time Underwater Video Feed Enhancement for Autonomous Underwater Vehicles',
                abstract: 'GAN-based real-time underwater video enhancement combined with YOLOv8 detection — addresses turbidity and visibility degradation in marine environments.',
                authors: ['Yusuf Hasan','A Ali'],
                venue: 'SPIE Defense + Commercial Sensing 2024', year: '2024',
                doi: 'https://doi.org/10.1117/12.3013661',
                keywords: ['Underwater Imaging','Video Enhancement','Computer Vision','AUV'],
                methodology: 'CycleGAN-based image enhancement pipeline followed by YOLOv8 fine-tuning on enhanced frames.',
                results: '+15% precision and F1-score on underwater object detection.',
                impact: '1 citation.',
                citations: 1
            },
            'microcrack-attention': {
                title: 'MicroCrackAttentionNeXt: Advancing Microcrack Detection in Wave Field Analysis Using Deep Neural Networks Through Feature Visualization',
                abstract: 'Adaptive Feature Reuse Block for crack-size-aware detection with interpretable attention visualisation in wave field analysis.',
                authors: ['F Moreh','Yusuf Hasan','B Zahid Hussain','M Ammar','Frank Wuttke','Sven Tomforde'],
                venue: 'MDPI Sensors 2025', year: '2025',
                doi: 'https://doi.org/10.3390/s25072107',
                keywords: ['Microcrack Detection','Feature Visualisation','Attention','Wave Fields'],
                methodology: 'Attention-based DNN with Adaptive Feature Reuse Block; Grad-CAM feature visualisation.',
                results: 'State-of-the-art microcrack detection with interpretable visual explanations.',
                impact: 'New publication.',
                citations: 'New'
            },
            'keypoint-localization': {
                title: 'Deep Learning for Micro-Scale Crack Detection on Imbalanced Datasets Using Key Point Localization',
                abstract: 'Key-point localisation framework specifically designed for heavily imbalanced micro-crack detection datasets.',
                authors: ['F Moreh','Yusuf Hasan','B Zahid Hussain','M Ammar','Sven Tomforde'],
                venue: 'arXiv Preprint', year: '2024',
                doi: 'https://doi.org/10.48550/arXiv.2411.10389',
                keywords: ['Deep Learning','Imbalanced Datasets','Key Point Localisation','Crack Detection'],
                methodology: 'Heatmap-based keypoint detection with class-balanced sampling and focal-loss variants.',
                results: 'Effective crack detection despite severe dataset imbalance.',
                impact: 'Under review.',
                citations: 'Under Review'
            }
        };
        return r[id] || {};
    }

    getCertificateData(id) {
        const c = {
            'ml-cert':       { title: 'Machine Learning Certification', issuer: 'Coursera – Stanford University', date: '2024', description: 'Supervised/unsupervised learning, neural networks, and practical applications.', skills: ['ML Algorithms','Python','Data Analysis','Statistics'], credentialId: 'ML-CERT-2024-001' },
            'dl-cert':       { title: 'Deep Learning Specialization',   issuer: 'Coursera – deeplearning.ai',    date: '2024', description: 'CNNs, RNNs, sequence models, and GANs.',                               skills: ['Deep Learning','TensorFlow','CNNs','NLP'],              credentialId: 'DL-SPEC-2024-002' },
            'research-award':{ title: 'Best Research Paper Award',       issuer: 'IEEE Conference 2024',          date: '2024', description: 'Recognition for neural network anomaly detection research.',             skills: ['Research','Technical Writing','Innovation'],            credentialId: 'IEEE-AWARD-2024' },
            'robotics-cert': { title: 'Robotics & Automation Certificate',issuer: 'IIT Jodhpur',                 date: '2024', description: 'Robotics systems, automation, and control theory.',                     skills: ['Robotics','Automation','Control Theory'],               credentialId: 'IITJ-ROB-2024' }
        };
        return c[id] || {};
    }

    /* ═══════════════════════════════════════════
       MODAL TEMPLATES
    ═══════════════════════════════════════════ */
    _projectContent(p) {
        return `<div class="modal-project">
            <h2>${p.title || 'Project'}</h2>
            <p style="color:var(--text-secondary);margin-bottom:1.5rem">${p.description || ''}</p>
            <div class="modal-section"><h3><i class="fas "></i> Technologies</h3>
                <div class="tech-grid">${(p.technologies||[]).map(t=>`<span class="tech-badge">${t}</span>`).join('')}</div></div>
            <div class="modal-section"><h3><i class="fas "></i> Key Features</h3>
                <ul class="features-list">${(p.features||[]).map(f=>`<li>${f}</li>`).join('')}</ul></div>
            <div class="modal-links">
                ${p.github?`<a href="${p.github}" target="_blank" class="modal-link"><i class="fab fa-github"></i> View Code</a>`:''}
            </div></div>`;
    }

    _researchContent(r) {
        return `<div class="modal-research">
            <h2>${r.title||'Research'}</h2>
            <div class="research-meta">
                <p><strong>Authors:</strong> ${(r.authors||[]).join(', ')}</p>
                <p><strong>Published:</strong> ${r.venue} (${r.year})</p>
                <p><strong>Citations:</strong> ${r.citations}</p>
                ${r.doi?`<p><strong>DOI:</strong> <a href="${r.doi}" target="_blank" style="color:var(--primary-color)">${r.doi}</a></p>`:''}
            </div>
  
                ${r.doi?`<a href="${r.doi.startsWith('http')?r.doi:'https://doi.org/'+r.doi}" target="_blank" class="modal-link"><i class="fas fa-external-link-alt"></i> View Paper</a>`:''}
            </div></div>`;
    }

    _journeyContent(j) {
        const block = (title, icon, items, type='list') => {
            if (!items || !items.length) return '';
            const inner = type === 'list'
                ? `<ul class="features-list">${items.map(i=>`<li>${i}</li>`).join('')}</ul>`
                : `<p>${items}</p>`;
            return `<div class="modal-section"><h3><i class="fas fa-${icon}"></i> ${title}</h3>${inner}</div>`;
        };
        return `<div class="modal-journey">
            <h2>${j.title||''}</h2>
            <div class="journey-meta">
                <p><strong>Organisation:</strong> ${j.institution||''}</p>
                <p><strong>Duration:</strong> ${j.duration||''}</p>
                <p><strong>Type:</strong> ${j.type||''}</p>
            </div>
            <div class="modal-section"><h3><i class="fas fa-info-circle"></i> Overview</h3><p>${j.description||''}</p></div>
            ${block('Projects & Work', 'project-diagram', j.projects)}
            ${block('Coursework', 'book', j.coursework)}
            ${block('Key Achievements', 'trophy', j.achievements)}
            <div class="modal-section"><h3><i class="fas "></i> Skills</h3><p>${j.skills||''}</p></div>
            </div>`;
    }

    _certificateContent(c) {
        return `<div class="modal-certificate">
            <h2>${c.title||''}</h2>
            <div class="certificate-meta">
                <p><strong>Issued by:</strong> ${c.issuer||''}</p>
                <p><strong>Date:</strong> ${c.date||''}</p>
                <p><strong>Credential ID:</strong> ${c.credentialId||''}</p>
            </div>
            <div class="modal-section"><h3><i class="fas fa-info-circle"></i> Description</h3><p>${c.description||''}</p></div>
            <div class="modal-section"><h3><i class="fas "></i> Skills</h3>
                <div class="skills-grid">${(c.skills||[]).map(s=>`<span class="skill-badge">${s}</span>`).join('')}</div>
            </div></div>`;
    }

    /* ── Modal CSS injected once ──────────────── */
    _addModalStyles() {
        if (document.getElementById('modal-styles')) return;
        const s = document.createElement('style');
        s.id = 'modal-styles';
        s.textContent = `
            .modal-section { margin:1.5rem 0; padding:1.25rem 1.5rem; background:var(--surface); border-radius:10px; border-left:4px solid var(--primary-color); }
            .modal-section h3 { color:var(--primary-color); margin-bottom:.75rem; display:flex; align-items:center; gap:.5rem; font-size:1rem; }
            .tech-grid,.keywords,.skills-grid { display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.75rem; }
            .tech-badge,.keyword-badge,.skill-badge { padding:.35rem .9rem; background:var(--gradient); color:white; border-radius:20px; font-size:.85rem; font-weight:500; }
            .skill-badge { background:var(--accent-color); }
            .features-list,.coursework-list,.projects-list,.achievements-list { list-style:none; padding:0; }
            .features-list li,.projects-list li,.coursework-list li,.achievements-list li { padding:.4rem 0 .4rem 1.3rem; border-bottom:1px solid var(--border); position:relative; font-size:.9rem; }
            .features-list li::before,.projects-list li::before,.coursework-list li::before,.achievements-list li::before { content:'•'; color:var(--primary-color); font-weight:bold; position:absolute; left:0; }
            .modal-links { display:flex; gap:1rem; margin-top:2rem; flex-wrap:wrap; }
            .modal-link { padding:.7rem 1.4rem; background:var(--gradient); color:white; text-decoration:none; border-radius:8px; display:flex; align-items:center; gap:.5rem; font-weight:500; transition:all .3s; }
            .modal-link:hover { transform:translateY(-2px); box-shadow:0 8px 20px var(--shadow); }
            .research-meta,.journey-meta,.certificate-meta { background:var(--surface); padding:1rem 1.25rem; border-radius:8px; margin:1rem 0; }
            .research-meta p,.journey-meta p,.certificate-meta p { margin:.3rem 0; font-size:.9rem; }
            @media(max-width:768px){ .modal-links { flex-direction:column; } .modal-link { justify-content:center; } }
        `;
        document.head.appendChild(s);
    }
}

/* ═══════════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => { new Portfolio(); });

window.addEventListener('resize', () => {
    const hb = document.querySelector('.hamburger');
    const nm = document.querySelector('.nav-menu');
    if (window.innerWidth > 768) {
        hb.classList.remove('active');
        nm.classList.remove('active');
    }
});
