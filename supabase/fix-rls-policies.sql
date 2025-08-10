-- ============================================
-- FIX: RLS Policies für neue Benutzer
-- ============================================
-- Dieses Script behebt das Problem, dass neue Benutzer keine Änderungen machen können

-- Option 1: SCHNELLE LÖSUNG - RLS temporär deaktivieren
-- (Nicht für Produktion empfohlen, aber gut zum Testen)

ALTER TABLE machines DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE productions DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checks DISABLE ROW LEVEL SECURITY;

-- Nach dem Testen können Sie RLS wieder aktivieren mit:
-- ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
-- etc...