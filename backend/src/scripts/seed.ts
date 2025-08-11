import prisma from '../config/database';
import { hashPassword } from '../utils/password';

const seedCategories = [
  { name: 'Software Development', slug: 'software-development', description: 'Programming, web development, software engineering', icon: 'code' },
  { name: 'Data Science', slug: 'data-science', description: 'Data analysis, machine learning, AI', icon: 'chart' },
  { name: 'Design', slug: 'design', description: 'UI/UX design, graphic design, product design', icon: 'palette' },
  { name: 'Marketing', slug: 'marketing', description: 'Digital marketing, content marketing, SEO', icon: 'megaphone' },
  { name: 'Sales', slug: 'sales', description: 'Sales representative, account manager, business development', icon: 'trending-up' },
  { name: 'Customer Support', slug: 'customer-support', description: 'Customer service, technical support', icon: 'headphones' },
  { name: 'Human Resources', slug: 'human-resources', description: 'HR, recruiting, people operations', icon: 'users' },
  { name: 'Finance', slug: 'finance', description: 'Accounting, financial analysis, investment', icon: 'dollar-sign' },
  { name: 'Operations', slug: 'operations', description: 'Business operations, project management', icon: 'settings' },
  { name: 'Executive', slug: 'executive', description: 'C-level, VP, director positions', icon: 'star' },
];

const seedCompanies = [
  {
    name: 'TechCorp Inc.',
    slug: 'techcorp-inc',
    description: 'Leading technology company focused on innovative software solutions.',
    industry: 'Technology',
    size: 'LARGE' as const,
    foundedYear: 2010,
    location: 'San Francisco, CA',
    websiteUrl: 'https://techcorp.com',
    benefits: ['Health Insurance', 'Remote Work', '401k', 'Stock Options', 'Learning Budget'],
    cultureTags: ['Innovation', 'Collaboration', 'Growth', 'Diversity'],
    isVerified: true,
  },
  {
    name: 'StartupXYZ',
    slug: 'startupxyz',
    description: 'Fast-growing startup revolutionizing the fintech industry.',
    industry: 'Financial Services',
    size: 'STARTUP' as const,
    foundedYear: 2020,
    location: 'New York, NY',
    websiteUrl: 'https://startupxyz.com',
    benefits: ['Health Insurance', 'Equity', 'Flexible Hours', 'Lunch Provided'],
    cultureTags: ['Fast-paced', 'Innovation', 'Ownership', 'Impact'],
    isVerified: true,
  },
  {
    name: 'Global Solutions Ltd.',
    slug: 'global-solutions-ltd',
    description: 'International consulting firm helping businesses transform digitally.',
    industry: 'Consulting',
    size: 'ENTERPRISE' as const,
    foundedYear: 1995,
    location: 'London, UK',
    websiteUrl: 'https://globalsolutions.com',
    benefits: ['Health Insurance', 'Pension', 'Travel Opportunities', 'Training Budget'],
    cultureTags: ['Global', 'Professional', 'Excellence', 'Teamwork'],
    isVerified: true,
  },
];

const seedUsers = [
  {
    email: 'admin@jobportal.com',
    password: 'Admin123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN' as const,
  },
  {
    email: 'employer@techcorp.com',
    password: 'Employer123!',
    firstName: 'John',
    lastName: 'Recruiter',
    role: 'EMPLOYER' as const,
    phone: '+1-555-0101',
  },
  {
    email: 'jane.doe@example.com',
    password: 'JobSeeker123!',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'JOB_SEEKER' as const,
    phone: '+1-555-0102',
    profile: {
      title: 'Senior Software Developer',
      summary: 'Experienced full-stack developer with 5+ years of experience in React, Node.js, and Python.',
      experienceYears: 5,
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
      location: 'San Francisco, CA',
      salaryExpectationMin: 120000,
      salaryExpectationMax: 150000,
      availability: 'OPEN_TO_OFFERS' as const,
    },
  },
  {
    email: 'mike.smith@example.com',
    password: 'JobSeeker123!',
    firstName: 'Mike',
    lastName: 'Smith',
    role: 'JOB_SEEKER' as const,
    profile: {
      title: 'UX/UI Designer',
      summary: 'Creative designer passionate about creating user-centered digital experiences.',
      experienceYears: 3,
      skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'HTML', 'CSS'],
      location: 'New York, NY',
      salaryExpectationMin: 80000,
      salaryExpectationMax: 100000,
      availability: 'AVAILABLE' as const,
    },
  },
];

