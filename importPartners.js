const partners = [
  {
    id: 1,
    name: "Matt Garman",
    title: "Chief Executive Officer, Amazon Web Services",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    image: "/PartnersImg/Matt Garman.jpeg",
  },
  {
    id: 2,
    name: "Satya Nadella",
    title: "CEO of Microsoft",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    image: "/PartnersImg/Satya,Microsoft.jpeg",
  },
  {
    id: 3,
    name: "Shantanu Narayen",
    title: "Chairman and CEO of Adobe",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Adobe_Corporate_logo.svg",
    image: "/PartnersImg/Shantanu.jpeg",
  },
  {
    id: 4,
    name: "Fabien Pinckaers",
    title: "Founder & CEO, Odoo",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Odoo_logo.svg",
    image: "/PartnersImg/Fabien.jpeg",
  },
  {
    id: 5,
    name: "Lawrence J. Ellison",
    title: "Chairman and CTO, Oracle",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
    image: "/PartnersImg/Lawrence J. Ellison.jpeg",
  },
  {
    id: 6,
    name: "Eddie Wu Yongming",
    title: "Chairman & CEO, Alibaba Cloud Intelligence",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/AlibabaCloudLogo.svg/960px-AlibabaCloudLogo.svg.png?20210618010512",
    image: "/PartnersImg/Eddie Wu.jpeg",
  },
  {
    id: 7,
    name: "Thomas Kurian",
    title: "CEO, Google Cloud",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
    image: "/PartnersImg/Thomas Kurian .jpeg",
  },
  {
    id: 8,
    name: "Dowson Tong",
    title: "CEO, Tencent Cloud & Smart Industries Group",
    companyLogo: "/PartnersImg/tencent_cloud_logo.png",
    image: "/PartnersImg/DowsonTong.jpeg",
  },
  {
    id: 9,
    name: "Jensen Huang",
    title: "President and CEO of NVIDIA",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
    image: "/PartnersImg/Jensen Huang.jpeg",
  },
  {
    id: 10,
    name: "Christian Klein",
    title: "CEO and Chairman of the Executive Board of SAP SE",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",
    image: "/PartnersImg/Christian Klein .jpeg",
  },
  {
    id: 11,
    name: "Arvind Krishna",
    title: "Chairman and CEO of IBM",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    image: "/PartnersImg/Arvind Krishna.jpeg",
  },
  {
    id: 12,
    name: "Matt Mullenweg",
    title: "CEO of Automattic",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Automattic_logo.svg/960px-Automattic_logo.svg.png?20230625075757",
    image: "/PartnersImg/Matt Mullenweg.jpeg",
  },
  {
    id: 13,
    name: "Dr. Lisa Su",
    title: "Chair and CEO of AMD",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg",
    image: "/PartnersImg/Dr. Lisa Su.jpeg",
  },
];

async function run() {
  const payload = {
    page: "home",
    component: "home",
    contentKey: "coarch_partners",
    value: JSON.stringify(partners),
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
