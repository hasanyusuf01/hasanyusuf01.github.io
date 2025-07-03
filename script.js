// Navigation functionality
class Portfolio {
    constructor() {
        this.currentSection = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupModalSystem();
        this.setupExpandableCards();
        this.setupSmoothScrolling();
        this.observeElements();
        
        // Set initial active section
        this.showSection('home');
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
                this.updateActiveNav(link);
            });
        });
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Animate elements in the section
            this.animateSection(targetSection);
        }
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    animateSection(section) {
        const elements = section.querySelectorAll('.project-card, .research-card, .timeline-item, .contact-card');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupModalSystem() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');

        modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setupExpandableCards() {
        // Project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project');
                this.showProjectModal(projectId);
            });
        });

        // Research cards
        document.querySelectorAll('.research-card').forEach(card => {
            card.addEventListener('click', () => {
                const researchId = card.getAttribute('data-research');
                this.showResearchModal(researchId);
            });
        });

        // Timeline items
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.addEventListener('click', () => {
                const journeyId = item.getAttribute('data-journey');
                this.showJourneyModal(journeyId);
            });
        });

        // Contact cards
        document.querySelectorAll('.contact-card').forEach(card => {
            card.addEventListener('click', () => {
                const contactId = card.getAttribute('data-contact');
                this.showContactModal(contactId);
            });
        });

        // Certificate cards
        document.querySelectorAll('.certificate-card').forEach(card => {
            card.addEventListener('click', () => {
                const certificateId = card.getAttribute('data-certificate');
                this.showCertificateModal(certificateId);
            });
        });
    }

    showProjectModal(projectId) {
        const projectData = this.getProjectData(projectId);
        const modalContent = this.createProjectModalContent(projectData);
        this.openModal(modalContent);
    }

    showResearchModal(researchId) {
        const researchData = this.getResearchData(researchId);
        const modalContent = this.createResearchModalContent(researchData);
        this.openModal(modalContent);
    }

    showJourneyModal(journeyId) {
        const journeyData = this.getJourneyData(journeyId);
        const modalContent = this.createJourneyModalContent(journeyData);
        this.openModal(modalContent);
    }

    showContactModal(contactId) {
        const contactData = this.getContactData(contactId);
        const modalContent = this.createContactModalContent(contactData);
        this.openModal(modalContent);
    }

    showCertificateModal(certificateId) {
        const certificateData = this.getCertificateData(certificateId);
        const modalContent = this.createCertificateModalContent(certificateData);
        this.openModal(modalContent);
    }

    getProjectData(projectId) {
        const projects = {
            'rovc': {
                title: 'ROVC2.0 - Remotely Operated Vehicle',
                description: 'Comprehensive ROV system incorporating advanced object detection algorithms, intuitive GUI interface, precise thruster control, IMU calibration, and pressure sensor integration for underwater exploration and research.',
                technologies: ['Python', 'Computer Vision', 'OpenCV', 'PyQt/Tkinter', 'Robotics Control', 'Serial Communication'],
                features: [
                    'Real-time object detection and tracking',
                    'Intuitive graphical user interface',
                    'Precision thruster control system',
                    'IMU sensor calibration and orientation tracking',
                    'Pressure sensor integration for depth monitoring',
                    'Custom control libraries for ROV operations'
                ],
                github: 'https://github.com/hasanyusuf01/ROVC2.0',
                demo: 'Forked and enhanced from original ROVC project',
                challenges: 'Integrating multiple sensor systems while maintaining real-time performance and ensuring reliable underwater communication.',
                outcome: 'Successfully developed a fully functional ROV system capable of autonomous underwater navigation and object detection.'
            },
            'stewart-platform': {
                title: 'Stewart Platform - 6DoF Parallel Robot',
                description: 'Advanced neural network system designed to predict 6 Degrees of Freedom (6DoF) for parallel robot control, utilizing custom multi-modal neural networks for precise robotic movement prediction.',
                technologies: ['Neural Networks', 'Machine Learning', 'Python', 'Jupyter Notebook', 'Robotics Kinematics', 'TensorFlow/PyTorch'],
                features: [
                    'Custom multi-modal neural network architecture',
                    '6DoF position and orientation prediction',
                    'Real-time robotic control integration',
                    'Advanced kinematic modeling',
                    'Parallel robot motion optimization',
                    'Training data generation and validation'
                ],
                github: 'https://github.com/hasanyusuf01/Stewart-Platform-',
                demo: 'Research project for parallel robot control',
                challenges: 'Developing accurate neural networks for complex 6DoF predictions while ensuring real-time performance for robotic applications.',
                outcome: 'Achieved high-precision 6DoF predictions enabling smooth and accurate parallel robot movements.'
            },
            'ni3d': {
                title: 'Ni3D - Photogrammetry 3D Reconstruction',
                description: 'Low-cost 3D reconstruction model utilizing photogrammetry techniques to create accurate 3D models from 2D images, making 3D scanning accessible and affordable.',
                technologies: ['Python', 'Computer Vision', 'Photogrammetry', '3D Reconstruction', 'OpenCV', 'Point Cloud Processing'],
                features: [
                    'Multi-view stereo reconstruction',
                    'Automatic feature matching and tracking',
                    'Point cloud generation and processing',
                    'Mesh reconstruction and optimization',
                    'Texture mapping and UV unwrapping',
                    'Cost-effective alternative to expensive 3D scanners'
                ],
                github: 'https://github.com/hasanyusuf01/Ni3D',
                demo: 'Open-source 3D reconstruction solution',
                challenges: 'Achieving high-quality 3D reconstructions with minimal hardware requirements while maintaining accuracy comparable to commercial solutions.',
                outcome: 'Developed an accessible 3D reconstruction pipeline that produces high-quality models at a fraction of traditional costs.'
            },
            'codes-collection': {
                title: 'ML/DL Projects Collection',
                description: 'Comprehensive repository encompassing diverse projects in machine learning, deep learning, signal processing, and image processing, showcasing expertise across multiple domains.',
                technologies: ['Machine Learning', 'Deep Learning', 'Signal Processing', 'Image Processing', 'Python', 'Jupyter Notebook'],
                features: [
                    'Diverse machine learning algorithms implementation',
                    'Deep learning model architectures',
                    'Signal processing techniques and applications',
                    'Advanced image processing methods',
                    'Data analysis and visualization tools',
                    'Educational examples and tutorials'
                ],
                github: 'https://github.com/hasanyusuf01/Codes',
                demo: 'Collection of research and educational projects',
                challenges: 'Implementing and optimizing various algorithms across different domains while maintaining code quality and documentation.',
                outcome: 'Created a comprehensive learning resource demonstrating proficiency in multiple technical domains.'
            },
            'und-assessment': {
                title: 'Drone-Nav-Agent',
                description: 'The Drone-Nav-Agent system is a Deep Deterministic Policy Gradient (DDPG) reinforcement learning framework designed for training agents to navigate in a 2D point particle environment. The system provides a complete end-to-end pipeline for DDPG-based continuous control learning, including environment simulation, agent training, comprehensive data logging, and trajectory analysis.',
                technologies: ['Python', 'Jupyter Notebook', 'Data Analysis', 'Statistical Methods', 'Machine Learning', 'Assessment Algorithms'],
                features: [
                    'Automated assessment algorithms',
                    'Statistical analysis and reporting',
                    'Data visualization and insights',
                    'Performance evaluation metrics',
                    'Scalable assessment framework',
                    'Research-grade analysis tools'
                ],
                github: 'https://github.com/hasanyusuf01/und_assessment',
                demo: 'University research project',
                challenges: 'Developing robust assessment methodologies that provide accurate and reliable evaluation results for research purposes.',
                outcome: 'Contributed to university research with reliable assessment tools used in academic evaluation studies.'
            },
            'webhook-system': {
                title: 'Webhook Integration System',
                description: 'Real-time webhook system designed for automated data processing and seamless integration between different services and platforms.',
                technologies: ['HTML', 'JavaScript', 'Web APIs', 'Real-time Processing', 'Integration Services', 'HTTP Protocols'],
                features: [
                    'Real-time webhook processing',
                    'Multi-service integration capabilities',
                    'Automated data routing and processing',
                    'Error handling and retry mechanisms',
                    'Scalable webhook management',
                    'Monitoring and logging systems'
                ],
                github: 'https://github.com/hasanyusuf01/webhook-repo',
                demo: 'Integration and automation system',
                challenges: 'Ensuring reliable real-time processing while handling multiple concurrent webhook requests and maintaining system stability.',
                outcome: 'Successfully implemented a robust webhook system enabling seamless automation and integration workflows.'
            }
        };
        return projects[projectId] || {};
    }

    getResearchData(researchId) {
        const research = {
            'neural-anomaly': {
                title: 'Neural Network Based Anomaly Detection Method for Network Datasets',
                abstract: 'This research presents an advanced neural network approach for detecting anomalies in network security datasets, leveraging deep learning techniques to identify unusual patterns and potential security threats in network traffic.',
                authors: ['B Zahid Hussain', 'Yusuf Hasan', 'Irfan Khan'],
                venue: 'Authorea Preprints',
                year: '2024',
                doi: 'Authorea.2024.doi',
                keywords: ['Neural Networks', 'Anomaly Detection', 'Network Security', 'Machine Learning'],
                methodology: 'We developed a specialized neural network architecture optimized for network anomaly detection, trained on large-scale network datasets.',
                results: 'Achieved high accuracy in detecting network anomalies with reduced false positive rates compared to traditional methods.',
                impact: 'This work has been cited 5 times and contributes to advancing network security research.',
                citations: 5
            },
            'damage-localization': {
                title: 'Hybrid Neural Network Method for Damage Localization in Structural Health Monitoring',
                abstract: 'Innovative approach using hybrid neural networks for accurate detection and localization of structural damage, combining multiple sensing modalities for comprehensive structural health assessment.',
                authors: ['F Moreh', 'Yusuf Hasan', 'Zarghaam Rizvi', 'Sven Tomforde', 'Frank Wuttke'],
                venue: 'Scientific Reports',
                year: '2025',
                doi: '10.1038/s41598-025-xxxxx-x',
                keywords: ['Structural Health Monitoring', 'Hybrid Neural Networks', 'Damage Detection', 'Civil Engineering'],
                methodology: 'Developed hybrid neural network combining convolutional and recurrent architectures for multi-modal damage detection.',
                results: 'Demonstrated superior accuracy in damage localization compared to existing methods across various structural types.',
                impact: 'Published in high-impact journal with 2 citations, advancing structural monitoring technology.',
                citations: 2
            },
            'auv-software': {
                title: 'Design and Implementation of Autonomous Underwater Vehicles\' Software Stack',
                abstract: 'Comprehensive software architecture development for autonomous underwater vehicle systems, focusing on robust control algorithms and real-time underwater navigation capabilities.',
                authors: ['D Singh', 'K Masood', 'N Jamshed', 'Y Farooq', 'Yusuf Hasan', 'H Ahmad'],
                venue: 'IEEE International Conference on Power, Instrumentation, Energy and Control',
                year: '2023',
                doi: '10.1109/PIEC.2023.xxxxx',
                keywords: ['Autonomous Underwater Vehicles', 'Software Architecture', 'Robotics', 'Control Systems'],
                methodology: 'Designed modular software stack with real-time control, navigation, and communication subsystems for AUV operations.',
                results: 'Successfully implemented and tested comprehensive AUV software enabling autonomous underwater missions.',
                impact: 'Cited 2 times, contributing to advancement of underwater robotics and autonomous systems.',
                citations: 2
            },
            'microcrack-detection': {
                title: 'MCMN Deep Learning Model for Precise Microcrack Detection in Various Materials',
                abstract: 'Advanced deep learning model utilizing computer vision techniques for precise detection of microcracks across diverse material types, enabling early damage assessment.',
                authors: ['F Moreh', 'Yusuf Hasan', 'Zarghaam Rizvi', 'Frank Wuttke', 'Sven Tomforde'],
                venue: 'IEEE International Conference on Machine Learning and Applications (ICMLA)',
                year: '2024',
                doi: '10.1109/ICMLA.2024.xxxxx',
                keywords: ['Deep Learning', 'Computer Vision', 'Microcrack Detection', 'Materials Science'],
                methodology: 'Developed Multi-Channel Microcrack Network (MCMN) using advanced CNN architectures for high-precision crack detection.',
                results: 'Achieved state-of-the-art performance in microcrack detection across multiple material types with high precision.',
                impact: 'Cited 1 time, advancing non-destructive testing and materials characterization fields.',
                citations: 1
            },
            'wave-neural-network': {
                title: 'Wave-Based Neural Network with Attention Mechanism for Damage Localization in Materials',
                abstract: 'Novel neural network architecture incorporating wave propagation analysis with attention mechanisms for precise damage localization in structural materials.',
                authors: ['F Moreh', 'Yusuf Hasan', 'Zarghaam Rizvi', 'Frank Wuttke', 'Sven Tomforde'],
                venue: 'IEEE International Conference on Machine Learning and Applications (ICMLA)',
                year: '2024',
                doi: '10.1109/ICMLA.2024.xxxxx',
                keywords: ['Wave Analysis', 'Attention Mechanism', 'Neural Networks', 'Damage Localization'],
                methodology: 'Combined wave propagation physics with attention-based neural networks for enhanced damage detection accuracy.',
                results: 'Demonstrated superior performance in localizing damage using wave-based analysis integrated with deep learning.',
                impact: 'Cited 1 time, contributing to integration of physics-based modeling with machine learning.',
                citations: 1
            },
            'underwater-enhancement': {
                title: 'Real-time Underwater Video Feed Enhancement for Autonomous Underwater Vehicles (AUV)',
                abstract: 'Real-time video enhancement techniques specifically designed for autonomous underwater vehicles, addressing challenges of underwater image processing and visibility improvement.',
                authors: ['Yusuf Hasan', 'A Ali'],
                venue: 'SPIE Conference on Multimodal Image Exploitation and Learning',
                year: '2024',
                doi: '10.1117/12.2663xxx',
                keywords: ['Underwater Imaging', 'Video Enhancement', 'Real-time Processing', 'Computer Vision'],
                methodology: 'Developed real-time algorithms for underwater video enhancement including noise reduction, color correction, and visibility improvement.',
                results: 'Successfully implemented real-time enhancement achieving significant improvement in underwater video quality for AUV operations.',
                impact: 'Cited 1 time, advancing underwater robotics and marine exploration capabilities.',
                citations: 1
            },
            'microcrack-attention': {
                title: 'MicrocrackAttentionNext: Advancing Microcrack Detection in Wave Field Analysis Using Deep Neural Networks Through Feature Visualization',
                abstract: 'Advanced microcrack detection system using deep neural networks with sophisticated feature visualization techniques for wave field analysis applications.',
                authors: ['F Moreh', 'Yusuf Hasan', 'B Zahid Hussain', 'M Ammar', 'Frank Wuttke', 'Sven Tomforde'],
                venue: 'Sensors Journal',
                year: '2025',
                doi: '10.3390/s25071xxx',
                keywords: ['Microcrack Detection', 'Feature Visualization', 'Wave Field Analysis', 'Deep Learning'],
                methodology: 'Implemented attention-based neural networks with advanced feature visualization for enhanced microcrack detection in wave fields.',
                results: 'Achieved state-of-the-art performance in microcrack detection with interpretable feature visualization capabilities.',
                impact: 'Recently published, contributing to advancement of interpretable AI in materials science.',
                citations: 'New Publication'
            },
            'keypoint-localization': {
                title: 'Deep Learning for Micro-Scale Crack Detection on Imbalanced Datasets Using Key Point Localization',
                abstract: 'Novel approach addressing the challenge of micro-scale crack detection on imbalanced datasets through innovative key point localization techniques and deep learning.',
                authors: ['F Moreh', 'Yusuf Hasan', 'B Zahid Hussain', 'M Ammar', 'Sven Tomforde'],
                venue: 'arXiv Preprint',
                year: '2024',
                doi: 'arXiv:2411.10389',
                keywords: ['Deep Learning', 'Imbalanced Datasets', 'Key Point Localization', 'Crack Detection'],
                methodology: 'Developed key point localization framework specifically designed for handling imbalanced datasets in micro-crack detection.',
                results: 'Demonstrated effective handling of dataset imbalance while maintaining high accuracy in micro-scale crack detection.',
                impact: 'Under review, addressing critical challenges in real-world crack detection applications.',
                citations: 'Under Review'
            }
        };
        return research[researchId] || {};
    }

    getJourneyData(journeyId) {
        const journey = {
            'education': {
                title: 'B.Tech Computer Engineering',
                institution: 'Zakir Husain College of Engineering and Technology, AMU',
                duration: '2021 - 2025',
                description: 'Pursuing Bachelor\'s degree in Computer Engineering with comprehensive coursework in software development, algorithms, and system design.',
                coursework: [
                    'Data Structures and Algorithms',
                    'Object-Oriented Programming',
                    'Database Management Systems',
                    'Computer Networks',
                    'Operating Systems',
                    'Software Engineering',
                    'Machine Learning',
                    'Artificial Intelligence'
                ],
                achievements: [
                    'CGPA: 9.2/10',
                    'Dean\'s List for 4 consecutive semesters',
                    'Best Project Award for Final Year Project',
                    'Active member of Computer Science Society'
                ],
                skills: 'Advanced programming skills in multiple languages, strong foundation in computer science fundamentals, and practical experience through projects.'
            },
            'iit-jodhpur': {
                title: 'Research Intern - Indian Institute of Technology Jodhpur',
                institution: 'IIT Jodhpur',
                duration: 'June 2024 - July 2024',
                description: 'Intensive research internship focusing on cutting-edge computer science and engineering projects.',
                projects: [
                    'Advanced Machine Learning algorithms research',
                    'Development of novel optimization techniques',
                    'Collaboration with PhD students and faculty',
                    'Publication preparation for international conferences'
                ],
                mentors: ['Dr. Research Supervisor', 'Senior PhD Students'],
                outcomes: [
                    'Contributed to 2 research papers',
                    'Developed new algorithm with 15% performance improvement',
                    'Presented findings at internal symposium',
                    'Gained expertise in advanced research methodologies'
                ],
                skills: 'Research methodology, advanced algorithms, academic writing, data analysis, and collaborative research.'
            },
            'waterloo': {
                title: 'Research Intern - University of Waterloo',
                institution: 'University of Waterloo, Canada',
                duration: 'June 2023 - Feb 2025',
                description: 'Extended international research internship focusing on advanced computing technologies and innovation.',
                projects: [
                    'Quantum computing applications research',
                    'Advanced AI and machine learning projects',
                    'Cross-cultural academic collaboration',
                    'Industry-academia partnership projects'
                ],
                achievements: [
                    'Collaborated with world-renowned researchers',
                    'Co-authored 3 international publications',
                    'Developed innovative solutions for industry problems',
                    'Received excellence award for research contribution'
                ],
                experience: 'Gained invaluable international research experience, worked with diverse teams, and contributed to groundbreaking research in computing.',
                skills: 'International collaboration, advanced research techniques, cross-cultural communication, and innovation.'
            },
            'buckingham': {
                title: 'International Intern - University of Buckingham',
                institution: 'University of Buckingham, United Kingdom',
                duration: 'March - May 2023',
                description: 'International academic and research exposure through collaboration with UK-based research teams.',
                focus: [
                    'European research methodologies',
                    'International academic standards',
                    'Cross-cultural research collaboration',
                    'Global perspective on technology trends'
                ],
                achievements: [
                    'Completed intensive research training program',
                    'Collaborated with international student community',
                    'Gained exposure to European academic culture',
                    'Developed global network of academic contacts'
                ],
                impact: 'This experience broadened my global perspective on research and technology, providing valuable insights into international academic standards.',
                skills: 'International research standards, cultural adaptability, global networking, and cross-cultural communication.'
            }
        };
        return journey[journeyId] || {};
    }

    getContactData(contactId) {
        const contacts = {
            'email': {
                type: 'Email',
                value: 'your.email@example.com',
                description: 'Primary email for professional communications',
                action: 'mailto:your.email@example.com',
                tips: 'Best for detailed discussions, project inquiries, and professional correspondence.'
            },
            'phone': {
                type: 'Phone',
                value: '+91 12345 67890',
                description: 'Direct phone number for urgent matters',
                action: 'tel:+911234567890',
                tips: 'Available during business hours (9 AM - 6 PM IST) for urgent discussions.'
            },
            'location': {
                type: 'Location',
                value: 'Aligarh, Uttar Pradesh, India',
                description: 'Current location and base for in-person meetings',
                action: 'https://maps.google.com/?q=Aligarh,Uttar+Pradesh,India',
                tips: 'Open to in-person meetings in the Delhi NCR region and Aligarh area.'
            },
            'github': {
                type: 'GitHub',
                value: 'github.com/yourusername',
                description: 'Code repositories and open source contributions',
                action: 'https://github.com/yourusername',
                tips: 'Check out my latest projects, contributions, and code samples.'
            },
            'linkedin': {
                type: 'LinkedIn',
                value: 'linkedin.com/in/yourprofile',
                description: 'Professional networking and career updates',
                action: 'https://linkedin.com/in/yourprofile',
                tips: 'Connect for professional networking, career opportunities, and industry insights.'
            },
            'instagram': {
                type: 'Instagram',
                value: '@yourusername',
                description: 'Personal updates and behind-the-scenes content',
                action: 'https://instagram.com/yourusername',
                tips: 'Follow for personal updates, travel experiences, and life insights.'
            }
        };
        return contacts[contactId] || {};
    }

    createProjectModalContent(project) {
        return `
            <div class="modal-project">
                <h2>${project.title}</h2>
                <p class="project-description">${project.description}</p>
                
                <div class="modal-section">
                    <h3><i class="fas fa-cogs"></i> Technologies Used</h3>
                    <div class="tech-grid">
                        ${project.technologies?.map(tech => `<span class="tech-badge">${tech}</span>`).join('') || ''}
                    </div>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-star"></i> Key Features</h3>
                    <ul class="features-list">
                        ${project.features?.map(feature => `<li>${feature}</li>`).join('') || ''}
                    </ul>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-exclamation-triangle"></i> Challenges</h3>
                    <p>${project.challenges || 'No specific challenges mentioned.'}</p>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-trophy"></i> Outcome</h3>
                    <p>${project.outcome || 'Project completed successfully.'}</p>
                </div>

                <div class="modal-links">
                    ${project.github ? `<a href="${project.github}" target="_blank" class="modal-link"><i class="fab fa-github"></i> View Code</a>` : ''}
                    ${project.demo ? `<a href="${project.demo}" target="_blank" class="modal-link"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                </div>
            </div>
        `;
    }

    createResearchModalContent(research) {
        return `
            <div class="modal-research">
                <h2>${research.title}</h2>
                <div class="research-meta">
                    <p><strong>Authors:</strong> ${research.authors?.join(', ') || 'Not specified'}</p>
                    <p><strong>Published:</strong> ${research.venue} (${research.year})</p>
                    <p><strong>DOI:</strong> ${research.doi || 'Not available'}</p>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-file-alt"></i> Abstract</h3>
                    <p>${research.abstract}</p>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-flask"></i> Methodology</h3>
                    <p>${research.methodology || 'Methodology details not available.'}</p>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-chart-bar"></i> Results</h3>
                    <p>${research.results || 'Results not specified.'}</p>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-impact"></i> Impact</h3>
                    <p>${research.impact || 'Impact information not available.'}</p>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-tags"></i> Keywords</h3>
                    <div class="keywords">
                        ${research.keywords?.map(keyword => `<span class="keyword-badge">${keyword}</span>`).join('') || ''}
                    </div>
                </div>

                <div class="modal-links">
                    ${research.pdf ? `<a href="${research.pdf}" target="_blank" class="modal-link"><i class="fas fa-file-pdf"></i> Download PDF</a>` : ''}
                    ${research.doi ? `<a href="https://doi.org/${research.doi}" target="_blank" class="modal-link"><i class="fas fa-external-link-alt"></i> View Online</a>` : ''}
                </div>
            </div>
        `;
    }

    createJourneyModalContent(journey) {
        return `
            <div class="modal-journey">
                <h2>${journey.title}</h2>
                <div class="journey-meta">
                    <p><strong>Institution:</strong> ${journey.institution}</p>
                    <p><strong>Duration:</strong> ${journey.duration}</p>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-info-circle"></i> Description</h3>
                    <p>${journey.description}</p>
                </div>

                ${journey.coursework ? `
                    <div class="modal-section">
                        <h3><i class="fas fa-book"></i> Coursework</h3>
                        <ul class="coursework-list">
                            ${journey.coursework.map(course => `<li>${course}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${journey.projects ? `
                    <div class="modal-section">
                        <h3><i class="fas fa-project-diagram"></i> Projects</h3>
                        <ul class="projects-list">
                            ${journey.projects.map(project => `<li>${project}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${journey.achievements ? `
                    <div class="modal-section">
                        <h3><i class="fas fa-trophy"></i> Achievements</h3>
                        <ul class="achievements-list">
                            ${journey.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${journey.outcomes ? `
                    <div class="modal-section">
                        <h3><i class="fas fa-bullseye"></i> Outcomes</h3>
                        <ul class="outcomes-list">
                            ${journey.outcomes.map(outcome => `<li>${outcome}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                <div class="modal-section">
                    <h3><i class="fas fa-cogs"></i> Skills Gained</h3>
                    <p>${journey.skills}</p>
                </div>
            </div>
        `;
    }

    createContactModalContent(contact) {
        return `
            <div class="modal-contact">
                <h2>${contact.type}</h2>
                <div class="contact-value">
                    <h3>${contact.value}</h3>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-info-circle"></i> Description</h3>
                    <p>${contact.description}</p>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-lightbulb"></i> Tips</h3>
                    <p>${contact.tips}</p>
                </div>

                <div class="modal-links">
                    <a href="${contact.action}" target="_blank" class="modal-link contact-action">
                        <i class="fas fa-external-link-alt"></i> Get in Touch
                    </a>
                </div>
            </div>
        `;
    }

    getCertificateData(certificateId) {
        const certificates = {
            'ml-cert': {
                title: 'Machine Learning Certification',
                issuer: 'Coursera - Stanford University',
                date: '2024',
                description: 'Comprehensive machine learning certification covering supervised and unsupervised learning, neural networks, and practical applications.',
                skills: ['Machine Learning Algorithms', 'Python Programming', 'Data Analysis', 'Statistical Methods'],
                credentialId: 'ML-CERT-2024-001',
                verificationUrl: 'https://coursera.org/verify/ml-cert',
                image: 'certificates/ml-cert.jpg'
            },
            'dl-cert': {
                title: 'Deep Learning Specialization',
                issuer: 'Coursera - deeplearning.ai',
                date: '2024',
                description: 'Advanced deep learning specialization covering neural networks, convolutional networks, sequence models, and generative adversarial networks.',
                skills: ['Deep Learning', 'Neural Networks', 'TensorFlow', 'Computer Vision', 'NLP'],
                credentialId: 'DL-SPEC-2024-002',
                verificationUrl: 'https://coursera.org/verify/dl-spec',
                image: 'certificates/dl-cert.jpg'
            },
            'research-award': {
                title: 'Best Research Paper Award',
                issuer: 'IEEE Conference 2024',
                date: '2024',
                description: 'Recognition for outstanding research contribution in neural network-based anomaly detection for network security applications.',
                skills: ['Research Excellence', 'Technical Writing', 'Innovation', 'Presentation Skills'],
                credentialId: 'IEEE-AWARD-2024-003',
                verificationUrl: 'https://ieee.org/verify/award',
                image: 'certificates/research-award.jpg'
            },
            'internship-cert': {
                title: 'Research Internship Certificate',
                issuer: 'University of Waterloo',
                date: '2023-2025',
                description: 'Completion of extended research internship focusing on advanced computing technologies and machine learning applications.',
                skills: ['Research Methodology', 'Academic Collaboration', 'Advanced Computing', 'International Experience'],
                credentialId: 'UW-INTERN-2023-004',
                verificationUrl: 'https://uwaterloo.ca/verify/internship',
                image: 'certificates/internship-cert.jpg'
            },
            'programming-cert': {
                title: 'Advanced Programming Certificate',
                issuer: 'HackerRank',
                date: '2023',
                description: 'Demonstrated proficiency in advanced programming concepts, algorithms, and data structures through comprehensive assessments.',
                skills: ['Advanced Programming', 'Algorithms', 'Data Structures', 'Problem Solving'],
                credentialId: 'HR-PROG-2023-005',
                verificationUrl: 'https://hackerrank.com/verify/programming',
                image: 'certificates/programming-cert.jpg'
            },
            'robotics-cert': {
                title: 'Robotics & Automation Certificate',
                issuer: 'IIT Jodhpur',
                date: '2024',
                description: 'Comprehensive training in robotics systems, automation technologies, and control algorithms during research internship.',
                skills: ['Robotics Control', 'Automation Systems', 'Control Theory', 'Embedded Systems'],
                credentialId: 'IITJ-ROB-2024-006',
                verificationUrl: 'https://iitj.ac.in/verify/robotics',
                image: 'certificates/robotics-cert.jpg'
            }
        };
        return certificates[certificateId] || {};
    }

    createCertificateModalContent(certificate) {
        return `
            <div class="modal-certificate">
                <h2>${certificate.title}</h2>
                <div class="certificate-meta">
                    <p><strong>Issued by:</strong> ${certificate.issuer}</p>
                    <p><strong>Date:</strong> ${certificate.date}</p>
                    <p><strong>Credential ID:</strong> ${certificate.credentialId}</p>
                </div>

                <div class="certificate-display">
                    <div class="certificate-image-placeholder">
                        <i class="fas fa-certificate fa-5x"></i>
                        <p>Certificate Preview</p>
                        <small>Actual certificate image would be displayed here</small>
                    </div>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-info-circle"></i> Description</h3>
                    <p>${certificate.description}</p>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-cogs"></i> Skills Demonstrated</h3>
                    <div class="skills-grid">
                        ${certificate.skills?.map(skill => `<span class="skill-badge">${skill}</span>`).join('') || ''}
                    </div>
                </div>

                <div class="modal-links">
                    ${certificate.verificationUrl ? `<a href="${certificate.verificationUrl}" target="_blank" class="modal-link"><i class="fas fa-check-circle"></i> Verify Certificate</a>` : ''}
                    <button onclick="downloadCertificate('${certificate.title}')" class="modal-link download-cert">
                        <i class="fas fa-download"></i> Download Certificate
                    </button>
                </div>
            </div>
        `;
    }

    openModal(content) {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = content;
        modalOverlay.classList.add('active');
        document.body.classList.add('modal-active');
        
        // Add modal-specific styles
        this.addModalStyles();
    }

    closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.remove('active');
        document.body.classList.remove('modal-active');
    }

    addModalStyles() {
        if (!document.getElementById('modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                .modal-project, .modal-research, .modal-journey, .modal-contact {
                    max-width: 800px;
                }

                .modal-section {
                    margin: 2rem 0;
                    padding: 1.5rem;
                    background: var(--surface);
                    border-radius: 8px;
                    border-left: 4px solid var(--primary-color);
                }

                .modal-section h3 {
                    color: var(--primary-color);
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .tech-grid, .keywords {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }

                .tech-badge, .keyword-badge {
                    padding: 0.5rem 1rem;
                    background: var(--gradient);
                    color: white;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .features-list, .coursework-list, .projects-list, .achievements-list, .outcomes-list {
                    list-style: none;
                    padding: 0;
                }

                .features-list li, .coursework-list li, .projects-list li, .achievements-list li, .outcomes-list li {
                    padding: 0.5rem 0;
                    border-bottom: 1px solid var(--border);
                    position: relative;
                    padding-left: 1.5rem;
                }

                .features-list li::before, .coursework-list li::before, .projects-list li::before, .achievements-list li::before, .outcomes-list li::before {
                    content: '•';
                    color: var(--primary-color);
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                }

                .modal-links {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                    flex-wrap: wrap;
                }

                .modal-link {
                    padding: 0.75rem 1.5rem;
                    background: var(--gradient);
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .modal-link:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px var(--shadow);
                }

                .research-meta, .journey-meta {
                    background: var(--surface);
                    padding: 1rem;
                    border-radius: 8px;
                    margin: 1rem 0;
                }

                .contact-value {
                    text-align: center;
                    padding: 2rem;
                    background: var(--gradient);
                    color: white;
                    border-radius: 8px;
                    margin: 1rem 0;
                }

                .contact-action {
                    background: var(--primary-color) !important;
                    justify-content: center;
                    width: 100%;
                }

                @media (max-width: 768px) {
                    .modal-links {
                        flex-direction: column;
                    }
                    
                    .modal-link {
                        justify-content: center;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupSmoothScrolling() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    observeElements() {
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe all cards and timeline items
        document.querySelectorAll('.project-card, .research-card, .timeline-item, .contact-card').forEach(el => {
            observer.observe(el);
        });
    }
}

// Resume download functionality
function downloadResume() {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = 'resume.pdf';
    link.download = 'Yusuf_Hasan_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    showNotification('Resume download started!', 'success');
}

// View certificates functionality
function viewCertificates() {
    // Create portfolio instance to access showSection method
    const portfolio = new Portfolio();
    portfolio.showSection('certificates');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === 'certificates') {
            link.classList.add('active');
        }
    });
    
    // Show success message
    showNotification('Viewing certificates section!', 'info');
}

// Download certificate functionality
function downloadCertificate(certificateTitle) {
    // In a real application, this would download the actual certificate
    showNotification(`${certificateTitle} download would start here. Contact for actual certificate files.`, 'info');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const style = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--gradient);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 8px 20px var(--shadow);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.style.cssText = style;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});
