const SCANS = [
  { id:1, name:"api.fenrir-security.com", type:"DAST",    status:"Completed", progress:100, critical:3, high:7,  medium:12, low:5,  lastScan:"2 hrs ago"  },
  { id:2, name:"dashboard.internal",      type:"SAST",    status:"Completed", progress:100, critical:0, high:2,  medium:8,  low:14, lastScan:"5 hrs ago"  },
  { id:3, name:"auth-service:8080",       type:"DAST",    status:"Failed",    progress:47,  critical:1, high:0,  medium:3,  low:0,  lastScan:"1 day ago"  },
  { id:4, name:"payments.fenrir.io",      type:"DAST",    status:"Scheduled", progress:0,   critical:0, high:0,  medium:0,  low:0,  lastScan:"—"          },
  { id:5, name:"cdn-edge-nodes",          type:"Network", status:"Completed", progress:100, critical:0, high:1,  medium:4,  low:9,  lastScan:"3 days ago" },
  { id:6, name:"admin-portal.fenrir",     type:"SAST",    status:"Completed", progress:100, critical:2, high:5,  medium:6,  low:3,  lastScan:"4 days ago" },
];

const LOG_ENTRIES = [
  { time:"14:32:01", msg:"Initializing spider on",        hl:"https://api.fenrir-security.com", sfx:"",                    clr:"#0CC8A8" },
  { time:"14:32:03", msg:"Discovered endpoint",           hl:"/api/v1/auth/login",              sfx:" [POST]",              clr:"#0CC8A8" },
  { time:"14:32:05", msg:"Discovered endpoint",           hl:"/api/v1/users/{id}",              sfx:" [GET, PUT, DELETE]",  clr:"#0CC8A8" },
  { time:"14:32:08", msg:"Testing injection vectors on",  hl:"/api/v1/auth/login",              sfx:"",                    clr:"#0CC8A8" },
  { time:"14:32:11", msg:"⚠ Potential SQLi at param",     hl:"username",                        sfx:" — confirming...",     clr:"#fb923c" },
  { time:"14:32:14", msg:"✓ Confirmed SQL Injection",     hl:"CVE-2024-3891",                   sfx:" — CRITICAL",          clr:"#f87171" },
  { time:"14:32:17", msg:"Fuzzing headers:",              hl:"Authorization, X-API-Key",        sfx:"",                    clr:"#0CC8A8" },
  { time:"14:32:20", msg:"Testing IDOR on",               hl:"/api/v1/users/{id}",              sfx:" — 240 permutations",  clr:"#0CC8A8" },
  { time:"14:32:25", msg:"⚠ IDOR confirmed on",           hl:"/api/v1/users/1337",              sfx:"",                    clr:"#fb923c" },
  { time:"14:32:29", msg:"Mapping JS bundles...",         hl:"",                                sfx:"",                    clr:"#71717a" },
  { time:"14:32:33", msg:"✓ AWS key exposed in",          hl:"main.bundle.js:4892",             sfx:"",                    clr:"#f87171" },
  { time:"14:32:38", msg:"Running validation loop...",    hl:"",                                sfx:"",                    clr:"#71717a" },
];

const FINDINGS = [
  { id:1, sev:"Critical", time:"14:32:14", title:"SQL Injection via Login Parameter",    ep:"/api/v1/auth/login",    desc:"Unsanitized username enables stacked queries — full DB read/write." },
  { id:2, sev:"Critical", time:"14:32:33", title:"Exposed AWS Credentials in JS Bundle", ep:"main.bundle.js:4892",   desc:"AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID embedded in the bundle." },
  { id:3, sev:"High",     time:"14:32:25", title:"Insecure Direct Object Reference",     ep:"/api/v1/users/{id}",    desc:"Authenticated users can read any user record by enumerating IDs." },
  { id:4, sev:"High",     time:"14:32:44", title:"Missing Rate Limiting on Auth",         ep:"/api/v1/auth/login",    desc:"No rate limiting allows brute-force credential stuffing at scale." },
  { id:5, sev:"Medium",   time:"14:32:51", title:"Verbose Error Messages Exposed",        ep:"/api/v1/users/me",      desc:"Stack traces and DB schema returned in 500 responses in production." },
];