// ════════════════════════════════════════════════
//  Shared content model + icons for the Dashboard redesign
//  Real data lifted from lighthouse-v5.jsx so comps are authentic.
//  Exports to window: LH (data), I (icons)
// ════════════════════════════════════════════════

const LH = {
  org: "Acme Corp",
  product: "Lighthouse",
  user: { first: "John", last: "Doe", role: "Product Management", initials: "JD" },
  greeting: "Good afternoon,",
  stats: [
    { label: "Active programs", value: "2" },
    { label: "Reports ready", value: "4" },
  ],
  profile: { pct: 30, done: 3, total: 10 },
  nav: [
    { id: "dash", label: "Dashboard", icon: "home" },
    { id: "leadership", label: "Leadership 2026", icon: "chart", group: "Programs" },
    { id: "360", label: "360° Perspective", icon: "users" },
    { id: "development", label: "Development", icon: "book", group: "Growth" },
    { id: "scheduling", label: "Scheduling", icon: "cal" },
    { id: "insights", label: "Insights", icon: "bars" },
    { id: "bookings", label: "Bookings", icon: "calCheck" },
  ],
  programs: [
    {
      id: "leadership", name: "Leadership Assessment 2026", nameKey: "leadershipAssessment2026", tag: "Assessment", state: "progress",
      desc: "Comprehensive leadership evaluation across strategic thinking, influence, and team development competencies.",
      due: "Jul 24, 2026", daysLeft: 36, pct: 35, done: 2, total: 6, reports: 2, notes: 2,
      accent: "var(--accent)", tint: "var(--sky)",
      steps: [
        { name: "Hogan Assessment", nameKey: "hoganAssessment", status: "complete" },
        { name: "Cognitive Ability Test", nameKey: "cognitiveAbilityTest", status: "progress", pct: 30 },
        { name: "Video Interview", nameKey: "videoInterview", status: "locked" },
      ],
      detail: {
        videoLen: "2:30",
        instructions: [
          "This program includes individual exercises and Assessment Centers (live, multi-phase simulations with assessors).",
          "Some exercises must be completed in order (sequential). Others can be taken at any time.",
          "Timed exercises cannot be paused once started. Ensure a quiet, distraction-free environment.",
          "Proctored exercises will require a system check before launch — your camera, microphone, and internet will be tested.",
          "Your responses are confidential. Only aggregated scores are shared with your program administrator.",
          "You may retake the Thriving Index once. All other exercises are single-attempt.",
        ],
        centers: [
          { id: "sim", name: "Business Simulation Center", desc: "Strategic decision-making: market analysis, presentation, and crisis response.", time: "90 min", status: "notstarted", proctored: true, sequential: true, needsReserve: true, schedId: "sim-sched", lockActivities: true,
            activities: [
              { id: "pre", name: "Pre-work: Case Brief", desc: "Read the scenario document before the simulation.", time: "15 min", status: "complete", pct: 100 },
              { id: "s1", name: "Phase 1: Market Analysis", desc: "Analyze market data and identify opportunities.", time: "20 min", status: "progress", pct: 60 },
              { id: "s2", name: "Phase 2: Strategy Presentation", desc: "Present strategic recommendations to the panel.", time: "20 min", status: "locked", pct: 0 },
            ] },
          { id: "lac", name: "Leadership Assessment Center", desc: "Group exercises, role plays, and case study presentations with live observers.", time: "120 min", status: "notstarted", proctored: true, sequential: false, schedId: "lac-sched",
            activities: [
              { id: "brief", name: "Participant Briefing", desc: "Welcome and orientation.", time: "10 min", status: "complete", pct: 100 },
              { id: "group", name: "Group Discussion", desc: "Collaborate on a business challenge.", time: "30 min", status: "notstarted", pct: 0 },
              { id: "roleplay", name: "Role Play", desc: "Navigate a stakeholder interaction.", time: "20 min", status: "notstarted", pct: 0 },
            ] },
        ],
        sequential: [
          { id: "hogan", name: "Hogan Assessment", desc: "Leadership personality profiling.", time: "40 min", status: "notstarted", pct: 0, proctored: false },
          { id: "cognitive", name: "Cognitive Ability Test", desc: "Verbal, numerical, and abstract reasoning.", time: "35 min", status: "locked", pct: 0, proctored: true },
          { id: "interview", name: "Video Interview", desc: "Structured behavioural interview with AI analysis.", time: "30 min", status: "locked", pct: 0, proctored: true },
        ],
        open: [
          { id: "thriving", name: "Thriving Index", desc: "Measure wellbeing, resilience, and engagement.", time: "25 min", status: "complete", pct: 100, proctored: false, hasReport: true },
          { id: "self", name: "Self-Assessment Survey", desc: "Rate yourself on leadership competencies.", time: "15 min", status: "progress", pct: 45, proctored: false },
          { id: "sjt", name: "Situational Judgement Test", desc: "Respond to realistic workplace scenarios.", time: "20 min", status: "notstarted", pct: 0, proctored: false },
        ],
      },
    },
    {
      id: "360", name: "360° Perspective Feedback", nameKey: "perspective360Feedback", tag: "Multi-rater", state: "notstarted",
      desc: "Multi-rater feedback from peers, direct reports, and managers for a complete picture of your leadership impact.",
      due: "Aug 14, 2026", daysLeft: 57, pct: 0, done: 0, total: 3, reports: 0, notes: 0,
      accent: "var(--purple-750)", tint: "var(--purple-250)",
      steps: [
        { name: "Self Assessment", nameKey: "selfAssessment", status: "notstarted" },
        { name: "Nominate Raters", nameKey: "nominateRaters", status: "locked" },
        { name: "Track Responses", nameKey: "trackResponses", status: "locked" },
      ],
      detail: {
        videoLen: "2:30",
        instructions: [
          "You will first complete a self-assessment rating yourself on leadership competencies.",
          "Then nominate raters — your manager, 3–5 peers, and 2–3 direct reports.",
          "Raters receive an anonymous survey. You can track response progress but not individual answers.",
          "A consolidated feedback report is generated once minimum responses are collected.",
          "Individual rater responses are never revealed — only aggregated category scores.",
        ],
        centers: [],
        sequential: [
          { id: "self360", name: "Self Assessment", desc: "Rate yourself on leadership competencies.", time: "15 min", status: "notstarted", pct: 0, proctored: false },
          { id: "nominate", name: "Nominate Raters", desc: "Select manager, peers, and reports as raters.", time: "10 min", status: "locked", pct: 0, proctored: false },
          { id: "track", name: "Track Responses", desc: "Monitor rater completion (min 5 needed).", time: "—", status: "locked", pct: 0, proctored: false },
        ],
        open: [],
      },
    },
  ],
  reports: [
    { name: "Hogan Leadership Report", program: "Leadership 2026", pages: 12 },
    { name: "Thriving Index Report", program: "Leadership 2026", pages: 8 },
  ],
  deadline: { program: "Leadership Assessment 2026", due: "Jul 24, 2026", daysLeft: 36 },

  // ── Growth pages: Development, Insights, Scheduling ──
  competencies: [
    { label: "Strategic Thinking", score: 85, type: "behavioral" },
    { label: "Influence & Communication", score: 72, type: "behavioral" },
    { label: "Team Development", score: 68, type: "behavioral" },
    { label: "Resilience", score: 91, type: "behavioral" },
    { label: "Decision Making", score: 76, type: "behavioral" },
    { label: "Data & Analytics", score: 64, type: "technical" },
    { label: "Product & Platform Fluency", score: 70, type: "technical" },
  ],
  openAssessQuestions: [
    { id: "oq1", type: "mcq", page: 1, title: "Work Style Preference", prompt: "When faced with a complex problem at work, which approach best describes your typical first reaction?",
      competency: "Problem Solving",
      options: ["Break it down into smaller parts and tackle each systematically", "Brainstorm with colleagues to explore multiple angles", "Research similar problems and apply proven solutions", "Trust my intuition and start with the most promising path", "Step back and think about the big picture before acting", "Not applicable"],
      tip: "Choose the option that best reflects your natural tendency, not what you think is the ideal answer." },
    { id: "oq2", type: "text", page: 1, title: "Leadership Reflection", prompt: "Describe a situation where you had to influence a group of people without having formal authority over them. What was your approach and what was the outcome?",
      competency: "Influence & Communication",
      placeholder: "Write your response here... (minimum 50 words recommended)", minWords: 50, maxWords: 500,
      tip: "Be specific about the situation, your actions, and the result. Use the STAR method if helpful." },
    { id: "oq3", type: "rank", page: 1, title: "Priority Ranking", prompt: "Rank the following leadership competencies from most important to least important for your current role.",
      competency: "Self-Awareness",
      items: ["Strategic Thinking", "People Development", "Results Orientation", "Innovation & Adaptability", "Stakeholder Management", "Ethical Decision Making"],
      tip: "Drag items up or down to reorder. There are no right answers — this reflects your personal leadership priorities." },
    { id: "oq4", type: "matrix", page: 2, title: "Behaviour Frequency", prompt: "How frequently do you demonstrate each of the following behaviours in your day-to-day work?",
      competency: "Team Development",
      rows: ["I actively seek feedback from my team", "I delegate tasks based on team members' strengths", "I celebrate team wins publicly", "I address underperformance promptly", "I invest time in mentoring junior colleagues"],
      cols: ["Rarely", "Sometimes", "Often", "Always"],
      tip: "Rate each behaviour honestly based on your actual frequency, not your aspirations." },
    { id: "oq_factor", type: "factor", page: 2, title: "Factor Selection", prompt: "Select the factors most relevant to your development focus this cycle.",
      competency: "Capability Mix",
      options: ["Grit", "Saville Abstract Numerical Aptitude", "Strategic Thinking", "Resilience", "Influence", "Curiosity", "Decision Quality", "Collaboration"],
      tip: "Pick all that apply — remove a selection with the ×." },
    { id: "oq_csum", type: "constantsum", page: 2, title: "Constant Sum", prompt: "Distribute 100 points across the following priorities based on where you focus your energy.",
      competency: "Prioritisation",
      choices: ["Delivering results", "Developing people", "Driving innovation"], target: 100,
      tip: "The values must add up to 100." },
    { id: "oq_checkgrid", type: "checkgrid", page: 2, title: "Capability Review", prompt: "For each capability, indicate which statements apply.",
      competency: "Self-Awareness",
      rows: ["Strategic planning", "Coaching others", "Stakeholder management"],
      cols: ["A current strength", "A development area", "Not Applicable"],
      tip: "Check all that apply for each row. Selecting Not Applicable clears the others." },
    { id: "oq_numgrid", type: "numgrid", page: 2, title: "Time Allocation", prompt: "Estimate the hours per week you spend on each activity across the two project phases.",
      competency: "Prioritisation",
      rows: ["Planning & strategy", "Hands-on delivery", "Coaching the team"],
      cols: ["Phase 1 hrs", "Phase 2 hrs"],
      tip: "Enter a number for each phase, or tick Not Applicable. The Total updates automatically." },
    { id: "oq_slider", type: "slider", page: 3, title: "Confidence Slider", prompt: "Rate your current confidence level for each capability.",
      competency: "Self-Awareness",
      choices: ["Strategic planning", "Coaching others", "Data-driven decisions"], labels: ["Developing", "Capable", "Expert"],
      tip: "Slide each from 0 to 100." },
    { id: "oq_sbs", type: "sidebyside", page: 3, title: "Side by Side", prompt: "For each statement, choose the answer that applies under each context.",
      competency: "Comparative Judgement",
      groups: [{ label: "In my current role", cols: ["Agree", "Disagree"] }, { label: "In my ideal role", cols: ["Agree", "Disagree"] }],
      statements: ["I have enough autonomy", "I get timely feedback", "My contribution is recognised"],
      tip: "Pick one answer per group, per statement." },
    { id: "oq_imgmulti", type: "imgmulti", page: 3, title: "Work Environment", prompt: "Which of the following work settings help you do your best work? Select all that apply.",
      competency: "Self-Awareness",
      tip: "Choose any that apply — each option shows an example setting.",
      choices: [
        { text: "A quiet, focused individual space", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=72" },
        { text: "A collaborative open team area", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=120&h=120&fit=crop&q=72" },
        { text: "Working remotely from home", img: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=120&h=120&fit=crop&q=72" },
        { text: "On-site, in meetings with stakeholders", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=120&h=120&fit=crop&q=72" },
      ] },
    { id: "oq_img", type: "imgchoice", page: 3, title: "Scenario Recognition", prompt: "Which image best represents effective team collaboration?",
      competency: "Workplace Conduct",
      tip: "Select the scene that shows a team working together. Click an image to choose.",
      choices: [
        { alt: "An individual professional headshot", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=480&h=360&fit=crop&q=72" },
        { alt: "A formal presentation to a seated audience", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=480&h=360&fit=crop&q=72" },
        { alt: "A team collaborating around a whiteboard", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=480&h=360&fit=crop&q=72" },
        { alt: "A person working alone at a desk", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=360&fit=crop&q=72" },
      ] },
    { id: "oq_slidergrid", type: "slidergrid", page: 4, title: "Capability Sliders", prompt: "Rate your current proficiency for each capability from 0 to 100.",
      competency: "Self-Awareness",
      rows: ["Strategic planning", "Coaching others", "Data-driven decisions"], labels: ["Developing", "Capable", "Expert"],
      tip: "Drag each slider; the value shows on the right. Use Clear to reset a row." },
    { id: "oq_bargrid", type: "bargrid", page: 4, title: "Effort Distribution", prompt: "Click the track to indicate how much effort each area takes today.",
      competency: "Prioritisation",
      rows: ["Planning", "Delivery", "Coaching"], labels: ["Low", "Moderate", "High"],
      tip: "Click anywhere on a row's track to set its bar." },
    { id: "oq_stargrid", type: "stargrid", page: 4, title: "Confidence Rating", prompt: "Rate your confidence in each leadership area.",
      competency: "Reflection", max: 5,
      rows: ["Giving feedback", "Leading change", "Resolving conflict"],
      tip: "Tap a star to set the rating; tap it again to clear." },
    { id: "oq_gap", type: "gap", page: 4, title: "Gap Analysis", prompt: "Rate your satisfaction in each area on the scale below.",
      competency: "Reflection",
      categories: ["Career growth", "Work-life balance", "Recognition"], scale: ["😣", "🙁", "😐", "🙂", "😀"],
      tip: "Tap the face that best reflects how you feel about each area." },
    { id: "oq_skill", type: "skillfeedback", page: 4, title: "Campaign Factor Feedback", prompt: "For each skill, choose the factor it maps to and add brief feedback.",
      competency: "Development Planning",
      skills: ["Skill 1", "Skill 2", "Skill 3"], factors: ["Communication", "Strategic Thinking", "Execution", "Influence", "Resilience"],
      tip: "Select a factor and write a short note for each skill." },
    { id: "oq_pgr", type: "pickgrouprank", page: 5, title: "Pick, Group and Rank", prompt: "Drag each item into the group where it best belongs.",
      competency: "Categorisation",
      items: ["Mentoring", "Forecasting", "Prototyping", "Negotiation", "Roadmapping"], groups: ["People", "Strategy", "Execution"],
      tip: "Drag items from the list into a group." },
    { id: "oq_gslider", type: "graphicslider", page: 5, title: "Graphic Slider", prompt: "Where is your energy level for taking on a stretch assignment right now?",
      competency: "Drive",
      tip: "Slide to set your level from low to high." },
    { id: "oq_fillgauge", type: "fillgauge", page: 5, title: "Overall Readiness", prompt: "Drag the slider to indicate your overall readiness for your next role.",
      competency: "Self-Awareness", segments: 9,
      tip: "The gauge fills from the bottom as you move the slider." },
    { id: "oq_shapedraw", type: "shapedraw", page: 5, title: "Shape Annotation", prompt: "Outline the areas of the workspace that need attention. Add a shape, then drag its points to fit.",
      competency: "Spatial Reasoning",
      tip: "Use the toolbar to add, clone, edit or remove shapes. Drag the handles to reshape." },
    { id: "oq5", type: "file", page: 6, title: "Portfolio Evidence", prompt: "Upload a document that demonstrates your leadership impact — a project summary, a presentation you led, or a stakeholder communication you're proud of.",
      competency: "Strategic Thinking",
      accepts: ".pdf,.docx,.pptx,.png,.jpg", maxSize: "10 MB",
      tip: "Choose something recent (within the last 12 months) that shows both your thinking and your impact." },
    { id: "oq6", type: "audio", page: 6, title: "Verbal Reflection", prompt: "In 60-90 seconds, describe your biggest professional achievement in the past year and what it taught you about your leadership style.",
      competency: "Self-Awareness",
      maxDuration: 90,
      tip: "Speak naturally as if explaining to a colleague: what happened, what you did, what you learned." },
    { id: "oq_captcha", type: "captcha", page: 6, title: "Verification", prompt: "Confirm you're human before continuing.",
      competency: "Security",
      tip: "" },
    { id: "oq_video", type: "video", page: 7, title: "Video Response", prompt: "Record a 60–90 second response: introduce yourself and describe a leadership moment you're proud of.",
      competency: "Presence & Communication", maxDuration: 90,
      tip: "Find a quiet, well-lit space. You can re-record before submitting." },
  ],
  chatQuestions: [
    { q: "What do you enjoy most about your current role?", short: "Enjoys", suggestions: ["Strategic planning and big-picture thinking", "Leading and mentoring my team", "Solving complex problems", "Cross-functional collaboration", "Building stakeholder relationships"] },
    { q: "What aspects of your role do you find most challenging or less enjoyable?", short: "Challenges", suggestions: ["Navigating organizational politics", "Managing conflicting priorities", "Difficult conversations with direct reports", "Data-heavy reporting and analysis", "Keeping up with rapid change"] },
    { q: "Are you looking to grow in your current role, or considering a transition?", short: "Direction", suggestions: ["Deepen expertise in my current role", "Grow into a more senior leadership position", "Transition to a different function", "Explore a broader cross-functional scope", "I'm open — help me figure it out"] },
    { q: "What skills do you feel are your strongest and most transferable?", short: "Strengths", suggestions: ["Analytical thinking and problem solving", "Communication and storytelling", "People management and coaching", "Strategic planning", "Data analysis and technical tools"] },
    { q: "What skills would you most like to develop or improve?", short: "Develop", suggestions: ["Executive presence and influence", "Coaching and developing others", "Decision making under ambiguity", "Data analytics and dashboards", "Technical platform knowledge"] },
    { q: "What's your ideal timeline for this development plan?", short: "Timeline", suggestions: ["3 months — focused sprint", "6 months — steady progress", "12 months — comprehensive growth", "Flexible — I'll go at my own pace"] },
    { q: "How do you prefer to learn?", short: "Learning", suggestions: ["Online courses and videos", "Reading books and articles", "Hands-on practice and stretch assignments", "Coaching and mentoring", "Peer learning and group workshops"] },
  ],
  plan: [
    { name: "Influence & Communication", skillType: "behavioral",
      desc: "Strengthen ability to persuade, align stakeholders, and communicate with impact across organizational levels.",
      tips: [
        { type: "70", category: "experience", title: "Lead a Cross-Functional Initiative", desc: "Volunteer to lead a project spanning 2+ departments. Practice influencing without direct authority by building coalitions and aligning competing priorities.", start: "Mar 2026", end: "Jun 2026", success: "Successfully deliver cross-functional project with measurable stakeholder satisfaction improvement.", insight: "Your assessment showed strong analytical skills but lower scores in lateral influence. This experiential assignment directly targets that gap." },
        { type: "20", category: "social", title: "Executive Mentoring Program", desc: "Pair with a senior leader known for stakeholder management excellence. Shadow their key meetings and debrief on influence strategies used.", start: "Mar 2026", end: "Aug 2026", success: "Complete 6 mentoring sessions with documented learnings and at least 2 strategies applied in own work.", insight: "You mentioned wanting to grow into a more senior role. Learning from executives who've mastered influence accelerates this path." },
        { type: "10", category: "course", title: "Stakeholder Influence Masterclass", desc: "Build techniques for persuading and aligning diverse stakeholders across organizational levels.", start: "Apr 2026", end: "Apr 2026", provider: "Coursera", duration: "4 hrs", success: "Complete course and apply RACI framework to at least one active project.", insight: "Based on your preference for structured learning and online courses, this highly-rated program fits your style." },
      ] },
    { name: "Team Development", skillType: "behavioral",
      desc: "Build capability in coaching, delegating, and developing team members to reach their full potential.",
      tips: [
        { type: "70", category: "experience", title: "Delegate a High-Visibility Deliverable", desc: "Identify a key deliverable you normally own and delegate it fully to a direct report. Provide coaching support but resist taking it back.", start: "Mar 2026", end: "May 2026", success: "Direct report delivers the project independently with quality meeting or exceeding standards.", insight: "Deliberate delegation builds the team while freeing your capacity for strategic work. Your chat preferences indicated a desire to grow coaching skills." },
        { type: "20", category: "course", title: "Coaching Skills for Leaders", desc: "Structured coaching program with Internal L&D focused on active listening, powerful questions, and development conversations.", start: "Apr 2026", end: "Jul 2026", provider: "Internal L&D", duration: "6 sessions", success: "Complete all 6 coaching sessions and demonstrate measurable improvement in 360° feedback on coaching behaviors.", insight: "This internal program was selected because you indicated interest in hands-on practice and peer learning formats." },
        { type: "10", category: "reading", title: "Radical Candor — Kim Scott", desc: "Framework for caring personally while challenging directly. Learn the practical methodology for giving feedback that drives growth.", start: "Apr 2026", end: "May 2026", success: "Read and apply the SBI feedback model in at least 3 development conversations with direct reports.", insight: "Reading complements your experiential learning. This book directly addresses the feedback skills gap identified in your assessment." },
      ] },
    { name: "Decision Making", skillType: "behavioral",
      desc: "Improve speed and quality of decisions under ambiguity, and strengthen stakeholder buy-in on tough calls.",
      tips: [
        { type: "70", category: "experience", title: "Decision Journal Practice", desc: "Document key decisions weekly: the context, options considered, reasoning, assumptions, and expected outcomes. Review monthly to identify patterns.", start: "Mar 2026", end: "Aug 2026", success: "Maintain journal for 6 months with monthly review entries showing bias pattern identification.", insight: "Journaling builds metacognition. Your analytical strengths make you well-suited for this reflective practice." },
        { type: "20", category: "social", title: "Peer Decision Review Circle", desc: "Form a small group of 3–4 peers to present real decisions monthly. Get diverse perspectives before committing to major calls.", start: "Apr 2026", end: "Aug 2026", success: "Participate in 5 peer review sessions and apply feedback to at least 2 real decisions.", insight: "You indicated enjoying cross-functional collaboration. This social learning format leverages that preference." },
        { type: "10", category: "course", title: "Data-Driven Decision Making", desc: "Frameworks for combining quantitative analysis with qualitative judgment in complex situations. Case-study intensive.", start: "May 2026", end: "Jun 2026", provider: "HBS Online", duration: "6 hrs", success: "Complete certification and present a case study application to your team.", insight: "This HBS program matches your analytical strengths and preference for structured online learning." },
      ] },
    { name: "Data & Analytics", skillType: "technical",
      desc: "Develop proficiency in data visualization, dashboard design, and using analytics platforms to drive product and business decisions.",
      tips: [
        { type: "70", category: "experience", title: "Build a Live Product Dashboard", desc: "Design and ship a real-time dashboard tracking key product metrics (adoption, engagement, NPS) using your team's analytics stack. Present insights to leadership monthly.", start: "Mar 2026", end: "Jun 2026", success: "Dashboard adopted by team with 3+ stakeholders using it weekly for decision-making.", insight: "Your assessment showed strong strategic thinking but a gap in translating data into actionable visuals. Hands-on dashboard building closes this gap fast." },
        { type: "20", category: "social", title: "Analytics Community of Practice", desc: "Join or start a cross-team analytics CoP. Share techniques, review each other's dashboards, and learn advanced SQL/visualization patterns from data engineers.", start: "Apr 2026", end: "Aug 2026", success: "Attend 6 sessions and contribute at least 2 dashboard templates or analysis frameworks to the group.", insight: "Social learning with data practitioners accelerates technical fluency faster than solo study." },
        { type: "10", category: "course", title: "Google Analytics & Looker Certification", desc: "Structured certification covering data collection, reporting, and dashboard creation in Google's analytics ecosystem.", start: "Apr 2026", end: "May 2026", provider: "Google", duration: "8 hrs", success: "Pass certification exam and apply learnings to at least one product analytics workflow.", insight: "Certification provides structured foundations. Your preference for online learning makes this a natural fit." },
      ] },
    { name: "Product & Platform Architecture", skillType: "technical",
      desc: "Deepen understanding of platform architecture, API design patterns, and technical trade-offs to bridge PM-engineering communication and make better technical decisions.",
      tips: [
        { type: "70", category: "experience", title: "Co-Design a Technical Spec", desc: "Partner with a senior engineer to co-author a technical design document for an upcoming feature. Attend architecture reviews and contribute to trade-off discussions.", start: "Mar 2026", end: "May 2026", success: "Co-authored spec approved by architecture review board with your contributions cited in trade-off analysis.", insight: "Your platform management role requires stronger technical fluency. Co-authoring specs builds this while strengthening engineering relationships." },
        { type: "20", category: "social", title: "Engineering Pair Sessions", desc: "Schedule bi-weekly pair sessions with engineers working on your platform. Observe code reviews, deployment processes, and debugging workflows to build technical empathy.", start: "Apr 2026", end: "Jul 2026", success: "Complete 8 pair sessions covering frontend, backend, and infrastructure. Document key learnings in a PM technical playbook.", insight: "Pairing sessions build the shared language needed for your GTM & AI Solutions PM role bridging product and engineering." },
        { type: "10", category: "course", title: "System Design for Product Managers", desc: "Intensive course covering APIs, microservices, databases, and scalability patterns — tailored for non-engineers making technical product decisions.", start: "May 2026", end: "Jun 2026", provider: "Educative", duration: "10 hrs", success: "Complete course and apply system design framework to evaluate one platform architecture decision.", insight: "This fills the technical vocabulary gap identified in your assessment, enabling more effective platform management conversations." },
      ] },
  ],
  reportsFull: [
    { id: "hogan", name: "Hogan Leadership Profile", program: "Leadership 2026", available: true, pages: 12, based: ["Hogan Assessment"], doneCount: 1,
      desc: "Comprehensive personality profiling covering ambition, sociability, interpersonal sensitivity, prudence, and learning approach scales." },
    { id: "thriving", name: "Thriving Index Report", program: "Leadership 2026", available: true, pages: 8, based: ["Thriving Index"], doneCount: 1,
      desc: "Personal wellbeing, resilience, and engagement scores with benchmarks against your industry and role level." },
    { id: "cognitive", name: "Cognitive Ability Summary", program: "Leadership 2026", available: false, pages: 6, based: ["Cognitive Ability Test"], doneCount: 0,
      desc: "Verbal, numerical, and abstract reasoning scores with percentile rankings and development recommendations." },
    { id: "integrated", name: "Integrated Leadership Report", program: "Leadership 2026", available: false, pages: 24, based: ["Hogan Assessment", "Cognitive Ability Test", "Video Interview"], doneCount: 1,
      desc: "Holistic view combining Hogan personality, cognitive ability, and video interview data into a single leadership potential score." },
    { id: "sim", name: "Business Simulation Debrief", program: "Leadership 2026", available: false, pages: 10, based: ["Business Simulation Center"], doneCount: 0,
      desc: "Detailed assessor feedback on strategic thinking, communication, and crisis management performance during the simulation." },
    { id: "360", name: "360° Feedback Report", program: "360° Perspective", available: false, pages: 18, based: ["Self Assessment", "Nominate Raters", "Track Responses"], doneCount: 1,
      desc: "Consolidated multi-rater feedback with self-other comparison, blind spots, and strengths across leadership competencies." },
  ],
  scheduling: [
    { program: "Leadership Potential Assessment 2026", accentVar: "var(--accent)",
      centers: [
        { id: "sim-sched", name: "Business Simulation Center", icon: "monitor", color: "var(--accent)",
          desc: "Strategic decision-making: market analysis, presentation, and crisis response. Live facilitators and observers present.",
          location: "Virtual — Zoom", duration: "90 min",
          slots: [
            { id: "sl1", date: "Mar 10, 2026", day: "Monday", time: "9:00 AM – 10:30 AM", tz: "GST (UTC+4)", total: 12, remaining: 4, cancelBefore: "48 hours" },
            { id: "sl2", date: "Mar 10, 2026", day: "Monday", time: "2:00 PM – 3:30 PM", tz: "GST (UTC+4)", total: 12, remaining: 8, cancelBefore: "48 hours" },
            { id: "sl3", date: "Mar 12, 2026", day: "Wednesday", time: "9:00 AM – 10:30 AM", tz: "GST (UTC+4)", total: 12, remaining: 1, cancelBefore: null },
            { id: "sl4", date: "Mar 14, 2026", day: "Friday", time: "11:00 AM – 12:30 PM", tz: "GST (UTC+4)", total: 15, remaining: 15, cancelBefore: "24 hours" },
            { id: "sl5", date: "Mar 18, 2026", day: "Tuesday", time: "9:00 AM – 10:30 AM", tz: "GST (UTC+4)", total: 12, remaining: 6, cancelBefore: "48 hours" },
          ] },
        { id: "lac-sched", name: "Leadership Assessment Center", icon: "users", color: "#8F20DE",
          desc: "Full-day group assessment: group exercises, role plays, and case study presentations with trained observers.",
          location: "In-Person — Marsh Dubai Office, DIFC", duration: "4 hours",
          slots: [
            { id: "sl6", date: "Mar 15, 2026", day: "Saturday", time: "9:00 AM – 1:00 PM", tz: "GST (UTC+4)", total: 8, remaining: 2, cancelBefore: null },
            { id: "sl7", date: "Mar 22, 2026", day: "Saturday", time: "9:00 AM – 1:00 PM", tz: "GST (UTC+4)", total: 8, remaining: 5, cancelBefore: "72 hours" },
            { id: "sl8", date: "Mar 29, 2026", day: "Saturday", time: "9:00 AM – 1:00 PM", tz: "GST (UTC+4)", total: 8, remaining: 8, cancelBefore: "72 hours" },
          ] },
      ] },
    { program: "360° Perspective Feedback", accentVar: "var(--purple-750)",
      centers: [
        { id: "cal-sched", name: "Calibration Session", icon: "users", color: "#CB7E03",
          desc: "Live calibration session with your manager and HR to discuss 360° feedback results and development priorities.",
          location: "Virtual — Microsoft Teams", duration: "60 min",
          slots: [
            { id: "sl9", date: "Apr 2, 2026", day: "Wednesday", time: "10:00 AM – 11:00 AM", tz: "GST (UTC+4)", total: 6, remaining: 3, cancelBefore: "24 hours" },
            { id: "sl10", date: "Apr 5, 2026", day: "Saturday", time: "11:00 AM – 12:00 PM", tz: "GST (UTC+4)", total: 6, remaining: 6, cancelBefore: "24 hours" },
          ] },
      ] },
  ],
};

// ── Icons — clean 1.6 stroke, 20×20, inherit color ──
const mk = (paths, fill) => (p = {}) => {
  const { size = 20, stroke = 1.6, ...rest } = p;
  return React.createElement("svg", {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: fill ? "currentColor" : "none", stroke: fill ? "none" : "currentColor",
    strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", ...rest,
  }, paths.map((d, i) => React.createElement("path", { key: i, d })));
};

// Authentic MDS icons are FILLED glyphs (fill=currentColor, evenodd, with a transform).
// mkMds renders one from its raw inner <path> markup (pulled from the MDS icon library).
const mkMds = (inner) => ({ size = 20, ...rest }) => React.createElement("svg", {
  width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor",
  dangerouslySetInnerHTML: { __html: inner }, ...rest,
});

const I = {
  home: mk(["M3 10.5 12 3l9 7.5", "M5 9.5V20h14V9.5"]),
  chart: mk(["M4 20V10", "M10 20V4", "M16 20v-7", "M22 20H2"]),
  users: mk(["M16 19v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7", "M22 19v-2a4 4 0 0 0-3-3.8", "M16 2.2A4 4 0 0 1 16 9.8"]),
  book: mk(["M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z", "M4 19.5A1.5 1.5 0 0 0 5.5 21H20"]),
  cal: mk(["M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z", "M3 9h18", "M8 3v4", "M16 3v4"]),
  calCheck: mk(["M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z", "M3 9h18", "M8 3v4", "M16 3v4", "M9 15.5l2 2 4-4"]),
  bars: mk(["M5 21V8", "M12 21V3", "M19 21v-9"]),
  bell: mk(["M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9", "M13.7 21a2 2 0 0 1-3.4 0"]),
  search: mk(["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "M21 21l-4.3-4.3"]),
  arrow: mk(["M5 12h14", "M13 6l6 6-6 6"]),
  arrowUR: mk(["M7 17 17 7", "M8 7h9v9"]),
  clock: mk(["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 7v5l3 2"]),
  check: mk(["M20 6 9 17l-5-5"]),
  checkCircle: mk(["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M8.5 12l2.5 2.5L16 9"]),
  lock: mk(["M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z", "M8 11V8a4 4 0 0 1 8 0v3"]),
  gear: mk(["M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z", "M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.3 1a7.6 7.6 0 0 0-1.7-1l-.3-2.5h-4l-.3 2.5a7.6 7.6 0 0 0-1.7 1l-2.3-1-2 3.4L4.6 11a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7.6 7.6 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7.6 7.6 0 0 0 1.7-1l2.3 1 2-3.4z"]),
  chevR: mk(["M9 6l6 6-6 6"]),
  chevL: mk(["M15 6l-6 6 6 6"]),
  chevD: mk(["M6 9l6 6 6-6"]),
  menu: mk(["M3 6h18", "M3 12h18", "M3 18h18"]),
  panel: mk(["M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z", "M9 5v14"]),
  image: mk(["M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z", "M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z", "M21 15l-5-5L5 19"]),
  layers: mk(["M12 3 3 8l9 5 9-5-9-5z", "M3 13l9 5 9-5", "M3 18l9 5 9-5"]),
  doc: mk(["M7 3h7l5 5v13a0 0 0 0 1 0 0H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z", "M14 3v5h5"]),
  globe: mk(["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M3 12h18", "M12 3a14 14 0 0 1 0 18", "M12 3a14 14 0 0 0 0 18"]),
  plus: mk(["M12 5v14", "M5 12h14"]),
  spark: mk(["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"]),
  eye: mk(["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"]),
  filter: mk(["M3 5h18", "M6 12h12", "M10 19h4"]),
  sun: mk(["M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z", "M12 1v2", "M12 21v2", "M4.6 4.6l1.4 1.4", "M18 18l1.4 1.4", "M1 12h2", "M21 12h2", "M4.6 19.4l1.4-1.4", "M18 6l1.4-1.4"]),
  M: mk(["M3 21V5l9 8 9-8v16"]),
  play: mk(["M8 5v14l11-7z"], true),
  shield: mk(["M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z"]),
  monitor: mk(["M3 4h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z", "M8 20h8", "M12 16v4"]),
  wifi: mk(["M2 9a15 15 0 0 1 20 0", "M5.5 12.5a10 10 0 0 1 13 0", "M9 16a5 5 0 0 1 6 0", "M12 19.5h.01"]),
  cam: mk(["M3 7h11a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z", "M15 10l6-3v10l-6-3"]),
  mic: mk(["M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z", "M19 11a7 7 0 0 1-14 0", "M12 18v3", "M8 21h8"]),
  upload: mk(["M12 16V4", "M7 9l5-5 5 5", "M4 20h16"]),
  download: mk(["M12 4v12", "M7 11l5 5 5-5", "M4 20h16"]),
  info: mk(["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 11v5", "M12 8h.01"]),
  alertCircle: mk(["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 8v5", "M12 16h.01"]),
  bulb: mk(["M9 18h6", "M10 21h4", "M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3z"]),
  fileText: mk(["M7 3h7l5 5v13H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z", "M14 3v5h5", "M9 13h6", "M9 17h4"]),
  arrowL: mk(["M19 12H5", "M11 18l-6-6 6-6"]),
  target: mk(["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z", "M12 12h.01"]),
  rocket: mk(["M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0z", "M12 15l-3-3a14 14 0 0 1 8-9c2.5 0 4 1.5 4 4a14 14 0 0 1-9 8z", "M9 12H5s.5-2.8 2-4 4-1 4-1", "M12 15v4s2.8-.5 4-2 1-4 1-4"]),
  clip: mk(["M21 11l-9 9a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"]),
  send: mk(["M22 2 11 13", "M22 2l-7 20-4-9-9-4z"]),
  chat: mk(["M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 1 1 16.1-3.8z", "M8.5 11.5h.01", "M12 11.5h.01", "M15.5 11.5h.01"]),
  edit: mk(["M12 20h9", "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"]),
  user: mk(["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4.5 20a7.5 7.5 0 0 1 15 0"]),
  moon: mk(["M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"]),
  logout: mk(["M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4", "M15 12H7", "M15 6l6 6-6 6"]),
  // ── Authentic MDS filled glyphs (from the MDS icon library) ──
  mdsLibrary: mkMds(`<path d="M 7.25 11.25 L 10.99 11.25 L 10.99 9.75 L 7.25 9.75 L 7.25 11.25 Z M 7.25 8.25 L 14.731 8.25 L 14.731 6.75 L 7.25 6.75 L 7.25 8.25 Z M 7.25 5.25 L 14.731 5.25 L 14.731 3.75 L 7.25 3.75 L 7.25 5.25 Z M 5.308 15 C 4.803 15 4.375 14.825 4.025 14.475 C 3.675 14.125 3.5 13.697 3.5 13.192 L 3.5 1.808 C 3.5 1.303 3.675 0.875 4.025 0.525 C 4.375 0.175 4.803 0 5.308 0 L 16.692 0 C 17.197 0 17.625 0.175 17.975 0.525 C 18.325 0.875 18.5 1.303 18.5 1.808 L 18.5 13.192 C 18.5 13.697 18.325 14.125 17.975 14.475 C 17.625 14.825 17.197 15 16.692 15 L 5.308 15 Z M 5.308 13.5 L 16.692 13.5 C 16.769 13.5 16.84 13.468 16.904 13.404 C 16.968 13.34 17 13.269 17 13.192 L 17 1.808 C 17 1.731 16.968 1.66 16.904 1.596 C 16.84 1.532 16.769 1.5 16.692 1.5 L 5.308 1.5 C 5.231 1.5 5.16 1.532 5.096 1.596 C 5.032 1.66 5 1.731 5 1.808 L 5 13.192 C 5 13.269 5.032 13.34 5.096 13.404 C 5.16 13.468 5.231 13.5 5.308 13.5 Z M 1.808 18.5 C 1.303 18.5 0.875 18.325 0.525 17.975 C 0.175 17.625 0 17.197 0 16.692 L 0 3.808 L 1.5 3.808 L 1.5 16.692 C 1.5 16.769 1.532 16.84 1.596 16.904 C 1.66 16.968 1.731 17 1.808 17 L 14.692 17 L 14.692 18.5 L 1.808 18.5 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2.750 2.500)"/>`),
  mdsBriefcase: mkMds(`<path d="M 1.808 17.5 C 1.303 17.5 0.875 17.325 0.525 16.975 C 0.175 16.625 0 16.197 0 15.692 L 0 5.308 C 0 4.803 0.175 4.375 0.525 4.025 C 0.875 3.675 1.303 3.5 1.808 3.5 L 6 3.5 L 6 1.808 C 6 1.303 6.175 0.875 6.525 0.525 C 6.875 0.175 7.303 0 7.808 0 L 11.192 0 C 11.697 0 12.125 0.175 12.475 0.525 C 12.825 0.875 13 1.303 13 1.808 L 13 3.5 L 17.192 3.5 C 17.697 3.5 18.125 3.675 18.475 4.025 C 18.825 4.375 19 4.803 19 5.308 L 19 15.692 C 19 16.197 18.825 16.625 18.475 16.975 C 18.125 17.325 17.697 17.5 17.192 17.5 L 1.808 17.5 Z M 7.5 3.5 L 11.5 3.5 L 11.5 1.808 C 11.5 1.731 11.468 1.66 11.404 1.596 C 11.34 1.532 11.269 1.5 11.192 1.5 L 7.808 1.5 C 7.731 1.5 7.66 1.532 7.596 1.596 C 7.532 1.66 7.5 1.731 7.5 1.808 L 7.5 3.5 Z M 17.5 11.75 L 12 11.75 L 12 13.5 L 7 13.5 L 7 11.75 L 1.5 11.75 L 1.5 15.692 C 1.5 15.769 1.532 15.84 1.596 15.904 C 1.66 15.968 1.731 16 1.808 16 L 17.192 16 C 17.269 16 17.34 15.968 17.404 15.904 C 17.468 15.84 17.5 15.769 17.5 15.692 L 17.5 11.75 Z M 8.5 12 L 10.5 12 L 10.5 10 L 8.5 10 L 8.5 12 Z M 1.5 10.25 L 7 10.25 L 7 8.5 L 12 8.5 L 12 10.25 L 17.5 10.25 L 17.5 5.308 C 17.5 5.231 17.468 5.16 17.404 5.096 C 17.34 5.032 17.269 5 17.192 5 L 1.808 5 C 1.731 5 1.66 5.032 1.596 5.096 C 1.532 5.16 1.5 5.231 1.5 5.308 L 1.5 10.25 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2.500 3)"/>`),
  mdsBook: mkMds(`<path d="M 3.058 19 C 2.213 19 1.492 18.702 0.895 18.105 C 0.298 17.508 0 16.787 0 15.942 L 0 3.25 C 0 2.348 0.316 1.58 0.948 0.948 C 1.58 0.316 2.348 0 3.25 0 L 15 0 L 15 14.385 C 14.57 14.385 14.204 14.537 13.899 14.841 C 13.595 15.146 13.442 15.513 13.442 15.942 C 13.442 16.372 13.595 16.739 13.899 17.043 C 14.204 17.348 14.57 17.5 15 17.5 L 15 19 L 3.058 19 Z M 1.5 13.344 C 1.727 13.189 1.97 13.074 2.23 12.998 C 2.489 12.923 2.765 12.885 3.058 12.885 L 3.692 12.885 L 3.692 1.5 L 3.25 1.5 C 2.769 1.5 2.357 1.672 2.014 2.015 C 1.671 2.357 1.5 2.769 1.5 3.25 L 1.5 13.344 Z M 5.192 12.885 L 13.5 12.885 L 13.5 1.5 L 5.192 1.5 L 5.192 12.885 Z M 3.058 17.5 L 12.402 17.5 C 12.257 17.273 12.144 17.032 12.063 16.778 C 11.983 16.523 11.942 16.245 11.942 15.942 C 11.942 15.656 11.98 15.382 12.056 15.119 C 12.131 14.856 12.247 14.612 12.402 14.385 L 3.058 14.385 C 2.612 14.385 2.24 14.537 1.944 14.841 C 1.648 15.146 1.5 15.513 1.5 15.942 C 1.5 16.388 1.648 16.76 1.944 17.056 C 2.24 17.352 2.612 17.5 3.058 17.5 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 4.500 2.500)"/>`),
  mdsPeople: mkMds(`<path d="M 0 10.481 L 0 9.262 C 0 8.596 0.347 8.05 1.042 7.622 C 1.737 7.195 2.643 6.981 3.76 6.981 C 3.944 6.981 4.13 6.987 4.317 6.998 C 4.504 7.01 4.693 7.032 4.883 7.065 C 4.688 7.377 4.543 7.7 4.449 8.036 C 4.355 8.371 4.308 8.715 4.308 9.067 L 4.308 10.481 L 0 10.481 Z M 6 10.481 L 6 9.106 C 6 8.638 6.131 8.21 6.394 7.822 C 6.657 7.434 7.036 7.096 7.531 6.808 C 8.026 6.519 8.61 6.303 9.285 6.159 C 9.959 6.014 10.696 5.942 11.496 5.942 C 12.312 5.942 13.056 6.014 13.731 6.159 C 14.405 6.303 14.99 6.519 15.484 6.808 C 15.979 7.096 16.356 7.434 16.614 7.822 C 16.871 8.21 17 8.638 17 9.106 L 17 10.481 L 6 10.481 Z M 18.692 10.481 L 18.692 9.07 C 18.692 8.694 18.648 8.34 18.559 8.007 C 18.47 7.674 18.336 7.36 18.158 7.065 C 18.354 7.032 18.541 7.01 18.72 6.998 C 18.899 6.987 19.076 6.981 19.25 6.981 C 20.367 6.981 21.271 7.192 21.962 7.615 C 22.654 8.037 23 8.586 23 9.262 L 23 10.481 L 18.692 10.481 Z M 7.577 8.981 L 15.438 8.981 L 15.438 8.875 C 15.336 8.471 14.91 8.131 14.162 7.856 C 13.413 7.58 12.526 7.442 11.5 7.442 C 10.474 7.442 9.587 7.58 8.839 7.856 C 8.09 8.131 7.669 8.471 7.577 8.875 L 7.577 8.981 Z M 3.757 6.01 C 3.286 6.01 2.883 5.842 2.549 5.507 C 2.215 5.172 2.048 4.769 2.048 4.298 C 2.048 3.821 2.216 3.418 2.551 3.09 C 2.886 2.761 3.289 2.596 3.76 2.596 C 4.237 2.596 4.641 2.761 4.973 3.09 C 5.305 3.418 5.471 3.822 5.471 4.301 C 5.471 4.766 5.307 5.167 4.978 5.504 C 4.65 5.841 4.243 6.01 3.757 6.01 Z M 19.25 6.01 C 18.783 6.01 18.381 5.841 18.044 5.504 C 17.707 5.167 17.538 4.766 17.538 4.301 C 17.538 3.822 17.707 3.418 18.044 3.09 C 18.381 2.761 18.784 2.596 19.252 2.596 C 19.734 2.596 20.139 2.761 20.468 3.09 C 20.797 3.418 20.962 3.821 20.962 4.298 C 20.962 4.769 20.798 5.172 20.47 5.507 C 20.142 5.842 19.735 6.01 19.25 6.01 Z M 11.504 5.192 C 10.783 5.192 10.17 4.94 9.664 4.435 C 9.157 3.93 8.904 3.317 8.904 2.596 C 8.904 1.861 9.156 1.244 9.661 0.746 C 10.166 0.249 10.779 0 11.5 0 C 12.236 0 12.852 0.249 13.35 0.746 C 13.847 1.242 14.096 1.858 14.096 2.593 C 14.096 3.313 13.848 3.926 13.351 4.433 C 12.854 4.939 12.238 5.192 11.504 5.192 Z M 11.505 3.692 C 11.811 3.692 12.069 3.585 12.28 3.371 C 12.491 3.157 12.596 2.897 12.596 2.591 C 12.596 2.286 12.491 2.027 12.281 1.816 C 12.071 1.605 11.81 1.5 11.5 1.5 C 11.197 1.5 10.939 1.605 10.725 1.815 C 10.511 2.025 10.404 2.286 10.404 2.596 C 10.404 2.899 10.511 3.157 10.725 3.371 C 10.939 3.585 11.199 3.692 11.505 3.692 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 0.500 7.307)"/>`),
  mdsSparkle: mkMds(`<path d="M 5.852 6.019 L 3.207 3.375 L 4.277 2.306 L 6.921 4.95 L 5.852 6.019 Z M 9.635 3.75 L 9.635 0 L 11.135 0 L 11.135 3.75 L 9.635 3.75 Z M 16.467 16.635 L 13.823 13.991 L 14.892 12.921 L 17.537 15.566 L 16.467 16.635 Z M 15.084 5.827 L 14.015 4.758 L 16.66 2.113 L 17.729 3.183 L 15.084 5.827 Z M 16.092 10.208 L 16.092 8.708 L 19.842 8.708 L 19.842 10.208 L 16.092 10.208 Z M 2.529 19.562 L 0.271 17.304 C 0.09 17.123 0 16.912 0 16.671 C 0 16.43 0.09 16.219 0.271 16.039 L 9.067 7.227 C 9.552 6.74 10.142 6.496 10.835 6.496 C 11.528 6.496 12.118 6.739 12.606 7.225 C 13.093 7.71 13.337 8.3 13.337 8.994 C 13.337 9.688 13.093 10.278 12.606 10.766 L 3.794 19.562 C 3.613 19.742 3.402 19.833 3.161 19.833 C 2.92 19.833 2.71 19.742 2.529 19.562 Z M 3.161 18.096 L 9.436 11.821 L 8.012 10.421 L 1.761 16.671 L 3.161 18.096 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2.616 1.542)"/>`),
  mdsDocument: mkMds(`<path d="M 3.75 3.75 L 11.25 3.75 L 11.25 5.25 L 3.75 5.25 L 3.75 3.75 Z M 3.75 7.75 L 11.25 7.75 L 11.25 9.25 L 3.75 9.25 L 3.75 7.75 Z M 1.808 0 C 1.303 0 0.875 0.175 0.525 0.525 C 0.175 0.875 0 1.303 0 1.808 L 0 17.192 C 0 17.697 0.175 18.125 0.525 18.475 C 0.875 18.825 1.303 19 1.808 19 L 9.75 19 L 15 13.75 L 15 1.808 C 15 1.303 14.825 0.875 14.475 0.525 C 14.125 0.175 13.697 0 13.192 0 L 1.808 0 Z M 9 13 L 9 17.5 L 1.808 17.5 C 1.731 17.5 1.66 17.468 1.596 17.404 C 1.532 17.34 1.5 17.269 1.5 17.192 L 1.5 1.808 C 1.5 1.731 1.532 1.66 1.596 1.596 C 1.66 1.532 1.731 1.5 1.808 1.5 L 13.192 1.5 C 13.269 1.5 13.34 1.532 13.404 1.596 C 13.468 1.66 13.5 1.731 13.5 1.808 L 13.5 13 L 9 13 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 -1 4.500 21.500)"/>`),
  mdsCheck: mkMds(`<path d="M 5.335 11.304 L 0 5.969 L 1.069 4.9 L 5.335 9.165 L 14.5 0 L 15.569 1.069 L 5.335 11.304 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2 2) matrix(1 0 0 1 2.220 4.380)"/>`),
};

// ── Marsh wordmark (inline so it can be recolored white-on-midnight) ──
const MARSH_PATH = "M21.645 30.43h.556l12.868-6.04v19.874h8.101V0h-.676zM0 0v44.264h8.099V24.396l12.805 6.034h.619L.679 0zm68.962.37L48.24 44.263h8.167l3.622-8.112h17.659l3.648 8.112H90.3L69.519.37zm-6.078 29.385 5.943-13.311 5.985 13.311zm56.83-3.413c2.244-1.086 4.02-2.613 5.317-4.582q1.948-2.954 1.948-6.763c0-2.745-.663-5.14-1.981-7.19q-1.986-3.072-5.445-4.825-3.463-1.751-7.854-1.75H95.371v43.032h8.413V8.484h6.992q3.334-.001 5.595 1.75c1.508 1.168 2.259 2.76 2.259 4.765s-.756 3.618-2.259 4.825-3.372 1.814-5.595 1.814h-5.752l13.606 22.623h9.464l-10.605-17.062a15.6 15.6 0 0 0 2.225-.858m40.017-3.532a17.6 17.6 0 0 0-4.298-2.06 55 55 0 0 0-4.732-1.323 38 38 0 0 1-4.331-1.261c-1.303-.47-2.351-1.106-3.157-1.905q-1.208-1.2-1.206-3.23.001-2.456 2.194-4.088c1.464-1.086 3.263-1.628 5.411-1.628 2.428 0 4.688.41 6.77 1.232q3.123 1.229 5.101 3.259v-8.73a21.6 21.6 0 0 0-5.629-1.935 32.5 32.5 0 0 0-6.247-.582q-4.456 0-8.011 1.628-3.558 1.63-5.658 4.61c-1.398 1.988-2.103 4.316-2.103 6.978q-.001 3.44 1.204 5.655 1.21 2.21 3.156 3.563a17.2 17.2 0 0 0 4.332 2.153 61 61 0 0 0 4.732 1.383c1.565.392 3 .809 4.298 1.26 1.302.45 2.35 1.047 3.156 1.784l.01-.005c.806.741 1.207 1.72 1.207 2.953 0 1.639-.757 3-2.26 4.089-1.508 1.085-3.39 1.628-5.657 1.628-2.761 0-5.343-.491-7.733-1.473q-3.585-1.47-6-3.933v9.158a23.4 23.4 0 0 0 6.463 2.303c2.332.47 4.75.708 7.27.708q4.574 0 8.195-1.628 3.614-1.63 5.751-4.61c1.42-1.988 2.132-4.311 2.132-6.978q.001-3.379-1.204-5.533-1.21-2.15-3.156-3.442M199.589 1.23v17.767h-19.36V1.23h-8.411v43.034h8.411V26.25h19.36v18.013H208V1.23z";
const MarshWordmark = ({ color = "#001F52", height = 22, ...rest }) =>
  React.createElement("svg", { viewBox: "0 0 208 45", height, fill: color,
    style: { display: "block", height, width: "auto" }, ...rest },
    React.createElement("path", { d: MARSH_PATH }));

// Top-bar back registry: a page can push its in-page sub-view back link up to the
// dashboard's fixed top bar via this context. The shell (DashEditorial / DashBoardroom)
// provides { setBack }, and calls setBack({ label, onClick }) render it on the top-bar
// left; setBack(null) clears it. Pages register on entering a sub-view and clear on exit.
const LHTopBarContext = React.createContext(null);
// Convenience hook: registers a top-bar back while `active`, auto-clears on change/unmount.
function useTopBarBack(active, label, onClick) {
  const ctx = React.useContext(LHTopBarContext);
  const cbRef = React.useRef(onClick);
  cbRef.current = onClick;
  React.useEffect(() => {
    if (!ctx) return;
    if (active) {
      ctx.setBack({ label, onClick: () => cbRef.current && cbRef.current() });
      return () => ctx.setBack(null);
    }
    ctx.setBack(null);
  }, [ctx, active, label]);
}

// ── URL routing (shared by Folio + Boardroom, which use the same {page,progId,center,target}
// route shape) ── Give every in-app page its own hash URL (deep-linkable, back/forward-capable).
// Serialize the route to a readable path and parse it back, resolving program / exercise /
// center object refs by their id so a cold-loaded or back-navigated deep URL fully restores.
function edFindEx(prog, exId) {
  if (!prog || !prog.detail || !exId) return null;
  const d = prog.detail;
  return [].concat(d.centers || [], d.sequential || [], d.open || []).find((e) => e.id === exId) || null;
}
function edRouteToPath(r) {
  if (!r) return "dashboard";
  const p = r.page, base = r.progId ? "program/" + r.progId : "dashboard";
  const exId = r.target && r.target.id ? "/" + r.target.id : "";
  switch (p) {
    case "dash": return "dashboard";
    case "development": {
      const m = r.idpMode;
      if (m === "plan") return "development/plan";
      if (m === "landing") return "development/new";
      if (m === "manual") return "development/manual";
      if (m === "flow") return "development/questions" + (r.idpStep != null ? "/" + r.idpStep : "");
      return "development";
    }
    case "scheduling": return r.schedCenter ? "scheduling/" + r.schedCenter : "scheduling";
    case "insights": return "insights";
    case "bookings": return "bookings";
    case "profile": return "profile";
    case "changePassword": return "change-password";
    case "settings": return "settings";
    case "tasks": return base;
    case "instructions": return base + "/instructions";
    case "center": return base + "/center" + (r.center && r.center.id ? "/" + r.center.id : "");
    case "precheck": return base + "/system-check" + exId;
    case "assessintro": return base + "/assessment" + exId;
    case "consent": return base + "/assessment" + exId + "/consent";
    case "openassess": {
      const ap = base + "/assessment" + exId;
      if (r.oaStep === "complete") return ap + "/complete";
      const qp = ap + "/questions";
      if (r.oaLayout === "split" && r.oaQIdx != null) return qp + "/" + (r.oaQIdx + 1);
      if (r.oaLayout && r.oaLayout !== "split" && r.oaPage != null) return qp + "/page-" + (r.oaPage + 1);
      return qp;
    }
    default: return "dashboard";
  }
}
function edPathToRoute(path) {
  const segs = window.LHRoute ? LHRoute.norm(path).split("/").filter(Boolean) : [];
  const def = { page: "dash", progId: null, center: null, target: null };
  if (!segs.length) return def;
  const s0 = segs[0];
  const simple = { dashboard: "dash", insights: "insights", bookings: "bookings", profile: "profile", settings: "settings" };
  if (simple[s0]) return { page: simple[s0], progId: null, center: null, target: null };
  if (s0 === "scheduling") return { page: "scheduling", progId: null, center: null, target: null, schedCenter: segs[1] || null };
  if (s0 === "change-password") return { page: "changePassword", progId: null, center: null, target: null };
  if (s0 === "development") {
    const map = { plan: "plan", new: "landing", manual: "manual", questions: "flow" };
    const m = map[segs[1]] || "choose";
    const r = { page: "development", progId: null, center: null, target: null, idpMode: m };
    if (m === "flow" && segs[2] != null && /^\d+$/.test(segs[2])) r.idpStep = parseInt(segs[2], 10);
    return r;
  }
  if (s0 === "program") {
    const progId = segs[1];
    const prog = (window.LH && LH.programs || []).find((p) => p.id === progId);
    if (!prog) return def;
    const sub = segs[2], tasks = { page: "tasks", progId, center: null, target: null };
    if (!sub) return tasks;
    if (sub === "instructions") return { page: "instructions", progId, center: null, target: null };
    if (sub === "center") { const c = edFindEx(prog, segs[3]); return c ? { page: "center", progId, center: c, target: null } : tasks; }
    if (sub === "system-check") { const t = edFindEx(prog, segs[3]); return t ? { page: "precheck", progId, center: null, target: t } : tasks; }
    if (sub === "assessment") {
      const ex = edFindEx(prog, segs[3]);
      if (!ex) return tasks;
      const leaf = segs[4];
      if (leaf === "consent") return { page: "consent", progId, center: null, target: ex };
      if (leaf === "complete") return { page: "openassess", progId, center: null, target: ex, oaStep: "complete" };
      if (leaf === "questions") {
        const q = segs[5], r = { page: "openassess", progId, center: null, target: ex, oaStep: "question" };
        if (q && /^\d+$/.test(q)) { r.oaLayout = "split"; r.oaQIdx = Math.max(0, parseInt(q, 10) - 1); }
        else if (q && /^page-\d+$/.test(q)) { r.oaLayout = "paged"; r.oaPage = Math.max(0, parseInt(q.slice(5), 10) - 1); }
        return r;
      }
      return { page: "assessintro", progId, center: null, target: ex };
    }
    return tasks;
  }
  return def;
}

Object.assign(window, { LH, I, MarshWordmark, LHTopBarContext, useTopBarBack, edFindEx, edRouteToPath, edPathToRoute });
