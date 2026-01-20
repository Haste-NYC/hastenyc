#!/usr/bin/env bash
# Ralph - Autonomous Agent Loop for Claude Code
# Adapted from github.com/snarktank/ralph for Claude Code-only usage
#
# Usage: ./ralph.sh [max_iterations]
# Example: ./ralph.sh 10
#
# Ralph repeatedly spawns fresh Claude Code instances to implement user stories
# from a prd.json until all tasks are complete or max iterations reached.

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAX_ITERATIONS="${1:-10}"
ARCHIVE_DIR="$SCRIPT_DIR/.ralph/archive"
LAST_BRANCH_FILE="$SCRIPT_DIR/.ralph/.last-branch"
PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"
INSTRUCTIONS_FILE="$SCRIPT_DIR/RALPH_INSTRUCTIONS.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[RALPH]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[RALPH]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[RALPH]${NC} $1"
}

log_error() {
    echo -e "${RED}[RALPH]${NC} $1"
}

# Ensure .ralph directory exists
mkdir -p "$SCRIPT_DIR/.ralph"
mkdir -p "$ARCHIVE_DIR"

# Check for required files
if [[ ! -f "$PRD_FILE" ]]; then
    log_error "prd.json not found. Create one first or use the /prd and /ralph skills."
    log_info "Example: Run 'claude' and use '/prd' to generate a PRD, then '/ralph' to convert to prd.json"
    exit 1
fi

if [[ ! -f "$INSTRUCTIONS_FILE" ]]; then
    log_error "RALPH_INSTRUCTIONS.md not found."
    exit 1
fi

# Initialize progress.txt if it doesn't exist
if [[ ! -f "$PROGRESS_FILE" ]]; then
    cat > "$PROGRESS_FILE" << 'EOF'
# Progress Log

## Codebase Patterns
<!-- Consolidated patterns discovered during implementation. Check this first each iteration. -->

---

## Iteration History
<!-- Append-only log of each iteration's learnings -->

EOF
    log_info "Created progress.txt"
fi

# Archive management: check if branch changed
archive_if_branch_changed() {
    local current_branch
    current_branch=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")

    if [[ -z "$current_branch" ]]; then
        log_warning "No branchName in prd.json, skipping archive check"
        return
    fi

    if [[ -f "$LAST_BRANCH_FILE" ]]; then
        local last_branch
        last_branch=$(cat "$LAST_BRANCH_FILE")

        if [[ "$current_branch" != "$last_branch" ]]; then
            local archive_name
            archive_name="$(date +%Y-%m-%d)-${last_branch//\//-}"
            local archive_path="$ARCHIVE_DIR/$archive_name"

            mkdir -p "$archive_path"

            # Archive previous files if they exist
            [[ -f "$PRD_FILE" ]] && cp "$PRD_FILE" "$archive_path/prd.json"
            [[ -f "$PROGRESS_FILE" ]] && cp "$PROGRESS_FILE" "$archive_path/progress.txt"

            log_info "Archived previous branch '$last_branch' to $archive_path"
        fi
    fi

    echo "$current_branch" > "$LAST_BRANCH_FILE"
}

# Run archive check
archive_if_branch_changed

# Main loop
log_info "Starting Ralph loop with max $MAX_ITERATIONS iterations"
log_info "Using Claude Code as the agent"

for ((i=1; i<=MAX_ITERATIONS; i++)); do
    log_info "=== Iteration $i of $MAX_ITERATIONS ==="

    # Check if all stories are complete before running
    incomplete_count=$(jq '[.userStories[] | select(.passes != true)] | length' "$PRD_FILE" 2>/dev/null || echo "0")

    if [[ "$incomplete_count" == "0" ]]; then
        log_success "All stories already complete!"
        exit 0
    fi

    log_info "$incomplete_count stories remaining"

    # Run Claude Code with instructions piped via stdin
    # Using --dangerously-skip-permissions for autonomous operation
    # Using --print to capture output for completion detection
    output_file=$(mktemp)

    if claude --dangerously-skip-permissions --print < "$INSTRUCTIONS_FILE" > "$output_file" 2>&1; then
        log_success "Iteration $i completed"
    else
        log_warning "Iteration $i exited with non-zero status"
    fi

    # Check for completion signal
    if grep -q '<promise>COMPLETE</promise>' "$output_file"; then
        log_success "All stories complete! Ralph loop finished successfully."
        rm -f "$output_file"
        exit 0
    fi

    rm -f "$output_file"

    # Brief pause between iterations
    if [[ $i -lt $MAX_ITERATIONS ]]; then
        log_info "Pausing before next iteration..."
        sleep 2
    fi
done

log_warning "Reached maximum iterations ($MAX_ITERATIONS) without completing all stories"
log_info "Check prd.json and progress.txt for status"
exit 1
