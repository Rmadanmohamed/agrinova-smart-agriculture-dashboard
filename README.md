# AgriNova Smart Agriculture Dashboard

## Overview

A smart-agriculture dashboard workspace combining a Next.js dashboard, API routes, Power BI assets, and Power BI-ready CSV data.

- Live demo: https://agri-nova-ai-dashboard.vercel.app
- Main portfolio: https://ramadan-ai-portfolio.vercel.app

## Problem Statement

Agriculture operations benefit from a unified view of farm monitoring, crop health, sensor readings, drone and robot missions, price-related data, alerts, reports, and sustainability indicators.

## Implemented in This Repository

- Next.js dashboard pages and API routes
- Power BI dashboard assets and build documentation
- Agriculture demonstration datasets stored as CSV files
- Dashboard modules for farm monitoring, crop health, IoT network, robotics and drones, price prediction, alerts, and sustainability
- Dashboard calculations and demonstration recommendation logic

**Data and integration status:** The repository includes local demonstration CSV data. Its current documentation does not establish live farm-sensor connectivity, live UAV/robot control, or a production-connected blockchain workflow. Dashboard modules should therefore be understood as application/demo components unless a specific integration is independently verified.

## Technology

- Next.js, React, TypeScript
- Tailwind CSS, Recharts
- Power BI
- CSV-based demonstration data

## Data

The repository includes demonstration tables such as Sensors.csv, SoilReadings.csv, CropHealthScans.csv, DroneMissions.csv, RobotMissions.csv, BlockchainTransactions.csv, and PricePredictions.csv. Their presence alone does not establish live device telemetry.

## Models and Evaluation

This repository is primarily a dashboard/application project. The documented recommendation logic is dashboard-side demonstration logic. No independently reproducible ML benchmark or model-inference metric is claimed here.

## Project Structure

- app/ — dashboard pages and API routes
- components/ — dashboard and UI components
- Dashboard/ — Power BI assets, DAX, documentation, and build materials
- data/ — demonstration CSV tables
- powerbi-semantic-model/ — semantic model definition
- public/ — static assets

## Run Locally

    npm install
    npm run dev

Before deployment, validate the production build and confirm the required dashboard routes and API endpoints.

## Research & Publication

This repository is associated with the broader AgriNova smart-agriculture research project. The peer-reviewed publication is:

**Attiya, I., Badr, M., Bedeir, A., Mohamed, R., Mohamed, N., Saad, M., Tharwat, M., & Abdelgawad, N. (2026).** *An edge-cloud AI-robotics framework with blockchain-based validation for crop yield prediction and plant health monitoring.* **Internet of Things, 39**, Article 102025.  
[DOI](https://doi.org/10.1016/j.iot.2026.102025) · [Publisher page](https://www.sciencedirect.com/science/article/pii/S2542660526001551)

The publisher's CRediT statement credits Ramadan Mohamed with **Writing – original draft, Visualization, Validation, and Data curation**. This is a co-authored work; no sole-authorship claim is made. The publication describes the research framework and should not be interpreted as proof that every research component is implemented or connected in this dashboard repository.

## Deployment

The project is structured as a Next.js application and identifies Vercel as its recommended deployment platform. Confirm the public demo and run a production build before treating a deployment as operational.

## Known Limitations

- Local CSV demonstration data is included.
- Live sensor/device integrations are not established by this repository's current documentation.
- No independently verified model benchmark is claimed.
- Live farm data APIs and authentication are future improvements.

## Author

Ramadan Mohamed Hassan  
GitHub: https://github.com/Rmadanmohamed  
Portfolio: https://ramadan-ai-portfolio.vercel.app
