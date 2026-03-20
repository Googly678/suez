import express from 'express';
import Database from 'better-sqlite3';
import path from 'node:path';

const app = express();
const port = Number(process.env.API_PORT || 3002);

const PERMISSION_CATALOG = [
  { code: 'system.org.view', name: '查看机构', module: 'system' },
  { code: 'system.org.manage', name: '管理机构', module: 'system' },
  { code: 'system.role.view', name: '查看角色', module: 'system' },
  { code: 'system.role.manage', name: '管理角色', module: 'system' },
  { code: 'system.user.view', name: '查看用户', module: 'system' },
  { code: 'system.user.manage', name: '管理用户', module: 'system' },
  { code: 'policies.view', name: '查看保单', module: 'policies' },
  { code: 'sales.customer.view', name: '查看客户', module: 'sales' },
  { code: 'sales.customer.manage', name: '管理客户', module: 'sales' },
  { code: 'sales.opportunity.view', name: '查看商机', module: 'sales' },
  { code: 'sales.opportunity.manage', name: '管理商机', module: 'sales' },
  { code: 'sales.inquiry.view', name: '查看询价单', module: 'sales' },
  { code: 'sales.inquiry.manage', name: '管理询价单', module: 'sales' },
  { code: 'claims.assist.view', name: '查看理赔协助', module: 'claims' },
  { code: 'claims.assist.manage', name: '编辑理赔协助', module: 'claims' },
  { code: 'claims.assist.submit', name: '提交理赔协助', module: 'claims' },
  { code: 'claims.appraisal.view', name: '查看公估理赔', module: 'claims' },
  { code: 'claims.appraisal.review', name: '公估审核', module: 'claims' },
  { code: 'claims.insurer.view', name: '查看保司审核', module: 'claims' },
  { code: 'claims.insurer.review', name: '保司审核', module: 'claims' },
] as const;

const ALL_PERMISSION_CODES = PERMISSION_CATALOG.map((item) => item.code);

type PermissionCode = (typeof PERMISSION_CATALOG)[number]['code'];
type UserRow = {
  user_id: string;
  username: string;
  password: string;
  real_name: string;
  email: string;
  org_id: string;
  role_id: string;
  status: string;
  created_at: string;
  updated_at: string;
};
type RoleRow = {
  role_id: string;
  role_name: string;
  description: string;
  org_id: string;
  permissions_json: string;
  created_at: string;
  updated_at: string;
};
type OrganizationRow = {
  org_id: string;
  org_code: string;
  org_name: string;
  parent_org_id: string | null;
  org_level: number;
  leader_name: string;
  created_at: string;
  updated_at: string;
};

app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-User-Id');
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
  org_id TEXT,
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
  org_id TEXT,
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
  org_id TEXT,
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

CREATE TABLE IF NOT EXISTS inquiries (
  inquiry_no TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_code TEXT,
  org_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  form_data_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  submitted_at TEXT,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id)
);

CREATE TABLE IF NOT EXISTS organizations (
  org_id TEXT PRIMARY KEY,
  org_code TEXT NOT NULL UNIQUE,
  org_name TEXT NOT NULL,
  parent_org_id TEXT,
  org_level INTEGER NOT NULL,
  leader_name TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (parent_org_id) REFERENCES organizations(org_id)
);

CREATE TABLE IF NOT EXISTS roles (
  role_id TEXT PRIMARY KEY,
  role_name TEXT NOT NULL UNIQUE,
  description TEXT,
  org_id TEXT,
  permissions_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id)
);

CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  real_name TEXT NOT NULL,
  email TEXT,
  org_id TEXT,
  role_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
);
`);

try {
  db.exec('ALTER TABLE claim_assists ADD COLUMN latest_review_comment TEXT');
} catch {
  // ignore
}

try {
  db.exec('ALTER TABLE policies ADD COLUMN org_id TEXT');
} catch {
  // ignore
}

try {
  db.exec('ALTER TABLE claim_assists ADD COLUMN org_id TEXT');
} catch {
  // ignore
}

try {
  db.exec('ALTER TABLE appraisal_cases ADD COLUMN org_id TEXT');
} catch {
  // ignore
}

try {
  db.exec('ALTER TABLE appraisal_cases ADD COLUMN review_comment TEXT');
} catch {
  // ignore
}

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

db.exec(`
UPDATE policies
SET org_id = CASE
  WHEN policy_no = 'POL-2026-8899001' THEN 'ORG-201'
  WHEN policy_no = 'POL-2026-8899002' THEN 'ORG-202'
  WHEN policy_no = 'POL-2026-8899003' THEN 'ORG-203'
  ELSE COALESCE(org_id, 'ORG-001')
END
WHERE org_id IS NULL OR org_id = '';

UPDATE claim_assists
SET org_id = COALESCE(
  org_id,
  (SELECT p.org_id FROM policies p WHERE p.policy_no = claim_assists.policy_no),
  'ORG-001'
)
WHERE org_id IS NULL OR org_id = '';

