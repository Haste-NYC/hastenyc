#!/bin/bash
# Setup script for hastenyc/geneva worktrees
# Symlinks .env.local from ~/.config/haste-keys/ so credentials persist across worktrees

CANONICAL_ENV="$HOME/.config/haste-keys/.env.local"

if [ ! -f "$CANONICAL_ENV" ]; then
  echo "ERROR: .env.local not found at $CANONICAL_ENV"
  echo "Copy a configured .env.local there first."
  exit 1
fi

if [ -L ".env.local" ]; then
  echo ".env.local is already a symlink -> $(readlink .env.local)"
elif [ -f ".env.local" ]; then
  echo "WARNING: .env.local already exists as a regular file."
  echo "Backing up to .env.local.bak and replacing with symlink."
  mv .env.local .env.local.bak
  ln -s "$CANONICAL_ENV" .env.local
  echo "Done. Symlinked .env.local -> $CANONICAL_ENV"
else
  ln -s "$CANONICAL_ENV" .env.local
  echo "Done. Symlinked .env.local -> $CANONICAL_ENV"
fi
