# Devops-lab_2026 (Multi-project Repository)

This repository contains multiple projects.

## ResearchHub — Research Paper Management System

**Folder**: `research-paper-app/`

> **IEEE Topic:** *"A Web-Based Research Paper Management System with Role-Based Access Control for Academic Institutions"*  
> This project addresses the IEEE research area of **Digital Library Systems & Knowledge Management** (IEEE Xplore Category: Information Systems → Digital Libraries).

### Overview

ResearchHub is a full-stack web application built with **Express.js** and **MongoDB** for managing academic research papers. It supports authentication, role-based access control, PDF upload and preview, dashboard analytics with Chart.js, and full CRUD operations.

### Run it

```bash
cd research-paper-app
npm install
cp .env.example .env
npm run dev
```

## Faculty Workload Management Web Application

**Folder**: `faculty-workload-management/`

### Overview

Session-based Faculty Workload Management app with:

- Authentication (admin/faculty)
- Dashboard (cards + Chart.js charts)
- Workload CRUD (search + sort)
- Faculty management (admin) + total workload hours per faculty
- Profile settings (edit profile, change password, avatar upload)

### Run it

```bash
cd faculty-workload-management
npm install
cp .env.example .env
npm run dev
```
