const products = [
  // --- Products ---
  {
    id: 1,
    title: "Human Resource Management (HRM)",
    description: "Streamline HR processes with our comprehensive management system for workforce optimization.",
    icon: "/producticon/HRM PNG BG.png",
    bgColor: "bg-[#F5D6D6]",
    category: "Products",
  },
  {
    id: 2,
    title: "Business Brain 24",
    description: "Integrated enterprise resource planning solution to synchronize business operations and data.",
    icon: "/10023.png",
    bgColor: "bg-[#D9D9FB]",
    category: "Products",
  },
  {
    id: 3,
    title: "Count Trust",
    description: "Advanced financial tracking and trust management platform for secure transactions.",
    icon: "/producticon/All Icon-03.png",
    bgColor: "bg-[#D6F5F0]",
    category: "Products",
  },
  {
    id: 4,
    title: "Agentic AI",
    description: "Autonomous AI agents designed to solve complex problems and execute tasks independently.",
    icon: "/producticon/All Icon-01.png",
    bgColor: "bg-[#FDE7C4]",
    category: "Products",
  },
  {
    id: 5,
    title: "Talkora AI",
    description: "Next-gen conversational AI platform delivering human-like customer engagement experiences.",
    icon: "/producticon/All Icon-02.png",
    bgColor: "bg-[#F5D6D6]",
    category: "Products",
  },

  // --- Services ---
  {
    id: 6,
    title: "Cloud Modernization",
    description: "Transform your legacy systems into agile, scalable cloud-native architectures.",
    image: "/Services/Cloud Modernization.png",
    category: "Services",
  },
  {
    id: 7,
    title: "Cloud Strategy & Readiness",
    description: "Expert assessment and planning to ensure a smooth and successful cloud adoption journey.",
    image: "/Services/Cloud Strategy & Readiness.png",
    category: "Services",
  },
  {
    id: 8,
    title: "App Modernization & Migration",
    description: "Modernize applications and migrate them seamlessly to secure cloud environments.",
    image: "/Services/App Modernization & Migration.png",
    category: "Services",
  },
  {
    id: 9,
    title: "Cloud Optimization & Governance",
    description: "Maximize cost-efficiency and ensure strict security and compliance across your cloud infrastructure.",
    image: "/Services/Gemini_Generated_Image_thro3bthro3bthro (1).png",
    category: "Services",
  },
  {
    id: 10,
    title: "AI & Analytics",
    description: "Unlock the value of your data with advanced artificial intelligence and analytics strategies.",
    image: "/Services/AI & Analytics.png",
    category: "Services",
  },
  {
    id: 11,
    title: "Data Strategy & Governance",
    description: "Build robust frameworks for data management, quality assurance, and regulatory compliance.",
    image: "/Services/Data Strategy & Governance.png",
    category: "Services",
  },
  {
    id: 12,
    title: "Data Engineering & Platforms",
    description: "Design and implement scalable data architectures to support your growing analytics needs.",
    image: "/Services/Data Engineering & Platforms.png",
    category: "Services",
  },
  {
    id: 13,
    title: "Cybersecurity Services",
    description: "Comprehensive protection strategies to safeguard your digital assets and infrastructure.",
    image: "/Services/Cybersecurity Services.png",
    category: "Services",
  },
  {
    id: 14,
    title: "Threat Detection & Response",
    description: "Proactive threat hunting and rapid incident response to maintain business resilience.",
    image: "/Services/Threat Detection & Response.png",
    category: "Services",
  },
  {
    id: 15,
    title: "Managed Security Services",
    description: "24/7 security monitoring and management operations to keep your business safe around the clock.",
    image: "/Services/Managed Security Services.png",
    category: "Services",
  },
  {
    id: 16,
    title: "Software Development",
    description: "Custom software solutions tailored to meet your unique business challenges and goals.",
    image: "/Services/Gemini_Generated_Image_h4l91yh4l91yh4l9.png",
    category: "Services",
  },
  {
    id: 17,
    title: "Mobile Apps Development",
    description: "Bespoke high-performance applications designed for both iOS and Android platforms.",
    image: "/Services/Gemini_Generated_Image_1t6gtm1t6gtm1t6g.png",
    category: "Services",
  },
  {
    id: 18,
    title: "DevOps & Automation",
    description: "Accelerate delivery pipelines with Agile methodologies, DevOps practices, and intelligent automation.",
    image: "/Services/Managed Security Services.png",
    category: "Services",
  },
  {
    id: 19,
    title: "Managed IT Services",
    description: "Reliable, end-to-end IT management to keep your business operations running smoothly.",
    image: "/Services/AutomationManaged IT Services.png",
    category: "Services",
  },
  {
    id: 20,
    title: "Resource Augmentation",
    description: "Scale your team instantly with our pool of highly skilled IT professionals and engineers.",
    image: "/Services/Resource Augmentation.png",
    category: "Services",
  },

  // --- Solutions ---
  {
    id: 21,
    title: "Secure Business Productivity",
    description: "Enhance workforce productivity while maintaining top-tier security standards.",
    image: "/product9.webp",
    category: "Solutions",
  },
  {
    id: 22,
    title: "Endpoint Security Solutions",
    description: "Robust protection for all network endpoints against evolving cyber threats.",
    image: "/product1.webp",
    category: "Solutions",
  },
  {
    id: 23,
    title: "Modern Work Solutions",
    description: "Innovative tools and platforms customized for the modern, hybrid digital workplace.",
    image: "/product2.webp",
    category: "Solutions",
  },
  {
    id: 24,
    title: "Infrastructure Security",
    description: "Fortify your physical and virtual infrastructure against unauthorized access and attacks.",
    image: "/product3.webp",
    category: "Solutions",
  },
  {
    id: 25,
    title: "Identity & Access Support",
    description: "Secure identity management and access control solutions for enterprise environments.",
    image: "/product5.webp",
    category: "Solutions",
  },
  {
    id: 26,
    title: "Data Security Solutions",
    description: "Protect your sensitive data throughout its entire lifecycle, from creation to deletion.",
    image: "/product6.webp",
    category: "Solutions",
  },
  {
    id: 27,
    title: "IoT Security Solutions",
    description: "Comprehensive security measures to protect your Internet of Things ecosystem.",
    image: "/product7.webp",
    category: "Solutions",
  },
  {
    id: 28,
    title: "Cyber Security Operations",
    description: "Streamline your security operations center (SOC) for faster threat detection and response.",
    image: "/product8.webp",
    category: "Solutions",
  },
  {
    id: 29,
    title: "Data Center Management",
    description: "Optimize data center performance, security, and virtualization for peak efficiency.",
    image: "/product9.webp",
    category: "Solutions",
  },
  {
    id: 30,
    title: "Enterprise Networking",
    description: "Reliable, scalable, and secure networking solutions to connect your global enterprise.",
    image: "/product1.webp",
    category: "Solutions",
  },
  {
    id: 31,
    title: "Hybrid Cloud & DevOps",
    description: "Seamlessly integrate on-premise and cloud environments with efficient DevOps workflows.",
    image: "/product2.webp",
    category: "Solutions",
  },
  {
    id: 32,
    title: "Digital & App Innovation",
    description: "Create cutting-edge digital experiences and innovative applications for your customers.",
    image: "/product3.webp",
    category: "Solutions",
  },
  {
    id: 33,
    title: "AI & Business Analytics",
    description: "Leverage artificial intelligence to drive business growth and optimize decision-making.",
    image: "/product5.webp",
    category: "Solutions",
  },
  {
    id: 34,
    title: "Business Applications",
    description: "Core business application solutions designed to drive operational efficiency and growth.",
    image: "/product6.webp",
    category: "Solutions",
  },
];

async function run() {
  const payload = {
    page: "home",
    component: "home",
    contentKey: "products_cards",
    value: JSON.stringify(products),
    type: "json"
  };

  const res = await fetch("http://localhost:6005/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  console.log(res.status, text);
}

run();
