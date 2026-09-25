#!/usr/bin/env bash
# Sao lưu database + ảnh upload của GreenLand, giữ 14 bản gần nhất.
# Chạy tay:  bash deploy/backup.sh
# Tự động mỗi đêm 2h:  (crontab -e)  0 2 * * * bash /opt/greenland/deploy/backup.sh
set -euo pipefail
DATA_DIR="${DATA_DIR:-/var/lib/greenland}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/greenland}"
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
TMP="$(mktemp -d)"
if command -v sqlite3 >/dev/null; then
  sqlite3 "$DATA_DIR/database.sqlite" ".backup '$TMP/database.sqlite'"   # an toàn khi web đang chạy
else
  cp "$DATA_DIR/database.sqlite" "$TMP/database.sqlite"
fi
cp -r "$DATA_DIR/uploads" "$TMP/uploads" 2>/dev/null || mkdir -p "$TMP/uploads"
tar -czf "$BACKUP_DIR/greenland-$STAMP.tar.gz" -C "$TMP" .
rm -rf "$TMP"
ls -1t "$BACKUP_DIR"/greenland-*.tar.gz | tail -n +15 | xargs -r rm --
echo "Đã sao lưu: $BACKUP_DIR/greenland-$STAMP.tar.gz"
