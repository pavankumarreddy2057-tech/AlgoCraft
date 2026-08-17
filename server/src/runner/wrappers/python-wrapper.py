import sys
import json
import time
import traceback
import io
from typing import List, Dict, Any, Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def list_to_linked_list(arr):
    if not arr or not isinstance(arr, list):
        return None
    dummy = ListNode(0)
    curr = dummy
    for x in arr:
        curr.next = ListNode(x)
        curr = curr.next
    return dummy.next

def linked_list_to_list(head):
    if not head:
        return []
    res = []
    curr = head
    visited = set()
    while curr and isinstance(curr, ListNode):
        if id(curr) in visited:
            break
        visited.add(id(curr))
        res.append(curr.val)
        curr = curr.next
    return res

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def list_to_tree(arr):
    if not arr or not isinstance(arr, list) or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if node is None:
            continue
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        else:
            node.left = None
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        else:
            node.right = None
        i += 1
    return root

def tree_to_list(root):
    if not root:
        return []
    res = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node:
            res.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            res.append(None)
    while res and res[-1] is None:
        res.pop()
    return res

def normalize(val):
    if isinstance(val, ListNode):
        return linked_list_to_list(val)
    if isinstance(val, TreeNode):
        return tree_to_list(val)
    if isinstance(val, (set, tuple)):
        return [normalize(x) for x in val]
    if isinstance(val, list):
        return [normalize(x) for x in val]
    if isinstance(val, dict):
        return {k: normalize(v) for k, v in val.items()}
    return val

def deep_compare(actual, expected):
    norm_a = normalize(actual)
    norm_e = normalize(expected)

    if norm_a == norm_e:
        return True

    # Empty linked list vs empty array equivalence
    if norm_a is None and norm_e == []:
        return True
    if norm_a == [] and norm_e is None:
        return True

    # Check order-agnostic list of lists / sets (e.g. 3Sum, Subsets, Group Anagrams)
    if isinstance(norm_a, list) and isinstance(norm_e, list):
        if len(norm_a) != len(norm_e):
            return False
        # Try sorted comparison if elements are sortable
        try:
            sorted_a = sorted([sorted(x) if isinstance(x, list) else x for x in norm_a])
            sorted_e = sorted([sorted(x) if isinstance(x, list) else x for x in norm_e])
            if sorted_a == sorted_e:
                return True
        except Exception:
            pass

    # Float comparison
    if isinstance(norm_a, (int, float)) and isinstance(norm_e, (int, float)):
        return abs(norm_a - norm_e) < 1e-5

    return False

def convert_arg_for_tree_or_list(param_name, arg_val):
    name_lower = param_name.lower()
    if ('head' in name_lower or 'list' in name_lower) and isinstance(arg_val, list):
        return list_to_linked_list(arg_val)
    if ('root' in name_lower or 'tree' in name_lower or param_name in ['p', 'q']) and isinstance(arg_val, list):
        return list_to_tree(arg_val)
    return arg_val

