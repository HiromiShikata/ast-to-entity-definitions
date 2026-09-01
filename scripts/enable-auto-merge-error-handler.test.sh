#!/usr/bin/env bash
set -uo pipefail
SCRIPT="$(dirname "$0")/enable-auto-merge-error-handler.sh"
FAIL=0

run_test() {
  local desc="$1" input="$2" expected_exit="$3" expected_out="$4"
  local actual_out actual_exit
  actual_exit=0
  actual_out=$(echo "$input" | bash "$SCRIPT" 2>&1) || actual_exit=$?
  if [ "$actual_exit" -eq "$expected_exit" ] && echo "$actual_out" | grep -qF "$expected_out"; then
    echo "PASS: $desc"
  else
    echo "FAIL: $desc"
    echo "  expected exit=$expected_exit, got=$actual_exit"
    echo "  expected output to contain: $expected_out"
    echo "  actual output: $actual_out"
    FAIL=$((FAIL + 1))
  fi
}

run_test "no errors payload returns exit 0" \
  '{"data":{"enablePullRequestAutoMerge":{"clientMutationId":null}}}' \
  0 "Auto merge enabled successfully"

run_test "RATE_LIMIT type returns exit 0 with warning" \
  '{"errors":[{"type":"RATE_LIMIT","message":"API rate limit exceeded"}]}' \
  0 "Warning: could not enable auto merge"

run_test "unstable message returns exit 0 with warning" \
  '{"errors":[{"type":"UNPROCESSABLE","message":"Branch protection requires unstable checks to pass"}]}' \
  0 "Warning: could not enable auto merge"

run_test "unknown error returns exit 1" \
  '{"errors":[{"type":"FORBIDDEN","message":"Resource not accessible by integration"}]}' \
  1 "Failed to enable auto merge"

echo "Results: $((4 - FAIL)) passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
