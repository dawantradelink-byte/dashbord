import { Lead, VisitorStat, TopPageItem, NotificationItem } from '../types';

export const INITIAL_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Rafi Ahmed',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    type: 'IELTS Mock Test',
    source: 'Website',
    phone: '+8801712345678',
    email: 'rafi.ahmed98@gmail.com',
    message: 'Mock test completed. Please check my Writing Task 2 essay and Speaking test part 2.',
    date: '19 Oct, 10:42 AM',
    status: 'New',
    unread: true,
    ieltsData: {
      testType: 'Academic',
      targetCountry: 'Canada',
      targetBand: 7.5,
      writingPrompt: 'Some people believe that university education should be free for everyone, regardless of their financial background. To what extent do you agree or disagree?',
      writingSubmission: 'In modern society, tertiary education has evolved into an indispensable stepping stone for socioeconomic mobility. While opponents argue that universal free higher education burdens public coffers, I strongly believe that state-funded university education yields immense societal dividends through skilled workforce creation and democratic equal opportunity.\n\nPrimarily, eliminating tuition fees dismantles financial barriers that historically exclude underprivileged talents. When students are burdened with astronomical educational debts, their career choices become risk-averse, deterring innovation in scientific research and public services. A merit-based, state-financed system ensures that intellect rather than parental wealth dictates academic achievement.\n\nIn conclusion, providing tuition-free university education is not merely a social expense, but a strategic national investment that fosters equitable societal development.',
      writingWordCount: 122,
      speakingTopic: 'Describe an environmental challenge that your hometown faces.',
      speakingNotes: 'Fluency is consistent with minor hesitation on abstract collocations. Pronunciation is clear with natural intonation. Grammatical control is strong with complex clauses.',
      rawListeningScore: 34, // 34/40 corresponds to Band 7.5
      rawReadingScore: 33,    // 33/40 corresponds to Band 7.5
      scores: {
        listening: 7.5,
        reading: 7.5,
        writing: 7.0,
        speaking: 7.5,
        overall: 7.5,
        cefrLevel: 'C1 Advanced (Effective Operational)',
        examinerNotes: 'Strong analytical structure in Writing Task 2 with excellent paragraph development. Minor lexical repetition in intro. Speaking fluency is high with good idiomatic phrases.',
        evaluatedAt: '19 Oct 2026, 11:15 AM',
        evaluatedBy: 'Ishak Dawan (Senior Examiner)'
      },
      history: [
        {
          id: 'rh-1',
          testTitle: 'Mock Test #1 - Diagnostic Baseline',
          testDate: '22 Aug 2026',
          testType: 'Academic',
          listening: 6.0,
          reading: 6.5,
          writing: 5.5,
          speaking: 6.0,
          overall: 6.0,
          cefrLevel: 'B2 Independent (Vantage)',
          targetBand: 7.5,
          examinerNotes: 'Initial diagnostic. Candidate showed strong reading skimming skills, but struggled with Writing Task 2 paragraph coherence and complex grammar range.',
          evaluatedBy: 'Ishak Dawan',
          rawListening: 25,
          rawReading: 28
        },
        {
          id: 'rh-2',
          testTitle: 'Mock Test #2 - Midterm Evaluation',
          testDate: '18 Sep 2026',
          testType: 'Academic',
          listening: 7.0,
          reading: 7.0,
          writing: 6.5,
          speaking: 6.5,
          overall: 7.0,
          cefrLevel: 'C1 Advanced',
          targetBand: 7.5,
          examinerNotes: 'Significant improvement in Listening sections 3 & 4. Writing thesis statement became much clearer. Speaking hesitation reduced noticeably.',
          evaluatedBy: 'Ishak Dawan',
          rawListening: 31,
          rawReading: 31
        },
        {
          id: 'rh-3',
          testTitle: 'Mock Test #3 - Pre-Exam Full Simulation',
          testDate: '19 Oct 2026',
          testType: 'Academic',
          listening: 7.5,
          reading: 7.5,
          writing: 7.0,
          speaking: 7.5,
          overall: 7.5,
          cefrLevel: 'C1 Advanced (Effective Operational)',
          targetBand: 7.5,
          examinerNotes: 'Target Band 7.5 achieved! Consistent academic vocabulary, accurate discourse markers in writing, and confident Part 3 speaking dialogue.',
          evaluatedBy: 'Ishak Dawan',
          rawListening: 34,
          rawReading: 33
        }
      ]
    }
  },
  {
    id: '2',
    name: 'Nusrat Jahan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    type: 'USA Admission',
    source: 'Landing Page',
    phone: '+8801812345679',
    email: 'nusrat.jahan22@yahoo.com',
    message: 'Interested in USA study with I-20 form for Fall 2027 intake. Need assistance with scholarship opportunities.',
    date: '19 Oct, 09:15 AM',
    status: 'Contacted',
    unread: false
  },
  {
    id: '3',
    name: 'Tanvir Hasan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    type: 'Tourist Visa',
    source: 'Facebook',
    phone: '+8801912345680',
    email: 'tanvir.hasan.bd@gmail.com',
    message: 'Family tourist visa for Malaysia and Singapore for upcoming December vacation. 4 members.',
    date: '19 Oct, 08:33 AM',
    status: 'New',
    unread: true
  },
  {
    id: '4',
    name: 'Sumaiya Akter',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    type: 'IELTS Mock Test',
    source: 'Website',
    phone: '+8801712345681',
    email: 'sumaiya.akter.ielts@outlook.com',
    message: 'Completed speaking test. Please review and send band score breakdown for UKVI application.',
    date: '18 Oct, 11:22 PM',
    status: 'Reviewed',
    unread: false,
    ieltsData: {
      testType: 'Academic',
      targetCountry: 'United Kingdom',
      targetBand: 7.0,
      writingPrompt: 'The chart below shows the percentage of households in different countries with internet access from 2010 to 2024.',
      writingSubmission: 'The provided line graph delineates the proportion of households possessing internet connectivity across five distinct nations over a fourteen-year span from 2010 to 2024.\n\nOverall, it is evident that internet access experienced an upward trajectory in all surveyed countries. Nation A consistently dominated throughout the entire duration, whereas Nation E, despite initiating from the lowest threshold, demonstrated the most pronounced surge.\n\nSpecifically, in 2010, approximately 65% of households in Nation A had active internet access. This figure rose incrementally to peak at nearly 94% by 2024.',
      writingWordCount: 88,
      speakingTopic: 'Part 2 Cue Card: Describe an unforgettable journey you made by train or public transport.',
      speakingNotes: 'Pronunciation is very natural. Candidate responded smoothly to follow-up questions in Part 3. Minor slip on conditional verb forms.',
      rawListeningScore: 31,
      rawReadingScore: 30,
      scores: {
        listening: 7.0,
        reading: 7.0,
        writing: 6.5,
        speaking: 7.0,
        overall: 7.0,
        cefrLevel: 'C1 Advanced (Effective Operational)',
        examinerNotes: 'Excellent overview in Writing Task 1. Speaking flow was natural and confident. Ready for UK university requirements.',
        evaluatedAt: '19 Oct 2026, 09:30 AM',
        evaluatedBy: 'Ishak Dawan (Senior Examiner)'
      },
      history: [
        {
          id: 'sa-1',
          testTitle: 'Mock Test #1 - Diagnostic Assessment',
          testDate: '02 Sep 2026',
          testType: 'Academic',
          listening: 6.0,
          reading: 5.5,
          writing: 6.0,
          speaking: 6.0,
          overall: 6.0,
          cefrLevel: 'B2 Independent',
          targetBand: 7.0,
          examinerNotes: 'Good conversational fluency in speaking, but reading speed in passage 3 caused missed True/False/Not Given questions.',
          evaluatedBy: 'Ishak Dawan',
          rawListening: 24,
          rawReading: 22
        },
        {
          id: 'sa-2',
          testTitle: 'Mock Test #2 - Sectional Progress Exam',
          testDate: '24 Sep 2026',
          testType: 'Academic',
          listening: 6.5,
          reading: 6.5,
          writing: 6.0,
          speaking: 6.5,
          overall: 6.5,
          cefrLevel: 'B2 Independent (Vantage)',
          targetBand: 7.0,
          examinerNotes: 'Reading accuracy improved by 5 raw marks. Speaking vocabulary is expanding with natural idioms.',
          evaluatedBy: 'Ishak Dawan',
          rawListening: 28,
          rawReading: 27
        },
        {
          id: 'sa-3',
          testTitle: 'Mock Test #3 - Comprehensive UKVI Mock',
          testDate: '18 Oct 2026',
          testType: 'Academic',
          listening: 7.0,
          reading: 7.0,
          writing: 6.5,
          speaking: 7.0,
          overall: 7.0,
          cefrLevel: 'C1 Advanced (Effective Operational)',
          targetBand: 7.0,
          examinerNotes: 'Target Band 7.0 reached! Full qualification for UK Russell Group master admissions.',
          evaluatedBy: 'Ishak Dawan',
          rawListening: 31,
          rawReading: 30
        }
      ]
    }
  },
  {
    id: '5',
    name: 'Mehedi Khan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    type: 'Canada Study',
    source: 'Google',
    phone: '+8801612345682',
    email: 'mehedi.khan88@gmail.com',
    message: 'Need guidance for Canada admission under SDS stream with PGWP eligible colleges in Ontario.',
    date: '18 Oct, 07:50 PM',
    status: 'New',
    unread: false
  },
  {
    id: '6',
    name: 'Farhana Rashid',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    type: 'IELTS Mock Test',
    source: 'Website',
    phone: '+8801823456789',
    email: 'farhana.rashid.dhaka@gmail.com',
    message: 'General Training IELTS Mock Test for Australia Skilled Migration PR assessment.',
    date: '18 Oct, 04:15 PM',
    status: 'Evaluated',
    unread: false,
    ieltsData: {
      testType: 'General Training',
      targetCountry: 'Australia',
      targetBand: 8.0,
      writingPrompt: 'Task 1: You have recently moved to a new apartment and experienced maintenance problems. Write a letter to your landlord.',
      writingSubmission: 'Dear Mr. Henderson,\n\nI am writing to formally bring to your attention several persistent maintenance issues in Apartment 4B, which I leased commencing on October 1st.\n\nWhile the premises are generally satisfactory, the hot water plumbing in the master bathroom has been severely malfunctioning. The boiler repeatedly cuts off, leaving water at freezing temperatures. Additionally, the secondary bedroom window latch does not secure firmly, presenting a security concern.\n\nI kindly request that an authorized technician inspect and rectify these defects at your earliest convenience before the upcoming weekend.\n\nYours sincerely,\nFarhana Rashid',
      writingWordCount: 95,
      speakingTopic: 'Part 2: Describe a rule or regulation you agreed with or disagreed with at school/work.',
      speakingNotes: 'Exceptional fluency. Native-like intonation with sophisticated idiomatic expressions and accurate complex grammatical structures.',
      rawListeningScore: 38,
      rawReadingScore: 37,
      scores: {
        listening: 8.5,
        reading: 8.5,
        writing: 8.0,
        speaking: 8.0,
        overall: 8.5,
        cefrLevel: 'C2 Mastery (Native-like)',
        examinerNotes: 'Outstanding performance across all bands. Writing letter tone was perfectly formal and natural. Speaking demonstrated superior communicative competence.',
        evaluatedAt: '18 Oct 2026, 05:40 PM',
        evaluatedBy: 'Ishak Dawan (Senior Examiner)'
      },
      history: [
        {
          id: 'fr-1',
          testTitle: 'Mock Test #1 - General Training Diagnostic',
          testDate: '10 Aug 2026',
          testType: 'General Training',
          listening: 7.5,
          reading: 7.5,
          writing: 7.0,
          speaking: 7.0,
          overall: 7.5,
          cefrLevel: 'C1 Advanced',
          targetBand: 8.0,
          examinerNotes: 'High baseline competency. Writing letter was clear but needed stronger semi-formal paragraph transitions.',
          evaluatedBy: 'Ishak Dawan',
          rawListening: 34,
          rawReading: 34
        },
        {
          id: 'fr-2',
          testTitle: 'Mock Test #2 - GT Speed & Accuracy Drill',
          testDate: '14 Sep 2026',
          testType: 'General Training',
          listening: 8.0,
          reading: 8.0,
          writing: 7.5,
          speaking: 7.5,
          overall: 8.0,
          cefrLevel: 'C1 Advanced (Effective Operational)',
          targetBand: 8.0,
          examinerNotes: 'Achieved target Band 8.0 on reading section 3 notices. Writing Task 2 demonstrated sophisticated collocations.',
          evaluatedBy: 'Ishak Dawan',
          rawListening: 36,
          rawReading: 36
        },
        {
          id: 'fr-3',
          testTitle: 'Mock Test #3 - Final PR Assessment Simulation',
          testDate: '18 Oct 2026',
          testType: 'General Training',
          listening: 8.5,
          reading: 8.5,
          writing: 8.0,
          speaking: 8.0,
          overall: 8.5,
          cefrLevel: 'C2 Mastery (Native-like)',
          targetBand: 8.0,
          examinerNotes: 'Surpassed target Band 8.0 with a stellar 8.5! Scores grant maximum 20 PR points for Australia immigration.',
          evaluatedBy: 'Ishak Dawan',
          rawListening: 38,
          rawReading: 37
        }
      ]
    }
  },
  {
    id: '7',
    name: 'Sabbir Hossain',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    type: 'UK Student Visa',
    source: 'Landing Page',
    phone: '+8801734567890',
    email: 'sabbir.hossain@northsouth.edu',
    message: 'CAS received from University of Manchester for MSc Data Science. Need visa filing checklist and SOP review.',
    date: '17 Oct, 06:10 PM',
    status: 'Contacted',
    unread: false
  },
  {
    id: '8',
    name: 'Kazi Ariful Islam',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    type: 'IELTS Mock Test',
    source: 'Direct',
    phone: '+8801755123456',
    email: 'kazi.ariful.ielts@gmail.com',
    message: 'Enrolled in 8-week intensive IELTS preparation. Requesting baseline diagnostic and second review.',
    date: '16 Oct, 02:20 PM',
    status: 'Pending Evaluation',
    unread: false,
    ieltsData: {
      testType: 'Academic',
      targetCountry: 'Germany',
      targetBand: 6.5,
      writingPrompt: 'In many countries, government spending on the arts is being cut. Discuss both sides and give your opinion.',
      writingSubmission: 'Artistic heritage forms the cultural identity of any civilization. While fiscal critics argue that public funding should prioritize healthcare and infrastructure, artistic programs stimulate national innovation and creative education.',
      writingWordCount: 30,
      speakingTopic: 'Part 2: Describe a book or novel that had a lasting impact on your thoughts.',
      speakingNotes: 'Good vocabulary breadth. Minor tense inconsistency during past narrative in Part 2.',
      rawListeningScore: 28,
      rawReadingScore: 27,
      scores: {
        listening: 6.5,
        reading: 6.5,
        writing: 6.0,
        speaking: 6.5,
        overall: 6.5,
        cefrLevel: 'B2 Independent (Vantage)',
        examinerNotes: 'Solid progress. Candidate is on track for German public university English-taught masters criteria.',
        evaluatedAt: '17 Oct 2026, 03:00 PM',
        evaluatedBy: 'Ishak Dawan (Senior Examiner)'
      },
      history: [
        {
          id: 'ka-1',
          testTitle: 'Mock Test #1 - Diagnostic Baseline',
          testDate: '28 Aug 2026',
          testType: 'Academic',
          listening: 5.5,
          reading: 5.5,
          writing: 5.0,
          speaking: 5.5,
          overall: 5.5,
          cefrLevel: 'B2 Independent',
          targetBand: 6.5,
          examinerNotes: 'Initial diagnostic. Needs focused grammar drills on conditional sentences and listening note-taking techniques.',
          evaluatedBy: 'Ishak Dawan',
          rawListening: 20,
          rawReading: 21
        },
        {
          id: 'ka-2',
          testTitle: 'Mock Test #2 - Progress Assessment',
          testDate: '17 Oct 2026',
          testType: 'Academic',
          listening: 6.5,
          reading: 6.5,
          writing: 6.0,
          speaking: 6.5,
          overall: 6.5,
          cefrLevel: 'B2 Independent (Vantage)',
          targetBand: 6.5,
          examinerNotes: 'Target Band 6.5 achieved! Writing Task 2 structure improved from Band 5.0 to 6.0.',
          evaluatedBy: 'Ishak Dawan',
          rawListening: 28,
          rawReading: 27
        }
      ]
    }
  }
];