const seedJobs = [
  {
    title: 'Senior Full Stack Developer',
    description: 'We are looking for an experienced full-stack developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.',
    requirements: 'Requirements:\n- 5+ years of experience in full-stack development\n- Proficiency in React, Node.js, and TypeScript\n- Experience with PostgreSQL and Redis\n- Knowledge of AWS services\n- Strong problem-solving skills',
    responsibilities: 'Responsibilities:\n- Develop and maintain web applications\n- Collaborate with cross-functional teams\n- Write clean, maintainable code\n- Participate in code reviews\n- Mentor junior developers',
    benefits: 'Benefits:\n- Competitive salary\n- Health, dental, and vision insurance\n- 401(k) with company match\n- Flexible work arrangements\n- Professional development budget',
    location: 'San Francisco, CA',
    remoteType: 'HYBRID' as const,
    employmentType: 'FULL_TIME' as const,
    experienceLevel: 'SENIOR' as const,
    salaryMin: 140000,
    salaryMax: 180000,
    currency: 'USD',
    salaryType: 'YEARLY' as const,
    skillsRequired: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    niceToHaveSkills: ['GraphQL', 'Docker', 'Kubernetes'],
    isFeatured: true,
  },
  {
    title: 'UX/UI Designer',
    description: 'Join our design team to create beautiful and intuitive user experiences for our fintech products. You will work closely with product managers and engineers to bring ideas to life.',
    requirements: 'Requirements:\n- 3+ years of UX/UI design experience\n- Proficiency in Figma and Adobe Creative Suite\n- Strong portfolio demonstrating design skills\n- Experience with user research and testing\n- Knowledge of HTML/CSS is a plus',
    responsibilities: 'Responsibilities:\n- Create user-centered designs for web and mobile\n- Conduct user research and usability testing\n- Collaborate with product and engineering teams\n- Maintain and evolve design systems\n- Present design concepts to stakeholders',
    benefits: 'Benefits:\n- Competitive salary and equity\n- Health insurance\n- Flexible working hours\n- Modern design tools and equipment\n- Team lunches and events',
    location: 'New York, NY',
    remoteType: 'OFFICE' as const,
    employmentType: 'FULL_TIME' as const,
    experienceLevel: 'MID' as const,
    salaryMin: 85000,
    salaryMax: 110000,
    currency: 'USD',
    salaryType: 'YEARLY' as const,
    skillsRequired: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    niceToHaveSkills: ['HTML', 'CSS', 'JavaScript', 'After Effects'],
    isUrgent: true,
  },
  {
    title: 'Data Scientist',
    description: 'We are seeking a skilled data scientist to help us derive insights from large datasets and build machine learning models to improve our products.',
    requirements: 'Requirements:\n- Master\'s degree in Data Science, Statistics, or related field\n- 4+ years of experience in data science\n- Proficiency in Python and R\n- Experience with machine learning frameworks\n- Strong SQL skills',
    responsibilities: 'Responsibilities:\n- Analyze large datasets to identify trends and patterns\n- Build and deploy machine learning models\n- Create data visualizations and reports\n- Collaborate with product and engineering teams\n- Present findings to stakeholders',
    location: 'Remote',
    remoteType: 'REMOTE' as const,
    employmentType: 'FULL_TIME' as const,
    experienceLevel: 'SENIOR' as const,
    salaryMin: 130000,
    salaryMax: 160000,
    currency: 'USD',
    salaryType: 'YEARLY' as const,
    skillsRequired: ['Python', 'R', 'Machine Learning', 'SQL', 'Statistics'],
    niceToHaveSkills: ['TensorFlow', 'PyTorch', 'Spark', 'Tableau'],
  },
  {
    title: 'Frontend Developer Intern',
    description: 'Great opportunity for a student or recent graduate to gain hands-on experience in frontend development with our team.',
    requirements: 'Requirements:\n- Currently pursuing or recently completed degree in Computer Science or related field\n- Basic knowledge of HTML, CSS, and JavaScript\n- Familiarity with React is preferred\n- Eager to learn and grow\n- Good communication skills',
    responsibilities: 'Responsibilities:\n- Assist in developing user interfaces\n- Work on small features and bug fixes\n- Participate in team meetings and code reviews\n- Learn from senior developers\n- Contribute to documentation',
    benefits: 'Benefits:\n- Competitive internship stipend\n- Mentorship from senior developers\n- Flexible schedule\n- Potential for full-time offer\n- Learning opportunities',
    location: 'London, UK',
    remoteType: 'HYBRID' as const,
    employmentType: 'INTERNSHIP' as const,
    experienceLevel: 'ENTRY' as const,
    salaryMin: 2000,
    salaryMax: 2500,
    currency: 'GBP',
    salaryType: 'MONTHLY' as const,
    skillsRequired: ['HTML', 'CSS', 'JavaScript'],
    niceToHaveSkills: ['React', 'Git', 'TypeScript'],
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Clean existing data (in reverse order due to foreign key constraints)
    await prisma.jobApplication.deleteMany();
    await prisma.job.deleteMany();
    await prisma.companyMember.deleteMany();
    await prisma.company.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.jobCategory.deleteMany();

    console.log('🧹 Cleaned existing data');

    // Seed job categories
    const categories = await Promise.all(
      seedCategories.map(category =>
        prisma.jobCategory.create({
          data: category,
        })
      )
    );
    console.log(`✅ Created ${categories.length} job categories`);

    // Seed companies
    const companies = await Promise.all(
      seedCompanies.map(company =>
        prisma.company.create({
          data: company,
        })
      )
    );
    console.log(`✅ Created ${companies.length} companies`);

    // Seed users
    const users = await Promise.all(
      seedUsers.map(async userData => {
        const { profile, ...userDataWithoutProfile } = userData;
        const hashedPassword = await hashPassword(userData.password);
        
        const user = await prisma.user.create({
          data: {
            email: userDataWithoutProfile.email,
            firstName: userDataWithoutProfile.firstName,
            lastName: userDataWithoutProfile.lastName,
            phone: userDataWithoutProfile.phone,
            role: userDataWithoutProfile.role,
            passwordHash: hashedPassword,
          },
        });

        // Create user profile for job seekers
        if (userData.role === 'JOB_SEEKER' && profile) {
          await prisma.userProfile.create({
            data: {
              userId: user.id,
              ...profile,
            },
          });
        }

        return user;
      })
    );
    console.log(`✅ Created ${users.length} users`);

    // Create company memberships
    const employer = users.find(u => u.email === 'employer@techcorp.com');
    const techCorp = companies.find(c => c.slug === 'techcorp-inc');
    
    if (employer && techCorp) {
      await prisma.companyMember.create({
        data: {
          userId: employer.id,
          companyId: techCorp.id,
          role: 'ADMIN',
          title: 'Senior Recruiter',
        },
      });
      console.log('✅ Created company membership');
    }

    // Seed jobs
    const designCategory = categories.find(c => c.slug === 'design');
    const devCategory = categories.find(c => c.slug === 'software-development');
    const dataCategory = categories.find(c => c.slug === 'data-science');

    const jobs = await Promise.all(
      seedJobs.map((jobData, index) => {
        let categoryId: string | undefined;
        let companyId: string;
        let postedBy: string;

        // Assign categories
        if (index === 0) {
          categoryId = devCategory?.id;
          companyId = companies[0].id; // TechCorp
          postedBy = employer!.id;
        } else if (index === 1) {
          categoryId = designCategory?.id;
          companyId = companies[1].id; // StartupXYZ
          postedBy = users[0].id; // Admin (for demo)
        } else if (index === 2) {
          categoryId = dataCategory?.id;
          companyId = companies[0].id; // TechCorp
          postedBy = employer!.id;
        } else {
          categoryId = devCategory?.id;
          companyId = companies[2].id; // Global Solutions
          postedBy = users[0].id; // Admin
        }

        const slug = jobData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        return prisma.job.create({
          data: {
            ...jobData,
            categoryId,
            companyId,
            postedBy,
            slug: `${slug}-${Date.now()}-${index}`, // Ensure uniqueness
          },
        });
      })
    );
    console.log(`✅ Created ${jobs.length} jobs`);

    console.log('🎉 Database seeded successfully!');
    console.log('\nTest accounts:');
    console.log('Admin: admin@jobportal.com / Admin123!');
    console.log('Employer: employer@techcorp.com / Employer123!');
    console.log('Job Seeker: jane.doe@example.com / JobSeeker123!');
    console.log('Job Seeker: mike.smith@example.com / JobSeeker123!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seed().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seed;
