export const statsCards = [
  { title: "Total Reels", value: "2,456", change: "+12.5%", trend: "up" as const, icon: "Film" },
  { title: "Total Views", value: "1.2M", change: "+8.3%", trend: "up" as const, icon: "Eye" },
  { title: "Total Likes", value: "456K", change: "+15.2%", trend: "up" as const, icon: "Heart" },
  { title: "Active Users", value: "12,847", change: "+3.1%", trend: "up" as const, icon: "Users" },
  { title: "Active Ads", value: "156", change: "-2.4%", trend: "down" as const, icon: "Megaphone" },
];

export const viewsOverTime = [
  { name: "Mon", views: 4000, engagement: 2400 },
  { name: "Tue", views: 3000, engagement: 1398 },
  { name: "Wed", views: 5000, engagement: 3800 },
  { name: "Thu", views: 2780, engagement: 3908 },
  { name: "Fri", views: 1890, engagement: 4800 },
  { name: "Sat", views: 6390, engagement: 3800 },
  { name: "Sun", views: 3490, engagement: 4300 },
];

export const engagementData = [
  { name: "Mon", rate: 65 },
  { name: "Tue", rate: 40 },
  { name: "Wed", rate: 75 },
  { name: "Thu", rate: 50 },
  { name: "Fri", rate: 80 },
  { name: "Sat", rate: 60 },
  { name: "Sun", rate: 55 },
];

export const projectWorkData = [
  { name: "Overdue", value: 44, color: "#22c55e" },
  { name: "In Progress", value: 24, color: "#eab308" },
  { name: "Completed", value: 18, color: "#3b82f6" },
  { name: "Not Started", value: 14, color: "#1e293b" },
];

export const recentReels = [
  { id: 1, title: "Summer Vibes Compilation", category: "Entertainment", views: "45.2K", likes: "12.3K", date: "2024-03-15", status: "published", engagement: 27.2 },
  { id: 2, title: "Cooking Masterclass", category: "Food", views: "32.1K", likes: "8.7K", date: "2024-03-14", status: "published", engagement: 27.1 },
  { id: 3, title: "Travel Diary - Bali", category: "Travel", views: "28.9K", likes: "9.1K", date: "2024-03-14", status: "published", engagement: 31.5 },
  { id: 4, title: "Fitness Morning Routine", category: "Health", views: "19.5K", likes: "5.2K", date: "2024-03-13", status: "draft", engagement: 26.7 },
  { id: 5, title: "Tech Review 2024", category: "Tech", views: "56.8K", likes: "15.4K", date: "2024-03-13", status: "published", engagement: 27.1 },
];

export const allReels = [
  ...recentReels,
  { id: 6, title: "DIY Home Decor", category: "Lifestyle", views: "22.3K", likes: "6.1K", date: "2024-03-12", status: "published", engagement: 27.4 },
  { id: 7, title: "Music Festival Highlights", category: "Entertainment", views: "67.4K", likes: "18.9K", date: "2024-03-11", status: "published", engagement: 28.0 },
  { id: 8, title: "Pet Care Tips", category: "Pets", views: "15.2K", likes: "4.8K", date: "2024-03-10", status: "draft", engagement: 31.6 },
  { id: 9, title: "Street Food Tour", category: "Food", views: "41.7K", likes: "11.2K", date: "2024-03-09", status: "published", engagement: 26.9 },
  { id: 10, title: "Yoga for Beginners", category: "Health", views: "33.8K", likes: "9.5K", date: "2024-03-08", status: "draft", engagement: 28.1 },
];