export const METRIC_CARDS: VisitorStat[] = [
  {
    period: '24h',
    labelEn: 'Last 24 Hours',
    labelBn: 'গত ২৪ ঘণ্টা',
    value: '1,248',
    change: '12%',
    isPositive: true,
    history: [850, 920, 1020, 980, 1150, 1180, 1248]
  },
  {
    period: '7d',
    labelEn: 'Last 7 Days',
    labelBn: 'গত ৭ দিন',
    value: '8,764',
    change: '18%',
    isPositive: true,
    history: [5400, 6100, 6800, 7200, 7900, 8300, 8764]
  },
  {
    period: '1m',
    labelEn: 'Last 1 Month',
    labelBn: 'গত ১ মাস',
    value: '32,105',
    change: '24%',
    isPositive: true,
    history: [22000, 24500, 27000, 29000, 30500, 31800, 32105]
  },
  {
    period: 'total',
    labelEn: 'Total Visitors',
    labelBn: 'সর্বমোট ভিজিটর',
    value: '184,532',
    change: '31%',
    isPositive: true,
    history: [140000, 152000, 161000, 170000, 178000, 181000, 184532]
  }
];

export const VISITOR_TRENDS_DATA = [
  { date: 'Oct 12', count: 2800, countFormatted: '2.8K' },
  { date: 'Oct 13', count: 3200, countFormatted: '3.2K' },
  { date: 'Oct 14', count: 4800, countFormatted: '4.8K' },
  { date: 'Oct 15', count: 4100, countFormatted: '4.1K' },
  { date: 'Oct 16', count: 5200, countFormatted: '5.2K' },
  { date: 'Oct 17', count: 6400, countFormatted: '6.4K' },
  { date: 'Oct 18', count: 7100, countFormatted: '7.1K' },
  { date: 'Oct 19', count: 7900, countFormatted: '7.9K' }
];