UPDATE appraisal_cases
SET org_id = COALESCE(
  org_id,
  (SELECT p.org_id FROM policies p WHERE p.policy_no = appraisal_cases.policy_no),
  'ORG-001'
)
WHERE org_id IS NULL OR org_id = '';
`);

const nowStr = () => new Date().toLocaleString('zh-CN');

function dateNoDash() {
  const date = new Date();
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
}

function parsePermissions(value?: string | null): PermissionCode[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildOrgTree(rows: OrganizationRow[]) {
  const nodeMap = new Map<string, any>();
  rows.forEach((row) => nodeMap.set(row.org_id, { ...row, children: [] }));

  const roots: any[] = [];
  nodeMap.forEach((node) => {
    if (node.parent_org_id && nodeMap.has(node.parent_org_id)) {
      nodeMap.get(node.parent_org_id).children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

const seedPolicies = [
  ['POL-2026-8899001', '顺丰速运', '平安产险', '物流责任险', 'ORG-201', '2026-01-01', '2026-12-31'],
  ['POL-2026-8899002', '滴滴出行', '人保财险', '货运险', 'ORG-202', '2026-02-15', '2027-02-14'],
  ['POL-2026-8899003', '跨越速运', '太平洋保险', '公众责任险', 'ORG-203', '2026-03-20', '2027-03-19'],
];

const seedOrganizations = [
  { org_id: 'ORG-001', org_code: 'HQ', org_name: '集团总部', parent_org_id: null, org_level: 1, leader_name: '赵总' },
  { org_id: 'ORG-101', org_code: 'REG-SOUTH', org_name: '华南大区', parent_org_id: 'ORG-001', org_level: 2, leader_name: '陈华' },
  { org_id: 'ORG-102', org_code: 'REG-NORTH', org_name: '华北大区', parent_org_id: 'ORG-001', org_level: 2, leader_name: '李明' },
  { org_id: 'ORG-201', org_code: 'SZ-BRANCH', org_name: '深圳分公司', parent_org_id: 'ORG-101', org_level: 3, leader_name: '王敏' },
  { org_id: 'ORG-202', org_code: 'GZ-BRANCH', org_name: '广州分公司', parent_org_id: 'ORG-101', org_level: 3, leader_name: '周楠' },
  { org_id: 'ORG-203', org_code: 'BJ-BRANCH', org_name: '北京分公司', parent_org_id: 'ORG-102', org_level: 3, leader_name: '刘凯' },
];

const seedRoles = [
  {
    role_id: 'ROLE-001',
    role_name: '系统管理员',
    description: '拥有系统全部权限',
    org_id: 'ORG-001',
    permissions: ALL_PERMISSION_CODES,
  },
  {
    role_id: 'ROLE-002',
    role_name: '销售经理',
    description: '负责客户、商机、询价与保单查询',
    org_id: 'ORG-101',
    permissions: [
      'policies.view',
      'sales.customer.view',
      'sales.customer.manage',
      'sales.opportunity.view',
      'sales.opportunity.manage',
      'sales.inquiry.view',
      'sales.inquiry.manage',
      'claims.assist.view',
      'claims.assist.manage',
      'claims.assist.submit',
    ],
  },
  {
    role_id: 'ROLE-003',
    role_name: '公估审核员',
    description: '负责公估审核处理',
    org_id: 'ORG-001',
    permissions: ['policies.view', 'claims.assist.view', 'claims.appraisal.view', 'claims.appraisal.review'],
  },
  {
    role_id: 'ROLE-004',
    role_name: '保司审核员',
    description: '负责保司审核处理',
    org_id: 'ORG-001',
    permissions: ['policies.view', 'claims.assist.view', 'claims.insurer.view', 'claims.insurer.review'],
  },
];

const seedUsers = [
  {
    user_id: 'USER-001',
    username: 'admin',
    password: '123456',
    real_name: '系统管理员',
    email: 'admin@suez.demo',
    org_id: 'ORG-001',
    role_id: 'ROLE-001',
    status: 'active',
  },
  {
    user_id: 'USER-002',
    username: 'sales.sz',
    password: '123456',
    real_name: '深圳销售经理',
    email: 'sales.sz@suez.demo',
    org_id: 'ORG-201',
    role_id: 'ROLE-002',
    status: 'active',
  },
  {
    user_id: 'USER-003',
    username: 'appraisal',
    password: '123456',
    real_name: '公估审核员',
    email: 'appraisal@suez.demo',
    org_id: 'ORG-001',
    role_id: 'ROLE-003',
    status: 'active',
  },
  {
    user_id: 'USER-004',
    username: 'insurer',
    password: '123456',
    real_name: '保司审核员',
    email: 'insurer@suez.demo',
    org_id: 'ORG-001',
    role_id: 'ROLE-004',
    status: 'active',
  },
];

const insertPolicy = db.prepare(
  'INSERT OR IGNORE INTO policies (policy_no, customer_name, insurer, insurance_type, org_id, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
);
seedPolicies.forEach((item) => insertPolicy.run(...item));

const upsertOrgStmt = db.prepare(`
INSERT INTO organizations (org_id, org_code, org_name, parent_org_id, org_level, leader_name, created_at, updated_at)
VALUES (@org_id, @org_code, @org_name, @parent_org_id, @org_level, @leader_name, @created_at, @updated_at)
ON CONFLICT(org_id) DO UPDATE SET
  org_code=excluded.org_code,
  org_name=excluded.org_name,
  parent_org_id=excluded.parent_org_id,
  org_level=excluded.org_level,
  leader_name=excluded.leader_name,
  updated_at=excluded.updated_at
