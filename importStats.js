const stats = [
  {
    id: 1,
    stat: "5,000+",
    label: "Associates",
    description:
      "Our dedicated professionals working together across various sectors to deliver excellence and innovation.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=50&w=1200&auto=format&fit=crop",
    gradient: "from-cyan-500/80 to-blue-500/80",
  },
  {
    id: 2,
    stat: "22+",
    label: "Strategic Business Units",
    description:
      "A diverse portfolio of specialized enterprises driving industrial growth and technological advancement.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=50&w=1200&auto=format&fit=crop",
    gradient: "from-orange-400/80 to-red-500/80",
  },
  {
    id: 3,
    stat: "10M+",
    label: "Lives Touched",
    description:
      "Making a significant social impact through our commitment to sustainable development and community welfare.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=50&w=1200&auto=format&fit=crop",
    gradient: "from-teal-400/80 to-emerald-500/80",
  },
];

async function run() {
  const payload = {
    page: "home",
    component: "home",
    contentKey: "stats_cards",
    value: JSON.stringify(stats),
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
