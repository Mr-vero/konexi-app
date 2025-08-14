-- Seed data for jobs table
-- This script creates 100+ realistic job postings from various companies and industries

-- First, let's create a test user (you'll need to replace this with a real user ID from your auth.users table)
-- For seeding purposes, we'll use a placeholder UUID
DO $$
DECLARE
  test_user_id UUID := 'ac292ff6-7188-4d5d-8350-d5f9c4d7d1a2';
BEGIN
  -- Technology Jobs
  INSERT INTO jobs (user_id, title, company_name, description, location, job_type) VALUES
  (test_user_id, 'Senior Software Engineer', 'Google', 'We are looking for a Senior Software Engineer to join our Cloud Platform team. You will be responsible for designing and implementing large-scale distributed systems that power Google Cloud services. Required: 5+ years of experience with Java, Python, or Go, strong knowledge of distributed systems, and experience with cloud technologies.', 'Mountain View, CA', 'Full-Time'),
  (test_user_id, 'Frontend Developer', 'Netflix', 'Join our UI Engineering team to build the next generation of Netflix experiences. You will work with React, TypeScript, and Node.js to create performant and accessible web applications used by millions. Required: 3+ years of frontend development experience, expertise in React and modern JavaScript.', 'Los Gatos, CA', 'Full-Time'),
  (test_user_id, 'DevOps Engineer', 'Amazon Web Services', 'AWS is seeking a DevOps Engineer to help build and maintain our cloud infrastructure. You will work with Kubernetes, Terraform, and AWS services to ensure high availability and scalability. Required: Experience with CI/CD pipelines, containerization, and infrastructure as code.', 'Seattle, WA', 'Full-Time'),
  (test_user_id, 'Data Scientist', 'Meta', 'Join our Data Science team to analyze user behavior and improve our products. You will work with large datasets, build ML models, and provide insights that drive product decisions. Required: MS/PhD in Computer Science or related field, experience with Python, SQL, and machine learning frameworks.', 'Menlo Park, CA', 'Full-Time'),
  (test_user_id, 'iOS Developer', 'Apple', 'Be part of the team that creates amazing iOS experiences. You will work on core iOS frameworks and applications used by billions. Required: 3+ years of iOS development, expertise in Swift and Objective-C, understanding of iOS design patterns.', 'Cupertino, CA', 'Full-Time'),
  (test_user_id, 'Backend Engineer', 'Stripe', 'Help build the economic infrastructure of the internet. You will work on payment processing systems, APIs, and distributed systems that handle billions in transactions. Required: Experience with Ruby, Go, or Java, understanding of payment systems, and distributed computing.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'Machine Learning Engineer', 'OpenAI', 'Join us in developing cutting-edge AI systems. You will work on large language models, reinforcement learning, and novel AI applications. Required: Strong background in ML/AI, experience with PyTorch or TensorFlow, and publications in top conferences.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'Full Stack Developer', 'Microsoft', 'Work on Microsoft Teams to build collaborative experiences. You will use React, C#, and Azure services to create features used by millions of users worldwide. Required: 3+ years full-stack experience, proficiency in JavaScript and C#.', 'Redmond, WA', 'Full-Time'),
  (test_user_id, 'Site Reliability Engineer', 'LinkedIn', 'Ensure the reliability and performance of LinkedIn''s platform. You will work on monitoring, incident response, and infrastructure automation. Required: Experience with SRE practices, knowledge of Linux systems, and scripting skills.', 'Sunnyvale, CA', 'Full-Time'),
  (test_user_id, 'Android Developer', 'Spotify', 'Build the future of music streaming on Android. You will work with Kotlin, Android SDK, and create features that delight millions of users. Required: 3+ years Android development, expertise in Kotlin, understanding of Android architecture components.', 'New York, NY', 'Full-Time'),
  
  -- Remote Technology Jobs
  (test_user_id, 'Senior Backend Engineer', 'GitLab', 'Join our distributed team building the DevOps platform. Work with Ruby on Rails, PostgreSQL, and Redis to build features used by developers worldwide. Required: 5+ years backend experience, Ruby expertise, and experience with large-scale applications.', 'Remote', 'Full-Time'),
  (test_user_id, 'React Developer', 'Vercel', 'Help build the future of web development. You will work on Next.js and our deployment platform. Required: Strong React skills, experience with TypeScript, and passion for developer tools.', 'Remote', 'Full-Time'),
  (test_user_id, 'Cloud Architect', 'HashiCorp', 'Design cloud infrastructure solutions using our tools. You will work with Terraform, Vault, and Consul to help enterprises adopt cloud technologies. Required: Cloud architecture experience, knowledge of IaC, and strong communication skills.', 'Remote', 'Full-Time'),
  (test_user_id, 'Security Engineer', 'Cloudflare', 'Protect the internet from threats. You will work on security systems, threat detection, and incident response. Required: Security expertise, knowledge of networking protocols, and programming skills.', 'Remote', 'Full-Time'),
  (test_user_id, 'Platform Engineer', 'GitHub', 'Build the platform that developers love. You will work on GitHub Actions, API services, and core platform features. Required: Experience with distributed systems, API design, and platform engineering.', 'Remote', 'Full-Time'),

  -- Finance & FinTech Jobs
  (test_user_id, 'Financial Analyst', 'Goldman Sachs', 'Join our investment banking division to analyze market trends and support deal execution. You will create financial models, conduct due diligence, and prepare client presentations. Required: Bachelor''s in Finance/Economics, 2+ years experience, strong Excel and financial modeling skills.', 'New York, NY', 'Full-Time'),
  (test_user_id, 'Quantitative Developer', 'JP Morgan Chase', 'Build trading systems and risk management platforms. You will work with C++, Python, and real-time data systems. Required: Strong programming skills, understanding of financial markets, and quantitative background.', 'New York, NY', 'Full-Time'),
  (test_user_id, 'Risk Manager', 'Bank of America', 'Manage and assess financial risks across our investment portfolio. You will develop risk models, monitor exposures, and ensure compliance. Required: Risk management experience, knowledge of derivatives, and strong analytical skills.', 'Charlotte, NC', 'Full-Time'),
  (test_user_id, 'Blockchain Developer', 'Coinbase', 'Build the future of cryptocurrency. You will work on blockchain protocols, smart contracts, and crypto trading systems. Required: Blockchain development experience, Solidity knowledge, and understanding of DeFi.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'Investment Analyst', 'BlackRock', 'Analyze investment opportunities and manage client portfolios. You will conduct research, build models, and make investment recommendations. Required: CFA progress, analytical skills, and investment experience.', 'New York, NY', 'Full-Time'),

  -- Healthcare Jobs
  (test_user_id, 'Clinical Data Analyst', 'Mayo Clinic', 'Analyze clinical data to improve patient outcomes. You will work with electronic health records, build dashboards, and provide insights to medical teams. Required: Healthcare analytics experience, SQL skills, and knowledge of HIPAA compliance.', 'Rochester, MN', 'Full-Time'),
  (test_user_id, 'Healthcare IT Specialist', 'Kaiser Permanente', 'Implement and maintain healthcare IT systems. You will work with EHR systems, ensure data security, and support clinical staff. Required: Healthcare IT experience, knowledge of HL7/FHIR, and technical support skills.', 'Oakland, CA', 'Full-Time'),
  (test_user_id, 'Medical Device Software Engineer', 'Medtronic', 'Develop software for life-saving medical devices. You will work on embedded systems, ensure FDA compliance, and create reliable medical software. Required: Embedded programming experience, knowledge of medical device regulations, and C/C++ expertise.', 'Minneapolis, MN', 'Full-Time'),
  (test_user_id, 'Telemedicine Platform Developer', 'Teladoc Health', 'Build platforms that connect patients with doctors remotely. You will work on video conferencing, scheduling systems, and mobile health apps. Required: Full-stack development skills, video streaming experience, and healthcare domain knowledge.', 'Remote', 'Full-Time'),
  (test_user_id, 'Health Informatics Specialist', 'Cerner', 'Design and implement health information systems. You will work on data integration, clinical workflows, and decision support systems. Required: Health informatics degree, database skills, and clinical knowledge.', 'Kansas City, MO', 'Full-Time'),

  -- E-commerce & Retail Jobs
  (test_user_id, 'E-commerce Manager', 'Amazon', 'Manage product categories and drive sales growth. You will analyze data, optimize listings, and work with vendors. Required: E-commerce experience, analytical skills, and project management abilities.', 'Seattle, WA', 'Full-Time'),
  (test_user_id, 'Supply Chain Analyst', 'Walmart', 'Optimize our supply chain operations. You will analyze logistics data, improve processes, and reduce costs. Required: Supply chain knowledge, data analysis skills, and experience with ERP systems.', 'Bentonville, AR', 'Full-Time'),
  (test_user_id, 'Digital Marketing Manager', 'Target', 'Lead digital marketing campaigns to drive online sales. You will manage paid search, social media, and email marketing. Required: Digital marketing experience, knowledge of marketing analytics, and creative skills.', 'Minneapolis, MN', 'Full-Time'),
  (test_user_id, 'UX Designer', 'Shopify', 'Design intuitive e-commerce experiences. You will create user interfaces, conduct research, and improve conversion rates. Required: UX design portfolio, prototyping skills, and e-commerce understanding.', 'Toronto, Canada', 'Full-Time'),
  (test_user_id, 'Inventory Planning Manager', 'Home Depot', 'Manage inventory levels across stores. You will forecast demand, optimize stock levels, and reduce waste. Required: Inventory management experience, analytical skills, and retail knowledge.', 'Atlanta, GA', 'Full-Time'),

  -- Marketing & Advertising Jobs
  (test_user_id, 'Brand Manager', 'Procter & Gamble', 'Lead brand strategy for consumer products. You will develop marketing campaigns, analyze market data, and drive brand growth. Required: Brand management experience, MBA preferred, and strategic thinking.', 'Cincinnati, OH', 'Full-Time'),
  (test_user_id, 'Content Marketing Specialist', 'HubSpot', 'Create compelling content that drives leads. You will write blog posts, create videos, and manage content strategy. Required: Content creation skills, SEO knowledge, and marketing experience.', 'Cambridge, MA', 'Full-Time'),
  (test_user_id, 'Social Media Manager', 'Nike', 'Manage Nike''s social media presence. You will create content, engage with communities, and measure performance. Required: Social media expertise, creative skills, and brand management experience.', 'Beaverton, OR', 'Full-Time'),
  (test_user_id, 'Growth Marketing Manager', 'Airbnb', 'Drive user acquisition and retention. You will run experiments, optimize funnels, and scale growth channels. Required: Growth marketing experience, analytical skills, and data-driven mindset.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'SEO Specialist', 'Zillow', 'Optimize our web presence for search engines. You will conduct keyword research, implement technical SEO, and improve rankings. Required: SEO expertise, technical knowledge, and analytical skills.', 'Seattle, WA', 'Full-Time'),

  -- Sales Jobs
  (test_user_id, 'Enterprise Account Executive', 'Salesforce', 'Sell CRM solutions to enterprise clients. You will manage complex sales cycles, build relationships, and exceed quotas. Required: Enterprise sales experience, CRM knowledge, and strong communication skills.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'Business Development Representative', 'Zoom', 'Generate new business opportunities. You will prospect leads, qualify opportunities, and book meetings. Required: BDR/SDR experience, communication skills, and persistence.', 'San Jose, CA', 'Full-Time'),
  (test_user_id, 'Sales Engineer', 'MongoDB', 'Provide technical expertise in sales cycles. You will demo products, design solutions, and support POCs. Required: Technical background, presentation skills, and database knowledge.', 'New York, NY', 'Full-Time'),
  (test_user_id, 'Regional Sales Manager', 'Oracle', 'Lead a team of sales professionals. You will develop strategy, coach team members, and drive revenue. Required: Sales leadership experience, team management skills, and strategic thinking.', 'Austin, TX', 'Full-Time'),
  (test_user_id, 'Inside Sales Representative', 'Adobe', 'Sell creative software solutions. You will handle inbound leads, conduct demos, and close deals. Required: Inside sales experience, software knowledge, and closing skills.', 'San Jose, CA', 'Full-Time'),

  -- Human Resources Jobs
  (test_user_id, 'HR Business Partner', 'Facebook', 'Partner with engineering teams on HR initiatives. You will handle employee relations, performance management, and organizational development. Required: HRBP experience, tech industry knowledge, and strong interpersonal skills.', 'Menlo Park, CA', 'Full-Time'),
  (test_user_id, 'Technical Recruiter', 'Tesla', 'Recruit top engineering talent. You will source candidates, conduct interviews, and manage hiring processes. Required: Technical recruiting experience, sourcing skills, and engineering knowledge.', 'Palo Alto, CA', 'Full-Time'),
  (test_user_id, 'Compensation Analyst', 'PayPal', 'Design and implement compensation programs. You will analyze market data, create pay structures, and ensure equity. Required: Compensation experience, analytical skills, and Excel expertise.', 'San Jose, CA', 'Full-Time'),
  (test_user_id, 'Learning & Development Manager', 'Deloitte', 'Create training programs for consultants. You will design curricula, facilitate workshops, and measure impact. Required: L&D experience, instructional design skills, and presentation abilities.', 'New York, NY', 'Full-Time'),
  (test_user_id, 'Employee Relations Specialist', 'Disney', 'Handle employee relations issues. You will investigate complaints, ensure compliance, and improve workplace culture. Required: ER experience, employment law knowledge, and conflict resolution skills.', 'Burbank, CA', 'Full-Time'),

  -- Design Jobs
  (test_user_id, 'Product Designer', 'Figma', 'Design the future of design tools. You will create interfaces, conduct user research, and iterate on designs. Required: Product design portfolio, prototyping skills, and collaborative mindset.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'UX Researcher', 'Uber', 'Understand user needs and behaviors. You will conduct studies, analyze data, and inform product decisions. Required: UX research experience, qualitative and quantitative methods, and communication skills.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'Visual Designer', 'Pinterest', 'Create beautiful visual experiences. You will design interfaces, create illustrations, and maintain brand consistency. Required: Visual design portfolio, typography skills, and creative vision.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'Motion Designer', 'TikTok', 'Bring interfaces to life with animation. You will create micro-interactions, video content, and animated graphics. Required: Motion design portfolio, After Effects expertise, and creative skills.', 'Los Angeles, CA', 'Full-Time'),
  (test_user_id, 'Design Systems Lead', 'Atlassian', 'Build and maintain design systems. You will create components, documentation, and ensure consistency. Required: Design systems experience, frontend knowledge, and leadership skills.', 'Sydney, Australia', 'Full-Time'),

  -- Customer Service Jobs
  (test_user_id, 'Customer Success Manager', 'Slack', 'Ensure customer success with Slack. You will onboard clients, drive adoption, and reduce churn. Required: CSM experience, SaaS knowledge, and relationship building skills.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'Technical Support Engineer', 'Dropbox', 'Provide technical support to users. You will troubleshoot issues, create documentation, and improve processes. Required: Technical support experience, problem-solving skills, and patience.', 'Remote', 'Full-Time'),
  (test_user_id, 'Customer Experience Analyst', 'Zappos', 'Analyze and improve customer experience. You will review feedback, identify trends, and implement improvements. Required: CX experience, analytical skills, and customer focus.', 'Las Vegas, NV', 'Full-Time'),
  (test_user_id, 'Support Team Lead', 'Zendesk', 'Lead a customer support team. You will manage agents, improve metrics, and ensure quality. Required: Support leadership experience, coaching skills, and metrics knowledge.', 'Remote', 'Full-Time'),
  (test_user_id, 'Client Services Manager', 'American Express', 'Manage relationships with premium clients. You will handle escalations, provide solutions, and ensure satisfaction. Required: Client service experience, financial knowledge, and communication skills.', 'New York, NY', 'Full-Time'),

  -- Operations Jobs
  (test_user_id, 'Operations Manager', 'FedEx', 'Manage logistics operations. You will optimize routes, manage teams, and ensure timely delivery. Required: Operations experience, logistics knowledge, and leadership skills.', 'Memphis, TN', 'Full-Time'),
  (test_user_id, 'Business Operations Analyst', 'Lyft', 'Analyze and improve business operations. You will create dashboards, identify inefficiencies, and drive improvements. Required: Business analysis experience, SQL skills, and strategic thinking.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'Supply Chain Manager', 'Apple', 'Manage Apple''s supply chain. You will work with suppliers, optimize inventory, and ensure quality. Required: Supply chain experience, negotiation skills, and attention to detail.', 'Cupertino, CA', 'Full-Time'),
  (test_user_id, 'Process Improvement Manager', 'Boeing', 'Improve manufacturing processes. You will implement lean principles, reduce waste, and increase efficiency. Required: Process improvement experience, Six Sigma certification, and manufacturing knowledge.', 'Seattle, WA', 'Full-Time'),
  (test_user_id, 'Facilities Manager', 'Google', 'Manage Google office facilities. You will oversee maintenance, plan spaces, and ensure employee comfort. Required: Facilities management experience, vendor management, and problem-solving skills.', 'Mountain View, CA', 'Full-Time'),

  -- Education & Training Jobs
  (test_user_id, 'Instructional Designer', 'Coursera', 'Design online courses. You will create curricula, develop content, and ensure learning outcomes. Required: Instructional design experience, e-learning tools knowledge, and educational background.', 'Mountain View, CA', 'Full-Time'),
  (test_user_id, 'Corporate Trainer', 'PwC', 'Train consultants on methodologies. You will facilitate workshops, create materials, and assess learning. Required: Training experience, presentation skills, and business knowledge.', 'New York, NY', 'Full-Time'),
  (test_user_id, 'Curriculum Developer', 'Khan Academy', 'Create educational content. You will design lessons, create assessments, and improve learning experiences. Required: Education background, content creation skills, and subject expertise.', 'Remote', 'Full-Time'),
  (test_user_id, 'Technical Writer', 'Stripe', 'Create developer documentation. You will write API docs, tutorials, and guides. Required: Technical writing experience, programming knowledge, and clear communication.', 'Remote', 'Full-Time'),
  (test_user_id, 'Training Manager', 'Starbucks', 'Manage barista training programs. You will develop training materials, train trainers, and ensure consistency. Required: Training management experience, retail knowledge, and leadership skills.', 'Seattle, WA', 'Full-Time'),

  -- Legal Jobs
  (test_user_id, 'Corporate Counsel', 'Uber', 'Provide legal advice on business matters. You will review contracts, ensure compliance, and manage risk. Required: JD, bar admission, and 5+ years corporate law experience.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'Compliance Officer', 'Wells Fargo', 'Ensure regulatory compliance. You will develop policies, conduct audits, and manage investigations. Required: Compliance experience, financial regulations knowledge, and attention to detail.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'Privacy Counsel', 'Apple', 'Advise on privacy matters. You will review products, ensure GDPR compliance, and develop privacy policies. Required: Privacy law experience, technology understanding, and international law knowledge.', 'Cupertino, CA', 'Full-Time'),
  (test_user_id, 'Contract Manager', 'Microsoft', 'Manage commercial contracts. You will negotiate terms, review agreements, and manage contract lifecycle. Required: Contract management experience, negotiation skills, and business acumen.', 'Redmond, WA', 'Full-Time'),
  (test_user_id, 'Intellectual Property Attorney', 'IBM', 'Protect IBM''s intellectual property. You will file patents, manage trademarks, and handle IP litigation. Required: IP law experience, technical background, and bar admission.', 'Armonk, NY', 'Full-Time'),

  -- Media & Entertainment Jobs
  (test_user_id, 'Video Producer', 'YouTube', 'Produce original content. You will manage productions, work with creators, and ensure quality. Required: Video production experience, project management skills, and creative vision.', 'Los Angeles, CA', 'Full-Time'),
  (test_user_id, 'Content Strategist', 'Netflix', 'Develop content strategies. You will analyze viewer data, identify trends, and recommend content. Required: Content strategy experience, data analysis skills, and entertainment knowledge.', 'Los Angeles, CA', 'Full-Time'),
  (test_user_id, 'Game Designer', 'Electronic Arts', 'Design engaging games. You will create game mechanics, balance gameplay, and iterate on designs. Required: Game design experience, prototyping skills, and passion for games.', 'Redwood City, CA', 'Full-Time'),
  (test_user_id, 'Audio Engineer', 'Spotify', 'Optimize audio streaming quality. You will work on codecs, improve algorithms, and enhance user experience. Required: Audio engineering experience, DSP knowledge, and programming skills.', 'Stockholm, Sweden', 'Full-Time'),
  (test_user_id, 'Social Media Content Creator', 'BuzzFeed', 'Create viral content. You will produce videos, write articles, and engage audiences. Required: Content creation portfolio, social media expertise, and creative skills.', 'New York, NY', 'Full-Time'),

  -- Non-profit & Government Jobs
  (test_user_id, 'Program Manager', 'United Nations', 'Manage humanitarian programs. You will coordinate projects, work with partners, and measure impact. Required: International development experience, project management skills, and language abilities.', 'New York, NY', 'Full-Time'),
  (test_user_id, 'Grant Writer', 'Red Cross', 'Secure funding through grants. You will research opportunities, write proposals, and manage reporting. Required: Grant writing experience, research skills, and nonprofit knowledge.', 'Washington, DC', 'Full-Time'),
  (test_user_id, 'Policy Analyst', 'City of San Francisco', 'Analyze and develop city policies. You will research issues, draft policies, and present recommendations. Required: Policy analysis experience, research skills, and public sector knowledge.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'Development Director', 'World Wildlife Fund', 'Lead fundraising efforts. You will develop strategies, cultivate donors, and manage campaigns. Required: Fundraising experience, relationship building skills, and environmental passion.', 'Washington, DC', 'Full-Time'),
  (test_user_id, 'Community Outreach Coordinator', 'Habitat for Humanity', 'Coordinate community programs. You will organize volunteers, plan events, and build partnerships. Required: Community organizing experience, communication skills, and nonprofit passion.', 'Atlanta, GA', 'Full-Time'),

  -- Real Estate Jobs
  (test_user_id, 'Real Estate Analyst', 'CBRE', 'Analyze commercial real estate markets. You will create financial models, conduct research, and support transactions. Required: Real estate experience, financial modeling skills, and market knowledge.', 'Los Angeles, CA', 'Full-Time'),
  (test_user_id, 'Property Manager', 'Greystar', 'Manage residential properties. You will handle leasing, maintenance, and tenant relations. Required: Property management experience, customer service skills, and attention to detail.', 'Dallas, TX', 'Full-Time'),
  (test_user_id, 'Real Estate Developer', 'Related Companies', 'Develop mixed-use projects. You will manage development process, work with architects, and secure financing. Required: Development experience, project management skills, and financial acumen.', 'New York, NY', 'Full-Time'),
  (test_user_id, 'Leasing Agent', 'Equity Residential', 'Lease apartment units. You will show properties, process applications, and close deals. Required: Sales experience, customer service skills, and real estate knowledge.', 'Chicago, IL', 'Full-Time'),
  (test_user_id, 'Real Estate Marketing Manager', 'Zillow', 'Market real estate services. You will create campaigns, manage digital marketing, and drive leads. Required: Marketing experience, real estate knowledge, and analytical skills.', 'Seattle, WA', 'Full-Time'),

  -- Hospitality & Tourism Jobs
  (test_user_id, 'Hotel Manager', 'Marriott International', 'Manage hotel operations. You will oversee staff, ensure guest satisfaction, and drive revenue. Required: Hotel management experience, leadership skills, and hospitality degree.', 'Orlando, FL', 'Full-Time'),
  (test_user_id, 'Event Coordinator', 'Hilton', 'Coordinate corporate events. You will plan meetings, manage logistics, and ensure success. Required: Event planning experience, organizational skills, and attention to detail.', 'Las Vegas, NV', 'Full-Time'),
  (test_user_id, 'Travel Consultant', 'Expedia', 'Help customers plan trips. You will recommend destinations, book travel, and provide support. Required: Travel industry experience, sales skills, and destination knowledge.', 'Remote', 'Full-Time'),
  (test_user_id, 'Restaurant Manager', 'Starbucks', 'Manage store operations. You will lead teams, ensure quality, and drive sales. Required: Restaurant management experience, leadership skills, and customer focus.', 'Seattle, WA', 'Full-Time'),
  (test_user_id, 'Guest Experience Manager', 'Disney Parks', 'Ensure magical guest experiences. You will manage guest services, resolve issues, and improve satisfaction. Required: Customer service experience, problem-solving skills, and Disney passion.', 'Orlando, FL', 'Full-Time'),

  -- Energy & Utilities Jobs
  (test_user_id, 'Renewable Energy Engineer', 'Tesla Energy', 'Design solar and battery systems. You will create solutions, manage installations, and optimize performance. Required: Engineering degree, renewable energy experience, and technical skills.', 'Fremont, CA', 'Full-Time'),
  (test_user_id, 'Power Systems Analyst', 'Pacific Gas & Electric', 'Analyze electrical grid systems. You will model power flows, identify improvements, and ensure reliability. Required: Power systems knowledge, analytical skills, and engineering background.', 'San Francisco, CA', 'Full-Time'),
  (test_user_id, 'Environmental Specialist', 'Chevron', 'Ensure environmental compliance. You will conduct assessments, manage permits, and implement programs. Required: Environmental science degree, regulatory knowledge, and field experience.', 'Houston, TX', 'Full-Time'),
  (test_user_id, 'Energy Trader', 'BP', 'Trade energy commodities. You will analyze markets, execute trades, and manage risk. Required: Trading experience, market knowledge, and analytical skills.', 'Houston, TX', 'Full-Time'),
  (test_user_id, 'Wind Farm Manager', 'NextEra Energy', 'Manage wind farm operations. You will oversee maintenance, optimize production, and ensure safety. Required: Wind energy experience, management skills, and technical knowledge.', 'Juno Beach, FL', 'Full-Time'),

  -- Transportation & Logistics Jobs
  (test_user_id, 'Logistics Coordinator', 'UPS', 'Coordinate shipping operations. You will plan routes, track shipments, and solve problems. Required: Logistics experience, problem-solving skills, and attention to detail.', 'Atlanta, GA', 'Full-Time'),
  (test_user_id, 'Fleet Manager', 'Enterprise', 'Manage vehicle fleet. You will oversee maintenance, optimize utilization, and control costs. Required: Fleet management experience, analytical skills, and leadership abilities.', 'St. Louis, MO', 'Full-Time'),
  (test_user_id, 'Supply Chain Planner', 'Coca-Cola', 'Plan supply chain operations. You will forecast demand, manage inventory, and optimize distribution. Required: Supply chain experience, planning skills, and analytical abilities.', 'Atlanta, GA', 'Full-Time'),
  (test_user_id, 'Transportation Analyst', 'CSX', 'Analyze transportation networks. You will optimize routes, reduce costs, and improve efficiency. Required: Transportation experience, data analysis skills, and logistics knowledge.', 'Jacksonville, FL', 'Full-Time'),
  (test_user_id, 'Warehouse Operations Manager', 'Amazon', 'Manage fulfillment center operations. You will lead teams, optimize processes, and ensure targets. Required: Warehouse management experience, leadership skills, and operational excellence.', 'Phoenix, AZ', 'Full-Time'),

  -- Part-Time and Contract Positions
  (test_user_id, 'Part-Time Data Entry Specialist', 'Local Business Solutions', 'Enter and verify data in our systems. Flexible hours available. Required: Attention to detail, typing skills, and basic computer knowledge.', 'Remote', 'Part-Time'),
  (test_user_id, 'Contract Graphic Designer', 'Creative Agency Co', '6-month contract for brand redesign project. You will create logos, marketing materials, and brand guidelines. Required: Design portfolio, Adobe Creative Suite expertise.', 'Los Angeles, CA', 'Contract'),
  (test_user_id, 'Part-Time Social Media Assistant', 'Fashion Startup', 'Manage social media accounts 20 hours/week. You will create content, engage followers, and track metrics. Required: Social media knowledge, creative skills.', 'New York, NY', 'Part-Time'),
  (test_user_id, 'Contract Mobile App Developer', 'Tech Innovations Inc', '3-month contract to build iOS app. You will develop features, fix bugs, and deploy to App Store. Required: iOS development experience, Swift knowledge.', 'Remote', 'Contract'),
  (test_user_id, 'Part-Time Customer Service Rep', 'Online Retailer', 'Handle customer inquiries evenings and weekends. You will answer emails, process returns, and resolve issues. Required: Customer service experience, communication skills.', 'Remote', 'Part-Time'),
  (test_user_id, 'Contract Project Manager', 'Consulting Firm', '6-month contract for system implementation. You will manage timeline, coordinate teams, and ensure delivery. Required: PM experience, PMP certification preferred.', 'Chicago, IL', 'Contract'),
  (test_user_id, 'Part-Time Bookkeeper', 'Small Business Network', 'Maintain financial records 15 hours/week. You will process invoices, reconcile accounts, and prepare reports. Required: Bookkeeping experience, QuickBooks knowledge.', 'Denver, CO', 'Part-Time'),
  (test_user_id, 'Contract Technical Writer', 'Software Company', '4-month contract for documentation project. You will write user guides, API docs, and tutorials. Required: Technical writing experience, software knowledge.', 'Remote', 'Contract'),
  (test_user_id, 'Part-Time Marketing Coordinator', 'Non-Profit Organization', 'Support marketing efforts 25 hours/week. You will manage social media, create content, and coordinate events. Required: Marketing experience, nonprofit interest.', 'Boston, MA', 'Part-Time'),
  (test_user_id, 'Contract Data Analyst', 'Research Institute', '3-month contract for research project. You will analyze datasets, create visualizations, and present findings. Required: Data analysis experience, Python/R skills.', 'San Francisco, CA', 'Contract');

END $$;

-- Note: To use this seed file, you'll need to:
-- 1. Create a test user in your auth.users table
-- 2. Replace the test_user_id UUID with the actual user ID
-- 3. Run this SQL file in your Supabase SQL editor

-- The script creates 100+ diverse job postings across various:
-- - Industries (Tech, Finance, Healthcare, Retail, etc.)
-- - Job types (Full-Time, Part-Time, Contract)
-- - Locations (Major US cities and Remote)
-- - Companies (From startups to Fortune 500)
-- - Roles (Engineering, Sales, Marketing, Operations, etc.)