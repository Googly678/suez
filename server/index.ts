import express from 'express';
import Database from 'better-sqlite3';
import path from 'node:path';

const app = express();
const port = Number(process.env.API_PORT || 3002);

app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

const dbFile = path.resolve(process.cwd(), 'server/data/demo.db');
const db = new Database(dbFile);

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS policies (
  policy_no TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  insurer TEXT NOT NULL,
  insurance_type TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT
);

CREATE TABLE IF NOT EXISTS claim_assists (
  assist_no TEXT PRIMARY KEY,
  policy_no TEXT NOT NULL,
  customer_code TEXT,
  customer_name TEXT,
  company TEXT,
  insurance_type TEXT,
  insured TEXT,
  start_time TEXT,
  end_time TEXT,
  status TEXT NOT NULL,
  latest_review_comment TEXT,
  related_case_no TEXT,
  report_time TEXT,
  updated_at TEXT,
  payload_json TEXT,
  FOREIGN KEY (policy_no) REFERENCES policies(policy_no)
);

CREATE TABLE IF NOT EXISTS appraisal_cases (
  case_no TEXT PRIMARY KEY,
  assist_no TEXT,
  policy_no TEXT NOT NULL,
  customer_code TEXT,
  insured TEXT,
  company TEXT,
  insurance_type TEXT,
  status TEXT NOT NULL,
  report_time TEXT,
  review_decision TEXT,
  review_comment TEXT,
  review_time TEXT,
  FOREIGN KEY (assist_no) REFERENCES claim_assists(assist_no),
  FOREIGN KEY (policy_no) REFERENCES policies(policy_no)
);

CREATE TABLE IF NOT EXISTS status_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`);

try {
  db.exec('ALTER TABLE claim_assists ADD COLUMN latest_review_comment TEXT');
} catch {
  // Column already exists; ignore migration error.
}

try {
  db.exec('ALTER TABLE appraisal_cases ADD COLUMN review_comment TEXT');
} catch {
  // Column already exists; ignore migration error.
}

// Backfill legacy links: if a case misses assist_no, recover it from claim_assists.related_case_no.
db.exec(`
UPDATE appraisal_cases
SET assist_no = (
  SELECT ca.assist_no
  FROM claim_assists ca
  WHERE ca.related_case_no = appraisal_cases.case_no
  LIMIT 1
)
WHERE (assist_no IS NULL OR assist_no = '')
  AND EXISTS (
    SELECT 1
    FROM claim_assists ca
    WHERE ca.related_case_no = appraisal_cases.case_no
  );
`);

const seedPolicies = [
  ['POL-2026-8899001', '顺丰速运', '平安产险', '物流责任险', '2026-01-01', '2026-12-31'],
  ['POL-2026-8899002', '滴滴出行', '人保财险', '货运险', '2026-02-15', '2027-02-14'],
  ['POL-2026-8899003', '跨越速运', '太平洋保险', '公众责任险', '2026-03-20', '2027-03-19'],
];

const insertPolicy = db.prepare(
  'INSERT OR IGNORE INTO policies (policy_no, customer_name, insurer, insurance_type, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
);
seedPolicies.forEach((item) => insertPolicy.run(...item));

const assistNoSeedStmt = db.prepare("SELECT assist_no FROM claim_assists ORDER BY assist_no DESC LIMIT 1");
const caseNoSeedStmt = db.prepare("SELECT case_no FROM appraisal_cases ORDER BY case_no DESC LIMIT 1");

let assistSeed = 0;
let caseSeed = 0;

const lastAssistNo = assistNoSeedStmt.get() as { assist_no?: string } | undefined;
if (lastAssistNo?.assist_no) {
  const tail = Number(lastAssistNo.assist_no.split('-').pop());
  assistSeed = Number.isFinite(tail) ? tail : 0;
}

const lastCaseNo = caseNoSeedStmt.get() as { case_no?: string } | undefined;
if (lastCaseNo?.case_no) {
  const tail = Number(lastCaseNo.case_no.split('-').pop());
  caseSeed = Number.isFinite(tail) ? tail : 0;
}

function nowStr() {
  return new Date().toLocaleString('zh-CN');
}

function dateNoDash() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function genAssistNo() {
  assistSeed += 1;
  return `LAS-${dateNoDash()}-${String(assistSeed).padStart(3, '0')}`;
}

function genCaseNo() {
  caseSeed += 1;
  return `CLM-${dateNoDash()}-${String(caseSeed).padStart(3, '0')}`;
}

const getAssistByNo = db.prepare('SELECT * FROM claim_assists WHERE assist_no = ?');
const getAssistByCaseNo = db.prepare('SELECT * FROM claim_assists WHERE related_case_no = ?');
const getCaseByNo = db.prepare('SELECT * FROM appraisal_cases WHERE case_no = ?');

const upsertAssistStmt = db.prepare(`
INSERT INTO claim_assists (
  assist_no, policy_no, customer_code, customer_name, company, insurance_type, insured,
  start_time, end_time, status, latest_review_comment, related_case_no, report_time, updated_at, payload_json
) VALUES (
  @assist_no, @policy_no, @customer_code, @customer_name, @company, @insurance_type, @insured,
  @start_time, @end_time, @status, @latest_review_comment, @related_case_no, @report_time, @updated_at, @payload_json
)
ON CONFLICT(assist_no) DO UPDATE SET
  policy_no=excluded.policy_no,
  customer_code=excluded.customer_code,
  customer_name=excluded.customer_name,
  company=excluded.company,
  insurance_type=excluded.insurance_type,
  insured=excluded.insured,
  start_time=excluded.start_time,
  end_time=excluded.end_time,
  status=excluded.status,
  latest_review_comment=excluded.latest_review_comment,
  related_case_no=excluded.related_case_no,
  report_time=excluded.report_time,
  updated_at=excluded.updated_at,
  payload_json=excluded.payload_json
