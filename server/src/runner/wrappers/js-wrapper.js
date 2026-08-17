import vm from 'vm';

class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function listToLinkedList(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return null;
  const dummy = new ListNode(0);
  let curr = dummy;
  for (const x of arr) {
    curr.next = new ListNode(x);
    curr = curr.next;
  }
  return dummy.next;
}

function linkedListToList(head) {
  if (!head) return [];
  const res = [];
  let curr = head;
  const visited = new Set();
  while (curr && curr instanceof ListNode) {
    if (visited.has(curr)) break;
    visited.add(curr);
    res.push(curr.val);
    curr = curr.next;
  }
  return res;
}

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function listToTree(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();
    if (!node) continue;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    } else {
      node.left = null;
    }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    } else {
      node.right = null;
    }
    i++;
  }
  return root;
}

function treeToList(root) {
  if (!root) return [];
  const res = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node) {
      res.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      res.push(null);
    }
  }
  while (res.length > 0 && res[res.length - 1] === null) {
    res.pop();
  }
  return res;
}

function normalize(val) {
  if (val instanceof ListNode) return linkedListToList(val);
  if (val instanceof TreeNode) return treeToList(val);
  if (val instanceof Set || val instanceof Map) return Array.from(val).map(normalize);
  if (Array.isArray(val)) return val.map(normalize);
  if (typeof val === 'object' && val !== null) {
    const res = {};
    for (const [k, v] of Object.entries(val)) {
      res[k] = normalize(v);
    }
    return res;
  }
  return val;
}

function deepCompare(actual, expected) {
  const normA = normalize(actual);
  const normE = normalize(expected);

  if (JSON.stringify(normA) === JSON.stringify(normE)) return true;

  if (normA === null && Array.isArray(normE) && normE.length === 0) return true;
  if (Array.isArray(normA) && normA.length === 0 && normE === null) return true;

  // Handle number float tolerance
  if (typeof normA === 'number' && typeof normE === 'number') {
    return Math.abs(normA - normE) < 1e-5;
  }

  // Handle order-agnostic list of arrays (e.g. 3Sum, Subsets, Group Anagrams)
  if (Array.isArray(normA) && Array.isArray(normE)) {
    if (normA.length !== normE.length) return false;
    try {
      const sortHelper = (arr) => {
        return [...arr].map(item => Array.isArray(item) ? [...item].sort() : item).sort((a, b) => {
          return JSON.stringify(a).localeCompare(JSON.stringify(b));
        });
      };
      const sortedA = sortHelper(normA);
      const sortedE = sortHelper(normE);
      if (JSON.stringify(sortedA) === JSON.stringify(sortedE)) return true;
    } catch (e) {}

    return normA.every((v, i) => deepCompare(v, normE[i]));
  }

  return normA === normE;
}

function convertArgForTreeOrList(key, val) {
  const k = (key || '').toLowerCase();
  if ((k.includes('head') || k.includes('list')) && Array.isArray(val)) {
    return listToLinkedList(val);
  }
  if ((k.includes('root') || k.includes('tree') || key === 'p' || key === 'q') && Array.isArray(val)) {
    return listToTree(val);
  }
  return val;
}

