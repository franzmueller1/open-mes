# 🏭 Mini MES System für Startups

Ein leichtgewichtiges, cloud-basiertes Manufacturing Execution System (MES) für Startups und kleine Fertigungsunternehmen. Ziel ist es, ein modular aufgebautes System bereitzustellen, das schnell einsatzbereit ist, Kernfunktionen eines MES bietet und auf modernen Cloud-Technologien basiert.

---

## 🎯 Projektziel

Dieses Projekt entstand aus meiner beruflichen Umorientierung von der Chemie/Materialwissenschaft hin zur IT. Es verbindet meine Erfahrungen aus der Produktion mit dem Wissen aus Kursen wie **CS50x**, **CS50 SQL** und dem **AWS Certified Solutions Architect – Associate**.

Ziel: Ein MES entwickeln, das einfach zu bedienen, cloud-fähig und auf reale Produktionsanforderungen zugeschnitten ist.

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
