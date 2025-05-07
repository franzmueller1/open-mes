# 🏭 Mini MES System für Startups

Ein leichtgewichtiges, cloud-basiertes Manufacturing Execution System (MES) für Startups und kleine Fertigungsunternehmen. Ziel ist es, ein modular aufgebautes System bereitzustellen, das schnell einsatzbereit ist, Kernfunktionen eines MES bietet und auf modernen Cloud-Technologien basiert.

---

## 🎯 Projektziel

Ziel dieses Projekts ist es, meine erlernten Fähigkeiten aus den Bereichen SQL, Cloud-Computing und Softwarearchitektur in einem praxisnahen und relevanten Anwendungsfall umzusetzen. Dabei steht die Entwicklung eines leichtgewichtigen MES-Systems im Vordergrund, das sich speziell an die Bedürfnisse von Startups und kleinen Fertigungsunternehmen richtet.

---

## ⚙️ Funktionsumfang

- **Mitarbeiterverwaltung**  
- **Produktionsauftrags-Tracking**
- **Materialverbrauchsprotokollierung**
- **Qualitätskontrollen & Fehlerberichte**
- **Wartungsplanung für Maschinen**
- **Cloud-fähige Architektur (AWS RDS, EC2, S3)**

---

## 🧱 Technologien

| Bereich        | Technologie           |
|----------------|------------------------|
| Backend        | Python + FastAPI       |
| Datenbank      | PostgreSQL             |
| Cloud          | AWS RDS, EC2, S3       |
| Entwicklung    | Docker, Git            |
| Monitoring     | AWS CloudWatch         |

---

## 🗃️ Datenmodell

Das System basiert auf einem relationalen Datenbankmodell mit Fokus auf Datenintegrität und Erweiterbarkeit.

### ER-Diagramm
> *(Wird unter `docs/er-diagram.png` abgelegt)*

### Datenbankschema
SQL-Datei: [`docs/database-schema.sql`](docs/database-schema.sql)

---

## 🚀 Infrastruktur & Deployment

Geplant ist ein Deployment mit:

- **PostgreSQL** auf AWS RDS
- **FastAPI** auf AWS EC2 oder Lambda
- **Datei-Uploads / Logs** über AWS S3

---

## 📁 Projektstruktur

```bash
mes-startup/
├── backend/                 # Backend-Code (FastAPI)
├── database/                # SQL-Datenmodell
├── docs/                    # Dokumentation & Diagramme
├── infrastructure/          # AWS-Setups (z.B. CloudFormation, Terraform)
└── README.md                # Projektübersicht