`);

const upsertCaseStmt = db.prepare(`
INSERT INTO appraisal_cases (
  case_no, assist_no, policy_no, customer_code, insured, company, insurance_type,
  status, report_time, review_decision, review_comment, review_time
) VALUES (
  @case_no, @assist_no, @policy_no, @customer_code, @insured, @company, @insurance_type,
  @status, @report_time, @review_decision, @review_comment, @review_time
)
ON CONFLICT(case_no) DO UPDATE SET
  assist_no=excluded.assist_no,
  policy_no=excluded.policy_no,
  customer_code=excluded.customer_code,
  insured=excluded.insured,
  company=excluded.company,
  insurance_type=excluded.insurance_type,
  status=excluded.status,
  report_time=excluded.report_time,
  review_decision=excluded.review_decision,
  review_comment=excluded.review_comment,
  review_time=excluded.review_time
`);

const insertLogStmt = db.prepare(
  'INSERT INTO status_logs (entity_type, entity_id, from_status, to_status, action, created_at) VALUES (?, ?, ?, ?, ?, ?)',
);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'claims-api', time: new Date().toISOString() });
});

app.get('/api/policies', (_req, res) => {
  const rows = db.prepare('SELECT * FROM policies ORDER BY policy_no').all();
  res.json({ data: rows });
});

app.get('/api/policies/:policyNo/claims', (req, res) => {
  const { policyNo } = req.params;
  const assists = db
    .prepare('SELECT * FROM claim_assists WHERE policy_no = ? ORDER BY updated_at DESC, assist_no DESC')
    .all(policyNo);
  const cases = db
    .prepare('SELECT * FROM appraisal_cases WHERE policy_no = ? ORDER BY report_time DESC, case_no DESC')
    .all(policyNo);

  res.json({ data: { assists, cases } });
});

app.get('/api/claim-assists', (_req, res) => {
  const rows = db.prepare('SELECT * FROM claim_assists ORDER BY updated_at DESC, assist_no DESC').all();
  res.json({ data: rows });
});

app.get('/api/appraisal-cases', (_req, res) => {
  const rows = db.prepare('SELECT * FROM appraisal_cases ORDER BY report_time DESC, case_no DESC').all();
  res.json({ data: rows });
});

app.post('/api/claim-assists/save', (req, res) => {
  const body = req.body || {};
  const action = body.action === 'submit' ? 'submit' : 'draft';

  const assistNo = body.assistNo || genAssistNo();
  const oldAssist = getAssistByNo.get(assistNo) as any;

  // Returned assists can be edited and resubmitted; only active/completed approvals are locked.
  if (oldAssist && action === 'submit' && ['已提交', '公估中', '定损中', '审核中', '定损协议通过'].includes(oldAssist.status)) {
    res.status(409).json({ error: '该理赔协助已进入审批流程，无法重复提交。' });
    return;
  }

  const toStatus = action === 'submit' ? '已提交' : '已暂存';

  let relatedCaseNo = oldAssist?.related_case_no || body.relatedCaseNo || null;
  if (action === 'submit' && !relatedCaseNo) {
    relatedCaseNo = genCaseNo();
  }

  const payload = {
    assist_no: assistNo,
    policy_no: body.policyNo,
    customer_code: body.customerCode || '',
    customer_name: body.customerName || '',
    company: body.company || '',
    insurance_type: body.type || body.insuranceType || '',
    insured: body.insured || '',
    start_time: body.startTime || '',
    end_time: body.endTime || '',
    status: toStatus,
    latest_review_comment: oldAssist?.latest_review_comment || '',
    related_case_no: relatedCaseNo,
    report_time: action === 'submit' ? nowStr() : oldAssist?.report_time || '',
    updated_at: nowStr(),
    payload_json: JSON.stringify(body),
  };

  const tx = db.transaction(() => {
    upsertAssistStmt.run(payload);
    insertLogStmt.run('claim_assist', assistNo, oldAssist?.status || null, toStatus, action, nowStr());

    if (action === 'submit' && relatedCaseNo) {
      const oldCase = getCaseByNo.get(relatedCaseNo) as any;
      const casePayload = {
        case_no: relatedCaseNo,
        assist_no: assistNo,
        policy_no: body.policyNo,
        customer_code: body.customerCode || '',
        insured: body.insured || '',
        company: body.company || '',
        insurance_type: body.type || body.insuranceType || '',
        status: '已提交',
        report_time: nowStr(),
        review_decision: null,
        review_comment: null,
        review_time: null,
      };
      upsertCaseStmt.run(casePayload);
    }
  });

  tx();

  const assist = getAssistByNo.get(assistNo);
  const relatedCase = relatedCaseNo ? getCaseByNo.get(relatedCaseNo) : null;

  res.json({
    data: {
      assist,
      case: relatedCase,
    },
  });
});

app.post('/api/appraisal-cases/:caseNo/open', (req, res) => {
  const { caseNo } = req.params;
  const stage = req.body?.stage === 'insurer' ? 'insurer' : 'appraisal';
  const current = getCaseByNo.get(caseNo) as any;
  if (!current) {
    res.status(404).json({ error: '案件不存在' });
    return;
  }

  const openableStatuses = stage === 'insurer' ? ['定损中'] : ['已提交', '待审核', '待理算'];
  if (!openableStatuses.includes(current.status)) {
    res.json({
      data: {
        case: current,
        assist: current.assist_no ? getAssistByNo.get(current.assist_no) : null,
      },
    });
    return;
  }

  const tx = db.transaction(() => {
    const nextStatus = stage === 'insurer' ? '审核中' : '公估中';
    upsertCaseStmt.run({
      ...current,
      status: nextStatus,
    });
    insertLogStmt.run('appraisal_case', caseNo, current.status, nextStatus, 'open', nowStr());

    const assist = (current.assist_no
      ? getAssistByNo.get(current.assist_no)
      : getAssistByCaseNo.get(caseNo)) as any;
    if (assist) {
      upsertAssistStmt.run({
        ...assist,
        status: nextStatus,
        latest_review_comment: assist.latest_review_comment || '',
        updated_at: nowStr(),
      });
      insertLogStmt.run('claim_assist', assist.assist_no, assist.status, nextStatus, 'open', nowStr());
    }
  });

  tx();

  res.json({
    data: {
      case: getCaseByNo.get(caseNo),
      assist: (current.assist_no ? getAssistByNo.get(current.assist_no) : getAssistByCaseNo.get(caseNo)) || null,
    },
  });
});

app.post('/api/appraisal-cases/:caseNo/review', (req, res) => {
  const { caseNo } = req.params;
  const decision = req.body?.decision;
  const stage = req.body?.stage === 'insurer' ? 'insurer' : 'appraisal';
  const comment = typeof req.body?.comment === 'string' ? req.body.comment : '';

  if (!['approve', 'reject'].includes(decision)) {
    res.status(400).json({ error: 'decision 必须为 approve 或 reject' });
    return;
  }

  const current = getCaseByNo.get(caseNo) as any;
  if (!current) {
    res.status(404).json({ error: '案件不存在' });
    return;
  }

  const nextStatus =
    stage === 'insurer'
      ? decision === 'approve'
        ? '定损协议通过'
        : '审核退回'
      : decision === 'approve'
        ? '定损中'
        : '已退回';

  const tx = db.transaction(() => {
    upsertCaseStmt.run({
      ...current,
      status: nextStatus,
      review_decision: decision,
      review_comment: comment,
      review_time: nowStr(),
    });
    insertLogStmt.run('appraisal_case', caseNo, current.status, nextStatus, 'review', nowStr());

    const assist = (current.assist_no
      ? getAssistByNo.get(current.assist_no)
      : getAssistByCaseNo.get(caseNo)) as any;
    if (assist) {
      upsertAssistStmt.run({
        ...assist,
        status: nextStatus,
        latest_review_comment: comment,
        updated_at: nowStr(),
      });
      insertLogStmt.run('claim_assist', assist.assist_no, assist.status, nextStatus, 'review', nowStr());
    }
  });

  tx();

  res.json({
    data: {
      case: getCaseByNo.get(caseNo),
      assist: (current.assist_no ? getAssistByNo.get(current.assist_no) : getAssistByCaseNo.get(caseNo)) || null,
    },
  });
});

app.get('/api/status-logs', (_req, res) => {
  const rows = db.prepare('SELECT * FROM status_logs ORDER BY id DESC LIMIT 200').all();
  res.json({ data: rows });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[claims-api] running at http://localhost:${port}`);
});