async function run() {
  let rawData = '';
  process.stdin.setEncoding('utf-8');
  for await (const chunk of process.stdin) {
    rawData += chunk;
  }

  let payload;
  try {
    payload = JSON.parse(rawData);
  } catch (err) {
    console.log(JSON.stringify({ error: `Invalid JSON payload: ${err.message}` }));
    return;
  }

  const { code, test_cases = [], entry_point = '' } = payload;

  let stdoutLogs = [];
  const sandbox = {
    ListNode,
    TreeNode,
    listToLinkedList,
    linkedListToList,
    listToTree,
    treeToList,
    console: {
      log: (...args) => stdoutLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      error: (...args) => stdoutLogs.push('[stderr] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      warn: (...args) => stdoutLogs.push('[warn] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    },
    Math,
    Number,
    String,
    Array,
    Object,
    Set,
    Map,
    parseInt,
    parseFloat,
    isNaN,
    isFinite
  };

  const context = vm.createContext(sandbox);

  // Wrap user code to inspect declared functions
  const wrappedCode = `
    ${code}
    ;(() => {
      if (typeof Solution === 'function') {
        const sol = new Solution();
        const protoProps = Object.getOwnPropertyNames(Object.getPrototypeOf(sol));
        const fnProp = protoProps.find(p => p !== 'constructor' && typeof sol[p] === 'function');
        if (fnProp) return sol[fnProp].bind(sol);
      }
      if ('${entry_point}' && typeof globalThis['${entry_point}'] === 'function') {
        return globalThis['${entry_point}'];
      }
      for (const k of Object.keys(globalThis)) {
        if (typeof globalThis[k] === 'function' && !['ListNode', 'TreeNode', 'listToLinkedList', 'linkedListToList', 'listToTree', 'treeToList', 'parseInt', 'parseFloat', 'isNaN', 'isFinite'].includes(k)) {
          return globalThis[k];
        }
      }
      return null;
    })()
  `;

  let targetFunc;
  try {
    const script = new vm.Script(wrappedCode);
    targetFunc = script.runInContext(context, { timeout: 3000 });
  } catch (err) {
    console.log(JSON.stringify({
      error: 'Syntax/Compilation Error',
      message: err.message,
      traceback: err.stack,
      results: []
    }));
    return;
  }

  if (!targetFunc || typeof targetFunc !== 'function') {
    console.log(JSON.stringify({
      error: 'Entry Point Error',
      message: 'No runnable function found in JavaScript code.',
      results: []
    }));
    return;
  }

  const results = [];

  for (let idx = 0; idx < test_cases.length; idx++) {
    const tc = test_cases[idx];
    const rawInput = tc.input;
    const expectedOutput = tc.expected_output;
    const isHidden = !!tc.hidden;

    stdoutLogs = [];
    let args = [];

    if (Array.isArray(rawInput)) {
      args = rawInput.map(a => convertArgForTreeOrList('arg', a));
    } else if (typeof rawInput === 'object' && rawInput !== null) {
      let matchedByParams = false;
      try {
        const fnStr = targetFunc.toString();
        const match = fnStr.match(/\(([^)]*)\)/);
        if (match && match[1].trim()) {
          const params = match[1].split(',').map(s => s.trim().replace(/^[\.\s]+/, '')).filter(Boolean);
          if (params.length > 0 && params.every(p => p in rawInput)) {
            args = params.map(p => convertArgForTreeOrList(p, rawInput[p]));
            matchedByParams = true;
          }
        }
      } catch (e) {}

      if (!matchedByParams) {
        args = Object.entries(rawInput).map(([k, v]) => convertArgForTreeOrList(k, v));
      }
    } else {
      args = [convertArgForTreeOrList('arg', rawInput)];
    }

    let actualOutput;
    let passed = false;
    let errorMsg = null;
    let stackTrace = null;
    const startTime = performance.now();

    try {
      actualOutput = targetFunc(...args);
      const endTime = performance.now();
      const elapsedMs = endTime - startTime;

      // Handle in-place mutation
      if (actualOutput === undefined && args.length > 0 && Array.isArray(args[0])) {
        if (deepCompare(args[0], expectedOutput)) {
          actualOutput = args[0];
          passed = true;
        } else {
          passed = false;
        }
      } else {
        passed = deepCompare(actualOutput, expectedOutput);
      }

      results.push({
        test_case_index: idx,
        passed,
        runtime_ms: Number(elapsedMs.toFixed(2)),
        stdout: stdoutLogs.join('\n').slice(0, 2000),
        hidden: isHidden,
        ...(!isHidden && {
          input: rawInput,
          expected_output: expectedOutput,
          actual_output: normalize(actualOutput)
        })
      });
    } catch (err) {
      const endTime = performance.now();
      const elapsedMs = endTime - startTime;
      results.push({
        test_case_index: idx,
        passed: false,
        runtime_ms: Number(elapsedMs.toFixed(2)),
        stdout: stdoutLogs.join('\n').slice(0, 2000),
        error: err.message,
        traceback: err.stack,
        hidden: isHidden,
        ...(!isHidden && {
          input: rawInput,
          expected_output: expectedOutput
        })
      });
    }
  }

  console.log(JSON.stringify({
    success: true,
    results
  }));
}

run().catch(err => {
  console.log(JSON.stringify({ error: err.message }));
});
