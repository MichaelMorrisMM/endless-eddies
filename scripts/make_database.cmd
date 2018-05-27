copy database.sql %ENDLESS_EDDIES_CONFIG_DIR%
cd %ENDLESS_EDDIES_CONFIG_DIR%
sqlite3 endless_eddies.db < database.sql
del database.sql