`);

const upsertRoleStmt = db.prepare(`
INSERT INTO roles (role_id, role_name, description, org_id, permissions_json, created_at, updated_at)
VALUES (@role_id, @role_name, @description, @org_id, @permissions_json, @created_at, @updated_at)
ON CONFLICT(role_id) DO UPDATE SET
  role_name=excluded.role_name,
  description=excluded.description,
  org_id=excluded.org_id,
  permissions_json=excluded.permissions_json,
  updated_at=excluded.updated_at
`);

const upsertUserStmt = db.prepare(`
INSERT INTO users (user_id, username, password, real_name, email, org_id, role_id, status, created_at, updated_at)
VALUES (@user_id, @username, @password, @real_name, @email, @org_id, @role_id, @status, @created_at, @updated_at)
ON CONFLICT(user_id) DO UPDATE SET
  username=excluded.username,
  password=excluded.password,
  real_name=excluded.real_name,
  email=excluded.email,
  org_id=excluded.org_id,
  role_id=excluded.role_id,
  status=excluded.status,
  updated_at=excluded.updated_at
`);

const seedTime = nowStr();
seedOrganizations.forEach((item) => upsertOrgStmt.run({ ...item, created_at: seedTime, updated_at: seedTime }));
seedRoles.forEach((item) => upsertRoleStmt.run({ ...item, permissions_json: JSON.stringify(item.permissions), created_at: seedTime, updated_at: seedTime }));
seedUsers.forEach((item) => upsertUserStmt.run({ ...item, created_at: seedTime, updated_at: seedTime }));

const assistNoSeedStmt = db.prepare('SELECT assist_no FROM claim_assists ORDER BY assist_no DESC LIMIT 1');
const caseNoSeedStmt = db.prepare('SELECT case_no FROM appraisal_cases ORDER BY case_no DESC LIMIT 1');

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

function genAssistNo() {
  assistSeed += 1;
  return `LAS-${dateNoDash()}-${String(assistSeed).padStart(3, '0')}`;
}

function genCaseNo() {
  caseSeed += 1;
  return `CLM-${dateNoDash()}-${String(caseSeed).padStart(3, '0')}`;
}

function genOrgId() {
  return `ORG-${Date.now()}`;
}

function genRoleId() {
  return `ROLE-${Date.now()}`;
}

function genUserId() {
  return `USER-${Date.now()}`;
}

const getAssistByNo = db.prepare('SELECT * FROM claim_assists WHERE assist_no = ?');
const getAssistByCaseNo = db.prepare('SELECT * FROM claim_assists WHERE related_case_no = ?');
const getCaseByNo = db.prepare('SELECT * FROM appraisal_cases WHERE case_no = ?');
const getPolicyByNo = db.prepare('SELECT * FROM policies WHERE policy_no = ?');
const getOrgById = db.prepare('SELECT * FROM organizations WHERE org_id = ?');
const getRoleById = db.prepare('SELECT * FROM roles WHERE role_id = ?');
const getRoleByName = db.prepare('SELECT * FROM roles WHERE role_name = ?');
const getUserById = db.prepare('SELECT * FROM users WHERE user_id = ?');
const getUserByUsername = db.prepare('SELECT * FROM users WHERE username = ?');

const listOrganizationsStmt = db.prepare('SELECT * FROM organizations ORDER BY org_level, org_code');
const listRolesStmt = db.prepare('SELECT * FROM roles ORDER BY role_name');
const listUsersStmt = db.prepare('SELECT * FROM users ORDER BY username');

const upsertAssistStmt = db.prepare(`
INSERT INTO claim_assists (
  assist_no, policy_no, customer_code, customer_name, company, insurance_type, insured,
  start_time, end_time, status, latest_review_comment, related_case_no, report_time, updated_at, payload_json, org_id
) VALUES (
  @assist_no, @policy_no, @customer_code, @customer_name, @company, @insurance_type, @insured,
  @start_time, @end_time, @status, @latest_review_comment, @related_case_no, @report_time, @updated_at, @payload_json, @org_id
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
  payload_json=excluded.payload_json,
  org_id=excluded.org_id
`);

const upsertCaseStmt = db.prepare(`
INSERT INTO appraisal_cases (
  case_no, assist_no, policy_no, customer_code, insured, company, insurance_type,
  status, report_time, review_decision, review_comment, review_time, org_id
) VALUES (
  @case_no, @assist_no, @policy_no, @customer_code, @insured, @company, @insurance_type,
  @status, @report_time, @review_decision, @review_comment, @review_time, @org_id
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
  review_time=excluded.review_time,
  org_id=excluded.org_id
`);

const insertLogStmt = db.prepare(
  'INSERT INTO status_logs (entity_type, entity_id, from_status, to_status, action, created_at) VALUES (?, ?, ?, ?, ?, ?)',
);

function serializeRole(role: RoleRow | undefined | null) {
  if (!role) return null;
  const org = getOrgById.get(role.org_id) as OrganizationRow | undefined;
  return {
    roleId: role.role_id,
    roleName: role.role_name,
    description: role.description || '',
    orgId: role.org_id || '',
    orgName: org?.org_name || '',
    permissions: parsePermissions(role.permissions_json),
    createdAt: role.created_at,
    updatedAt: role.updated_at,
  };
}

function serializeUser(user: UserRow | undefined | null) {
  if (!user) return null;
  const role = serializeRole(getRoleById.get(user.role_id) as RoleRow | undefined);
  const org = getOrgById.get(user.org_id) as OrganizationRow | undefined;
  return {
    userId: user.user_id,
    username: user.username,
    realName: user.real_name,
    email: user.email || '',
    orgId: user.org_id || '',
    orgName: org?.org_name || '',
    roleId: user.role_id || '',
    roleName: role?.roleName || '',
    permissions: role?.permissions || [],
    status: user.status,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

function getCurrentUser(req: express.Request) {
  const userId = String(req.header('x-user-id') || '').trim();
  if (!userId) return undefined;
  const user = getUserById.get(userId) as UserRow | undefined;
  return serializeUser(user);
}

function hasPermission(user: ReturnType<typeof getCurrentUser>, permission: PermissionCode | PermissionCode[]) {
  if (!user) return false;
  const permissions = Array.isArray(permission) ? permission : [permission];
  return permissions.some((item) => user.permissions.includes(item));
}

function ensurePermission(req: express.Request, res: express.Response, permission: PermissionCode | PermissionCode[]) {
  const currentUser = getCurrentUser(req);
  if (!currentUser) {
    res.status(401).json({ error: '未登录或会话失效' });
    return null;
  }

  if (!hasPermission(currentUser, permission)) {
    res.status(403).json({ error: '当前角色无权限执行该操作' });
    return null;
  }

  return currentUser;
}

function getScopedOrgIds(orgId: string) {
  if (!orgId) return [] as string[];
  const allOrgs = listOrganizationsStmt.all() as OrganizationRow[];
  const childrenMap = new Map<string, string[]>();

  allOrgs.forEach((item) => {
    const key = item.parent_org_id || '__ROOT__';
    childrenMap.set(key, [...(childrenMap.get(key) || []), item.org_id]);
  });

  const queue = [orgId];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift() as string;
    if (visited.has(current)) continue;
    visited.add(current);
    const children = childrenMap.get(current) || [];
    children.forEach((child) => {
      if (!visited.has(child)) queue.push(child);
    });
  }

  return Array.from(visited);
}

function createInClausePlaceholder(values: string[]) {
  return values.map(() => '?').join(',');
}

function ensureDataScope(user: ReturnType<typeof getCurrentUser>, rowOrgId: string | null | undefined) {
  if (!user?.orgId || !rowOrgId) return false;
  return getScopedOrgIds(user.orgId).includes(rowOrgId);
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'claims-api', time: new Date().toISOString() });
});

app.post('/api/auth/login', (req, res) => {
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '').trim();
  const matchedUser = getUserByUsername.get(username) as UserRow | undefined;

  if (!matchedUser || matchedUser.password !== password) {
    res.status(401).json({ error: '用户名或密码错误' });
    return;
  }

  if (matchedUser.status !== 'active') {
    res.status(403).json({ error: '当前用户已停用' });
    return;
  }

  res.json({ data: { user: serializeUser(matchedUser), token: matchedUser.user_id } });
});

app.get('/api/auth/me', (req, res) => {
  const currentUser = getCurrentUser(req);
  if (!currentUser) {
    res.status(401).json({ error: '未登录或会话失效' });
    return;
  }
  res.json({ data: currentUser });
});

app.get('/api/system/bootstrap', (req, res) => {
  const currentUser = ensurePermission(req, res, [
    'system.org.view',
    'system.role.view',
    'system.user.view',
    'policies.view',
    'sales.customer.view',
    'claims.assist.view',
  ]);
  if (!currentUser) return;

  const organizations = listOrganizationsStmt.all() as OrganizationRow[];
  const roles = (listRolesStmt.all() as RoleRow[]).map((item) => serializeRole(item));
  const users = (listUsersStmt.all() as UserRow[]).map((item) => serializeUser(item));

  res.json({
    data: {
      currentUser,
      permissions: PERMISSION_CATALOG,
      organizations,
      organizationTree: buildOrgTree(organizations),
      roles,
      users,
    },
  });
});

app.get('/api/system/permissions', (req, res) => {
  const currentUser = ensurePermission(req, res, ['system.role.view', 'system.role.manage']);
  if (!currentUser) return;
  res.json({ data: PERMISSION_CATALOG });
});

app.get('/api/system/organizations', (req, res) => {
  const currentUser = ensurePermission(req, res, ['system.org.view', 'system.org.manage']);
  if (!currentUser) return;
  const organizations = listOrganizationsStmt.all() as OrganizationRow[];
  res.json({ data: { list: organizations, tree: buildOrgTree(organizations) } });
});

app.post('/api/system/organizations', (req, res) => {
  const currentUser = ensurePermission(req, res, 'system.org.manage');
  if (!currentUser) return;

  const body = req.body || {};
  const parentId = body.parentOrgId || null;
  const parent = parentId ? (getOrgById.get(parentId) as OrganizationRow | undefined) : null;
  const orgLevel = parent ? parent.org_level + 1 : 1;

  if (orgLevel > 3) {
    res.status(400).json({ error: '机构层级最多支持三级' });
    return;
  }

  const payload = {
    org_id: genOrgId(),
    org_code: String(body.orgCode || '').trim(),
    org_name: String(body.orgName || '').trim(),
    parent_org_id: parentId,
    org_level: orgLevel,
    leader_name: String(body.leaderName || '').trim(),
    created_at: nowStr(),
    updated_at: nowStr(),
  };

  if (!payload.org_code || !payload.org_name) {
    res.status(400).json({ error: '机构编码和机构名称不能为空' });
    return;
  }

  upsertOrgStmt.run(payload);
  res.json({ data: getOrgById.get(payload.org_id) });
});

app.patch('/api/system/organizations/:orgId', (req, res) => {
  const currentUser = ensurePermission(req, res, 'system.org.manage');
  if (!currentUser) return;

  const orgId = req.params.orgId;
  const current = getOrgById.get(orgId) as OrganizationRow | undefined;
  if (!current) {
    res.status(404).json({ error: '机构不存在' });
    return;
  }

  const parentId = req.body?.parentOrgId ?? current.parent_org_id;
  const parent = parentId ? (getOrgById.get(parentId) as OrganizationRow | undefined) : null;
  const nextLevel = parent ? parent.org_level + 1 : 1;
  if (nextLevel > 3) {
    res.status(400).json({ error: '机构层级最多支持三级' });
    return;
  }

  upsertOrgStmt.run({
    ...current,
    org_code: String(req.body?.orgCode ?? current.org_code),
    org_name: String(req.body?.orgName ?? current.org_name),
    parent_org_id: parentId,
    org_level: nextLevel,
    leader_name: String(req.body?.leaderName ?? current.leader_name ?? ''),
    updated_at: nowStr(),
  });

  res.json({ data: getOrgById.get(orgId) });
});

app.get('/api/system/roles', (req, res) => {
  const currentUser = ensurePermission(req, res, ['system.role.view', 'system.role.manage']);
  if (!currentUser) return;
  const roles = (listRolesStmt.all() as RoleRow[]).map((item) => serializeRole(item));
  res.json({ data: roles });
});

app.post('/api/system/roles', (req, res) => {
  const currentUser = ensurePermission(req, res, 'system.role.manage');
  if (!currentUser) return;

  const roleName = String(req.body?.roleName || '').trim();
  if (!roleName) {
    res.status(400).json({ error: '角色名称不能为空' });
    return;
  }

  if (getRoleByName.get(roleName)) {
    res.status(409).json({ error: '角色名称已存在' });
    return;
  }

  const permissions = Array.isArray(req.body?.permissions)
    ? req.body.permissions.filter((item: string) => ALL_PERMISSION_CODES.includes(item as PermissionCode))
    : [];

  const payload = {
    role_id: genRoleId(),
    role_name: roleName,
    description: String(req.body?.description || '').trim(),
    org_id: String(req.body?.orgId || ''),
    permissions_json: JSON.stringify(permissions),
    created_at: nowStr(),
    updated_at: nowStr(),
  };

  upsertRoleStmt.run(payload);
  res.json({ data: serializeRole(getRoleById.get(payload.role_id) as RoleRow | undefined) });
});

app.patch('/api/system/roles/:roleId', (req, res) => {
  const currentUser = ensurePermission(req, res, 'system.role.manage');
  if (!currentUser) return;
  const current = getRoleById.get(req.params.roleId) as RoleRow | undefined;
  if (!current) {
    res.status(404).json({ error: '角色不存在' });
    return;
  }

  const permissions = Array.isArray(req.body?.permissions)
    ? req.body.permissions.filter((item: string) => ALL_PERMISSION_CODES.includes(item as PermissionCode))
    : parsePermissions(current.permissions_json);

  upsertRoleStmt.run({
    ...current,
    role_name: String(req.body?.roleName ?? current.role_name),
    description: String(req.body?.description ?? current.description ?? ''),
    org_id: String(req.body?.orgId ?? current.org_id ?? ''),
    permissions_json: JSON.stringify(permissions),
    updated_at: nowStr(),
  });

  res.json({ data: serializeRole(getRoleById.get(req.params.roleId) as RoleRow | undefined) });
});

app.get('/api/system/users', (req, res) => {
  const currentUser = ensurePermission(req, res, ['system.user.view', 'system.user.manage']);
  if (!currentUser) return;
  const users = (listUsersStmt.all() as UserRow[]).map((item) => serializeUser(item));
  res.json({ data: users });
});

app.post('/api/system/users', (req, res) => {
  const currentUser = ensurePermission(req, res, 'system.user.manage');
  if (!currentUser) return;

  const username = String(req.body?.username || '').trim();
  if (!username) {
    res.status(400).json({ error: '用户名不能为空' });
    return;
  }

  if (getUserByUsername.get(username)) {
    res.status(409).json({ error: '用户名已存在' });
    return;
  }

  const payload = {
    user_id: genUserId(),
    username,
    password: String(req.body?.password || '123456'),
    real_name: String(req.body?.realName || '').trim(),
    email: String(req.body?.email || '').trim(),
    org_id: String(req.body?.orgId || ''),
    role_id: String(req.body?.roleId || ''),
    status: String(req.body?.status || 'active'),
    created_at: nowStr(),
    updated_at: nowStr(),
  };

  if (!payload.real_name || !payload.role_id) {
    res.status(400).json({ error: '姓名和角色不能为空' });
    return;
  }

  upsertUserStmt.run(payload);
  res.json({ data: serializeUser(getUserById.get(payload.user_id) as UserRow | undefined) });
});

app.patch('/api/system/users/:userId', (req, res) => {
  const currentUser = ensurePermission(req, res, 'system.user.manage');
  if (!currentUser) return;

  const current = getUserById.get(req.params.userId) as UserRow | undefined;
  if (!current) {
    res.status(404).json({ error: '用户不存在' });
    return;
  }

  upsertUserStmt.run({
    ...current,
    username: String(req.body?.username ?? current.username),
    password: String(req.body?.password || current.password),
    real_name: String(req.body?.realName ?? current.real_name),
    email: String(req.body?.email ?? current.email ?? ''),
    org_id: String(req.body?.orgId ?? current.org_id ?? ''),
    role_id: String(req.body?.roleId ?? current.role_id ?? ''),
    status: String(req.body?.status ?? current.status),
    updated_at: nowStr(),
  });

  res.json({ data: serializeUser(getUserById.get(req.params.userId) as UserRow | undefined) });
});

app.get('/api/policies', (req, res) => {
  const currentUser = ensurePermission(req, res, 'policies.view');
  if (!currentUser) return;
  const scopedOrgIds = getScopedOrgIds(currentUser.orgId);
  if (scopedOrgIds.length === 0) {
    res.json({ data: [] });
    return;
  }
  const rows = db
    .prepare(`SELECT * FROM policies WHERE org_id IN (${createInClausePlaceholder(scopedOrgIds)}) ORDER BY policy_no`)
    .all(...scopedOrgIds);
  res.json({ data: rows });
});

app.get('/api/policies/:policyNo/claims', (req, res) => {
  const currentUser = ensurePermission(req, res, 'policies.view');
  if (!currentUser) return;
  const { policyNo } = req.params;
  const policy = getPolicyByNo.get(policyNo) as any;
  if (!policy || !ensureDataScope(currentUser, policy.org_id)) {
    res.status(403).json({ error: '无权访问该保单数据' });
    return;
  }

  const scopedOrgIds = getScopedOrgIds(currentUser.orgId);
  const inClause = createInClausePlaceholder(scopedOrgIds);
  const assists = db
    .prepare(`SELECT * FROM claim_assists WHERE policy_no = ? AND org_id IN (${inClause}) ORDER BY updated_at DESC, assist_no DESC`)
    .all(policyNo, ...scopedOrgIds);
  const cases = db
    .prepare(`SELECT * FROM appraisal_cases WHERE policy_no = ? AND org_id IN (${inClause}) ORDER BY report_time DESC, case_no DESC`)
    .all(policyNo, ...scopedOrgIds);
  res.json({ data: { assists, cases } });
});

app.get('/api/claim-assists', (req, res) => {
  const currentUser = ensurePermission(req, res, 'claims.assist.view');
  if (!currentUser) return;
  const scopedOrgIds = getScopedOrgIds(currentUser.orgId);
  if (scopedOrgIds.length === 0) {
    res.json({ data: [] });
    return;
  }
  const rows = db
    .prepare(`SELECT * FROM claim_assists WHERE org_id IN (${createInClausePlaceholder(scopedOrgIds)}) ORDER BY updated_at DESC, assist_no DESC`)
    .all(...scopedOrgIds);
  res.json({ data: rows });
});

app.get('/api/appraisal-cases', (req, res) => {
  const currentUser = ensurePermission(req, res, ['claims.appraisal.view', 'claims.insurer.view', 'claims.assist.view']);
  if (!currentUser) return;
  const scopedOrgIds = getScopedOrgIds(currentUser.orgId);
  if (scopedOrgIds.length === 0) {
    res.json({ data: [] });
    return;
  }
  const rows = db
    .prepare(`SELECT * FROM appraisal_cases WHERE org_id IN (${createInClausePlaceholder(scopedOrgIds)}) ORDER BY report_time DESC, case_no DESC`)
    .all(...scopedOrgIds);
  res.json({ data: rows });
});

app.post('/api/claim-assists/save', (req, res) => {
  const body = req.body || {};
  const action = body.action === 'submit' ? 'submit' : 'draft';
  const currentUser = ensurePermission(req, res, action === 'submit' ? 'claims.assist.submit' : 'claims.assist.manage');
  if (!currentUser) return;

  const assistNo = body.assistNo || genAssistNo();
  const oldAssist = getAssistByNo.get(assistNo) as any;
  const policy = getPolicyByNo.get(body.policyNo) as any;

  if (!policy || !ensureDataScope(currentUser, policy.org_id)) {
    res.status(403).json({ error: '无权在该机构保单下创建或修改理赔协助' });
    return;
  }

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
    org_id: policy.org_id || currentUser.orgId,
  };

  const tx = db.transaction(() => {
    upsertAssistStmt.run(payload);
    insertLogStmt.run('claim_assist', assistNo, oldAssist?.status || null, toStatus, action, nowStr());

    if (action === 'submit' && relatedCaseNo) {
      upsertCaseStmt.run({
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
        org_id: policy.org_id || currentUser.orgId,
      });
    }
  });

  tx();

  const assist = getAssistByNo.get(assistNo);
  const relatedCase = relatedCaseNo ? getCaseByNo.get(relatedCaseNo) : null;
  res.json({ data: { assist, case: relatedCase } });
});

app.post('/api/appraisal-cases/:caseNo/open', (req, res) => {
  const { caseNo } = req.params;
  const stage = req.body?.stage === 'insurer' ? 'insurer' : 'appraisal';
  const currentUser = ensurePermission(req, res, stage === 'insurer' ? 'claims.insurer.review' : 'claims.appraisal.review');
  if (!currentUser) return;

  const current = getCaseByNo.get(caseNo) as any;
  if (!current) {
    res.status(404).json({ error: '案件不存在' });
    return;
  }

  if (!ensureDataScope(currentUser, current.org_id)) {
    res.status(403).json({ error: '无权操作该案件' });
    return;
  }

  const openableStatuses = stage === 'insurer' ? ['定损中'] : ['已提交', '待审核', '待理算'];
  if (!openableStatuses.includes(current.status)) {
    res.json({ data: { case: current, assist: current.assist_no ? getAssistByNo.get(current.assist_no) : null } });
    return;
  }

  const tx = db.transaction(() => {
    const nextStatus = stage === 'insurer' ? '审核中' : '公估中';
    upsertCaseStmt.run({ ...current, status: nextStatus });
    insertLogStmt.run('appraisal_case', caseNo, current.status, nextStatus, 'open', nowStr());

    const assist = (current.assist_no ? getAssistByNo.get(current.assist_no) : getAssistByCaseNo.get(caseNo)) as any;
    if (assist) {
      upsertAssistStmt.run({ ...assist, status: nextStatus, latest_review_comment: assist.latest_review_comment || '', updated_at: nowStr() });
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
  const currentUser = ensurePermission(req, res, stage === 'insurer' ? 'claims.insurer.review' : 'claims.appraisal.review');
  if (!currentUser) return;

  if (!['approve', 'reject'].includes(decision)) {
    res.status(400).json({ error: 'decision 必须为 approve 或 reject' });
    return;
  }

  const current = getCaseByNo.get(caseNo) as any;
  if (!current) {
    res.status(404).json({ error: '案件不存在' });
    return;
  }

  if (!ensureDataScope(currentUser, current.org_id)) {
    res.status(403).json({ error: '无权操作该案件' });
    return;
  }

  const nextStatus = stage === 'insurer'
    ? decision === 'approve' ? '定损协议通过' : '审核退回'
    : decision === 'approve' ? '定损中' : '已退回';

  const tx = db.transaction(() => {
    upsertCaseStmt.run({
      ...current,
      status: nextStatus,
      review_decision: decision,
      review_comment: comment,
      review_time: nowStr(),
    });
    insertLogStmt.run('appraisal_case', caseNo, current.status, nextStatus, 'review', nowStr());

    const assist = (current.assist_no ? getAssistByNo.get(current.assist_no) : getAssistByCaseNo.get(caseNo)) as any;
    if (assist) {
      upsertAssistStmt.run({ ...assist, status: nextStatus, latest_review_comment: comment, updated_at: nowStr() });
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

// ========== Inquiries APIs ==========
app.get('/api/inquiries', (req, res) => {
  console.log('[GET /api/inquiries] X-User-Id:', req.header('x-user-id'));
  const currentUser = ensurePermission(req, res, 'sales.inquiry.view');
  if (!currentUser) return;

  const scopedOrgIds = getScopedOrgIds(currentUser.orgId);
  if (scopedOrgIds.length === 0) {
    res.json({ data: [] });
    return;
  }

  const inClause = scopedOrgIds.map(() => '?').join(',');
  const rows = db
    .prepare(`SELECT * FROM inquiries WHERE org_id IN (${inClause}) ORDER BY updated_at DESC`)
    .all(...scopedOrgIds) as any[];

  res.json({
    data: rows.map((row) => ({
      ...row,
      formData: row.form_data_json ? JSON.parse(row.form_data_json) : null,
    })),
  });
});

app.get('/api/inquiries/:inquiryNo', (req, res) => {
  const currentUser = ensurePermission(req, res, 'sales.inquiry.view');
  if (!currentUser) return;

  const inquiry = db.prepare('SELECT * FROM inquiries WHERE inquiry_no = ?').get(req.params.inquiryNo) as any;

  if (!inquiry || !ensureDataScope(currentUser, inquiry.org_id)) {
    res.status(404).json({ error: '询价单不存在或无权访问' });
    return;
  }

  res.json({
    data: {
      ...inquiry,
      formData: inquiry.form_data_json ? JSON.parse(inquiry.form_data_json) : null,
    },
  });
});

app.post('/api/inquiries/save', (req, res) => {
  const xUserId = req.header('x-user-id');
  const body = req.body || {};
  console.log('[POST /api/inquiries/save] X-User-Id:', xUserId, 'inquiryNo:', body.inquiryNo);
  
  const currentUser = ensurePermission(req, res, 'sales.inquiry.manage');
  if (!currentUser) {
    console.log('[POST /api/inquiries/save] Permission denied for user:', xUserId);
    return;
  }

  console.log('[POST /api/inquiries/save] User authenticated:', currentUser.userId);

  const body = req.body || {};
  const inquiryNo = body.inquiryNo || `INQ-${Date.now()}`;
  const existing = db.prepare('SELECT * FROM inquiries WHERE inquiry_no = ?').get(inquiryNo) as any;

  if (existing && !ensureDataScope(currentUser, existing.org_id)) {
    res.status(403).json({ error: '无权修改该询价单' });
    return;
  }

  const payload = {
    inquiry_no: inquiryNo,
    customer_name: body.customerName || '',
    customer_code: body.customerCode || '',
    org_id: existing?.org_id || currentUser.orgId,
    status: existing?.status || 'draft',
    form_data_json: JSON.stringify(body.formData || {}),
    created_at: existing?.created_at || nowStr(),
    updated_at: nowStr(),
    submitted_at: existing?.submitted_at || null,
  };

  db.prepare(
    `INSERT OR REPLACE INTO inquiries 
    (inquiry_no, customer_name, customer_code, org_id, status, form_data_json, created_at, updated_at, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    payload.inquiry_no,
    payload.customer_name,
    payload.customer_code,
    payload.org_id,
    payload.status,
    payload.form_data_json,
    payload.created_at,
    payload.updated_at,
    payload.submitted_at
  );

  res.json({
    data: {
      ...payload,
      formData: body.formData || {},
    },
  });
});