export const TOP_PAGES: TopPageItem[] = [
  { rank: 1, page: 'IELTS Practice Hub', pageBn: 'আইইএলটিএস প্র্যাকটিস হাব', avgTime: '4m 12s', visitors: '4,820' },
  { rank: 2, page: 'USA Student Visa', pageBn: 'ইউএসএ স্টুডেন্ট ভিসা', avgTime: '3m 28s', visitors: '3,940' },
  { rank: 3, page: 'Scholarship Finder', pageBn: 'স্কলারশিপ ফাইন্ডার', avgTime: '2m 50s', visitors: '3,110' },
  { rank: 4, page: 'Work Permit Europe', pageBn: 'ওয়ার্ক পারমিট ইউরোপ', avgTime: '2m 16s', visitors: '2,890' },
  { rank: 5, page: 'Blog / Articles', pageBn: 'ব্লগ এবং আর্টিকেলে', avgTime: '1m 48s', visitors: '2,150' }
];

export const NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'New IELTS Mock Test Submitted', time: '10 min ago', type: 'mock_test', studentName: 'Rafi Ahmed', read: false },
  { id: 'n2', title: 'USA Admission Inquiry Received', time: '1 hour ago', type: 'visa', studentName: 'Nusrat Jahan', read: false },
  { id: 'n3', title: 'Speaking Evaluation Pending', time: '2 hours ago', type: 'mock_test', studentName: 'Sumaiya Akter', read: false },
  { id: 'n4', title: 'Tourist Visa Consultation Request', time: '3 hours ago', type: 'visa', studentName: 'Tanvir Hasan', read: true },
  { id: 'n5', title: 'Canada SDS Inquiry Alert', time: '5 hours ago', type: 'visa', studentName: 'Mehedi Khan', read: true },
  { id: 'n6', title: 'IELTS Writing Task 2 Submitted', time: 'Yesterday', type: 'mock_test', studentName: 'Farhana Rashid', read: true },
  { id: 'n7', title: 'Weekly Traffic Report Ready', time: 'Yesterday', type: 'urgent', studentName: 'Analytics Engine', read: true },
  { id: 'n8', title: 'WhatsApp API Gateway Active', time: '2 days ago', type: 'urgent', studentName: 'System Monitor', read: true }
];
