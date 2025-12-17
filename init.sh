#!/usr/bin/env bash
set -euo pipefail
trap 'on_error $? $LINENO' ERR

on_error() {
  local exit_code=$1
  local line_no=$2
  err "Script failed at line $line_no with exit code $exit_code"
  exit "$exit_code"
}

# Utilities
step() { echo -e "\n==> $1"; }
info() { echo "[INFO] $1"; }
success() { echo "[✓] $1"; }
warn() { echo "[WARN] $1"; }
err()  { echo "[ERR ] $1" >&2; }
run() {
  local description="$1"
  shift
  info "$description"
  if ! "$@"; then
    err "Failed: $description"
    exit 1
  fi
}
spinner() {
  local pid=$1
  local spin='|/-\'
  local i=0
  while kill -0 "$pid" 2>/dev/null; do
    i=$(( (i + 1) % 4 ))
    printf "\r[%c] Working..." "${spin:$i:1}"
    sleep 0.1
  done
  printf "\r"
}

# Verify Existence of fixtures folder
step "1) Verifying existence of the 'fixtures' folder"
FIXTURES_FOLDER="./fixtures"

if [[ -d "$FIXTURES_FOLDER" ]]; then
    info "The folder already exists. Skipping to next step."
else
    err "The folder does not exist. Creating the directory..."
    mkdir -p fixtures
    success "Folder created successfully."
fi

# Creation of basic files
step "2) Creating fixture files"

touch "$FIXTURES_FOLDER/affected_loads.json" 
echo "[]" > "$FIXTURES_FOLDER/affected_loads.json"
touch "$FIXTURES_FOLDER/eligible_shipments.json" 
echo "[]" > "$FIXTURES_FOLDER/eligible_shipments.json"
touch "$FIXTURES_FOLDER/wrong_rate_trips.json" 
echo "[]" > "$FIXTURES_FOLDER/wrong_rate_trips.json"

success "Fixture files created successfully."

# Install dependencies
step "3) Installing node dependencies"
run "Please wait ..." npm ci --no-audit --no-fund
success "Dependencies installed"

# Find eligible loads
step "4) Finding eligible shipments"

run "Attempting to find pending shipments" npm run sc:find-shipments
if jq -e '. | length == 0' "$FIXTURES_FOLDER/eligible_shipments.json" > /dev/null; then
  info "No eligible shipments found. Exiting process"
  exit 0
else
  success "Shipments found and logged in 'eligible_shipments.json'"
fi

# Run Cypress script
step "5) Running Cypress Script"
run "Starting UI interaction" npm run cy:assign-loads

# Revalidate trip rates
step "6) Revalidating trip rates"
run "Revalidating rates" npm run sc:rate-revalidation

if jq -e '. | length == 0' "$FIXTURES_FOLDER/wrong_rate_trips.json" > /dev/null; then
  step "7) All Trips have the right rate. Sending confirmation emails..."
  run "Sending ..." npm run cy:send-emails

else
  err "At least one trip has a wrong rate. Reassigning affected loads..."

fi 

# Send Rate Confirmation Emails
#step "7) Send Rate Confirmation Emails"
#run "Sending ..." npm run cy:send-emails & spinner $!