app.post('/api/inquiries/:inquiryNo/submit', (req, res) => {
  const currentUser = ensurePermission(req, res, 'sales.inquiry.manage');
  if (!currentUser) return;

  const inquiry = db.prepare('SELECT * FROM inquiries WHERE inquiry_no = ?').get(req.params.inquiryNo) as any;

  if (!inquiry || !ensureDataScope(currentUser, inquiry.org_id)) {
    res.status(404).json({ error: '询价单不存在或无权访问' });
    return;
  }

  db.prepare(
    `UPDATE inquiries SET status = ?, submitted_at = ?, updated_at = ? WHERE inquiry_no = ?`
  ).run('submitted', nowStr(), nowStr(), req.params.inquiryNo);

  res.json({
    data: db.prepare('SELECT * FROM inquiries WHERE inquiry_no = ?').get(req.params.inquiryNo),
  });
});

app.get('/api/status-logs', (req, res) => {
  const currentUser = ensurePermission(req, res, ['claims.assist.view', 'claims.appraisal.view', 'claims.insurer.view']);
  if (!currentUser) return;
  const rows = db.prepare('SELECT * FROM status_logs ORDER BY id DESC LIMIT 200').all();
  res.json({ data: rows });
});

app.listen(port, () => {
  console.log(`[claims-api] running at http://localhost:${port}`);
});