def main():
    try:
        raw_payload = sys.stdin.read()
        payload = json.loads(raw_payload)
    except Exception as e:
        print(json.dumps({"error": f"Failed to parse runner payload: {str(e)}"}))
        return

    user_code = payload.get("code", "")
    test_cases = payload.get("test_cases", [])
    entry_point = payload.get("entry_point", "")

    user_globals = {
        "ListNode": ListNode,
        "TreeNode": TreeNode,
        "list_to_linked_list": list_to_linked_list,
        "linked_list_to_list": linked_list_to_list,
        "list_to_tree": list_to_tree,
        "tree_to_list": tree_to_list,
        "List": List,
        "Dict": Dict,
        "Any": Any,
        "Optional": Optional,
        "__builtins__": __builtins__
    }

    try:
        exec(user_code, user_globals)
    except Exception as e:
        tb = traceback.format_exc()
        print(json.dumps({
            "error": "Syntax/Compile Error",
            "message": str(e),
            "traceback": tb,
            "results": []
        }))
        return

    target_func = None
    if "Solution" in user_globals and isinstance(user_globals["Solution"], type):
        solution_instance = user_globals["Solution"]()
        methods = [m for m in dir(solution_instance) if not m.startswith("_") and callable(getattr(solution_instance, m))]
        if entry_point and hasattr(solution_instance, entry_point):
            target_func = getattr(solution_instance, entry_point)
        elif methods:
            target_func = getattr(solution_instance, methods[0])
    elif entry_point and entry_point in user_globals and callable(user_globals[entry_point]):
        target_func = user_globals[entry_point]
    else:
        for name, val in user_globals.items():
            if callable(val) and not name.startswith("_") and name not in [
                "ListNode", "TreeNode", "list_to_linked_list", "linked_list_to_list", "list_to_tree", "tree_to_list"
            ]:
                target_func = val
                break

    if not target_func:
        print(json.dumps({
            "error": "Entry Point Error",
            "message": "No valid function or Solution class method found in code.",
            "results": []
        }))
        return

    results = []
    for idx, tc in enumerate(test_cases):
        raw_input = tc.get("input")
        expected_output = tc.get("expected_output")
        is_hidden = tc.get("hidden", False)

        args = []
        kwargs = {}
        if isinstance(raw_input, dict):
            # Process trees & lists in kwargs
            for k, v in raw_input.items():
                kwargs[k] = convert_arg_for_tree_or_list(k, v)
        elif isinstance(raw_input, list):
            args = [convert_arg_for_tree_or_list("arg", a) for a in raw_input]
        else:
            args = [convert_arg_for_tree_or_list("arg", raw_input)]

        stdout_buf = io.StringIO()
        stderr_buf = io.StringIO()
        old_stdout = sys.stdout
        old_stderr = sys.stderr

        start_time = time.perf_counter()
        passed = False
        actual_output = None
        error_msg = None
        tb_str = None

        try:
            sys.stdout = stdout_buf
            sys.stderr = stderr_buf
            if kwargs:
                actual_output = target_func(**kwargs)
            else:
                actual_output = target_func(*args)
            end_time = time.perf_counter()
            elapsed_ms = (end_time - start_time) * 1000.0

            # Special in-place modification check
            if actual_output is None and len(args) > 0 and isinstance(args[0], list):
                if deep_compare(args[0], expected_output):
                    actual_output = args[0]
                    passed = True
                else:
                    passed = False
            elif actual_output is None and kwargs and any(isinstance(v, list) for v in kwargs.values()):
                first_list_val = next(v for v in kwargs.values() if isinstance(v, list))
                if deep_compare(first_list_val, expected_output):
                    actual_output = first_list_val
                    passed = True
                else:
                    passed = False
            else:
                passed = deep_compare(actual_output, expected_output)

        except Exception as e:
            end_time = time.perf_counter()
            elapsed_ms = (end_time - start_time) * 1000.0
            error_msg = str(e)
            tb_str = traceback.format_exc()
        finally:
            sys.stdout = old_stdout
            sys.stderr = old_stderr

        user_stdout = stdout_buf.getvalue()
        user_stderr = stderr_buf.getvalue()

        result_item = {
            "test_case_index": idx,
            "passed": passed,
            "runtime_ms": round(elapsed_ms, 2),
            "stdout": user_stdout[:2000] if user_stdout else "",
            "stderr": user_stderr[:2000] if user_stderr else "",
            "hidden": is_hidden
        }

        if not is_hidden:
            result_item["input"] = raw_input
            result_item["expected_output"] = expected_output
            result_item["actual_output"] = normalize(actual_output)

        if error_msg:
            result_item["error"] = error_msg
            result_item["traceback"] = tb_str

        results.append(result_item)

    print(json.dumps({
        "success": True,
        "results": results
    }))

if __name__ == "__main__":
    main()