export const users = [
  { id: 1, name: "Alex Holland", email: "alex@example.com", phone: "+1 234 567 890", city: "New York", interests: ["Tech", "Travel"], profession: "Developer", avatar: "", status: "active" },
  { id: 2, name: "Sarah Chen", email: "sarah@example.com", phone: "+1 345 678 901", city: "San Francisco", interests: ["Food", "Fitness"], profession: "Designer", avatar: "", status: "active" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1 456 789 012", city: "Chicago", interests: ["Music", "Sports"], profession: "Manager", avatar: "", status: "inactive" },
  { id: 4, name: "Emma Wilson", email: "emma@example.com", phone: "+1 567 890 123", city: "Boston", interests: ["Art", "Photography"], profession: "Photographer", avatar: "", status: "active" },
  { id: 5, name: "David Kim", email: "david@example.com", phone: "+1 678 901 234", city: "Seattle", interests: ["Gaming", "Tech"], profession: "Engineer", avatar: "", status: "active" },
  { id: 6, name: "Lisa Park", email: "lisa@example.com", phone: "+1 789 012 345", city: "Austin", interests: ["Cooking", "Travel"], profession: "Chef", avatar: "", status: "active" },
];

export const ads = [
  { id: 1, title: "Summer Sale Campaign", type: "Video" as const, status: "active", impressions: "125K", clicks: "8.2K", ctr: "6.56%", startDate: "2024-03-01", endDate: "2024-03-31", budget: "$2,500", targeting: { city: "New York", interests: ["Fashion", "Shopping"], categories: ["Retail"] } },
  { id: 2, title: "New Product Launch", type: "Image" as const, status: "active", impressions: "89K", clicks: "5.1K", ctr: "5.73%", startDate: "2024-03-10", endDate: "2024-04-10", budget: "$1,800", targeting: { city: "Los Angeles", interests: ["Tech"], categories: ["Electronics"] } },
  { id: 3, title: "Brand Awareness", type: "Text" as const, status: "paused", impressions: "45K", clicks: "2.3K", ctr: "5.11%", startDate: "2024-02-15", endDate: "2024-03-15", budget: "$1,200", targeting: { city: "Chicago", interests: ["Sports"], categories: ["Fitness"] } },
  { id: 4, title: "Holiday Special", type: "Video" as const, status: "completed", impressions: "234K", clicks: "15.6K", ctr: "6.67%", startDate: "2024-01-01", endDate: "2024-01-31", budget: "$3,500", targeting: { city: "Miami", interests: ["Travel"], categories: ["Tourism"] } },
];

export const adPerformanceData = [
  { name: "Week 1", impressions: 12000, clicks: 800 },
  { name: "Week 2", impressions: 18000, clicks: 1200 },
  { name: "Week 3", impressions: 22000, clicks: 1500 },
  { name: "Week 4", impressions: 28000, clicks: 1900 },
];

export const admins = [
  { id: 1, name: "John Smith", email: "john@admin.com", role: "Super Admin" as const, lastLogin: "2024-03-15 10:30", status: "active" },
  { id: 2, name: "Jane Doe", email: "jane@admin.com", role: "Content Manager" as const, lastLogin: "2024-03-15 09:15", status: "active" },
  { id: 3, name: "Bob Wilson", email: "bob@admin.com", role: "Ads Manager" as const, lastLogin: "2024-03-14 16:45", status: "active" },
  { id: 4, name: "Alice Brown", email: "alice@admin.com", role: "Content Manager" as const, lastLogin: "2024-03-13 14:20", status: "inactive" },
];

export const scheduleItems = [
  { id: 1, title: "Resume Screening", subtitle: "ENGINEERING", time: "1:00PM", date: "May 15, 2024", color: "bg-success/10 text-success" },
  { id: 2, title: "Interview Scheduling", subtitle: "ENGINEERING", time: "2:30PM", date: "May 15, 2024", color: "bg-warning/10 text-warning" },
  { id: 3, title: "Candidate Communication", subtitle: "MARKETING", time: "3:00PM", date: "May 15, 2024", color: "bg-info/10 text-info" },
  { id: 4, title: "Offer Management", subtitle: "SELECTION", time: "4:00PM", date: "May 15, 2024", color: "bg-accent text-accent-foreground" },
];

export const reminders = [
  { id: 1, time: "09:30 AM", title: "CHECK TEST RESULTS", priority: "high" as const },
  { id: 2, time: "09:30 AM", title: "CLIENT PRESENTATION", priority: "low" as const },
];

export const activityData = [
  { name: "Mon", value: 80 },
  { name: "Tue", value: 45 },
  { name: "Wed", value: 75 },
  { name: "Thu", value: 0 },
  { name: "Fri", value: 0 },
  { name: "Sat", value: 50 },
  { name: "Sun", value: 0 },
];
