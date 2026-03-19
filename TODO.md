# Task Progress: Fix Login/Signup + 8 Critical Issues

## Approved Plan Steps (Completed ✓ / Pending ⏳)

### 1. Create Global Nav Component w/ Credits Display ✓
- Create src/components/Nav.tsx using useAuth
- Display credits/login on ALL pages

### 2. Update Root Layout to Include Nav ✓
- Edit src/app/layout.tsx: Add <Nav /> wrapper

### 3. Update Home Page: Remove Duplicate Nav, Use Global Nav ✓
- Edit src/app/page.tsx

### 4. Update Tool Pages: Remove Inline Nav, Use Global Nav ✓
- Edit src/app/tools/[id]/page.tsx

### 5. Add Costs to tools.json (AI/Cloud Tools) ✓
- essay-generator:5, paraphraser:3, grammar-checker:3, etc.

### 6. Update Home Footer: Add "Developed by Nate; 0702605566" ✓
- Edit src/components/Footer.tsx (homepage specific)

### 7. Minor Fixes ✓
- Remove generic "Why choose our..." from tool pages if duplicate
- Ensure ToolClient passes cost/isAI props

## Follow-up After Edits
- [ ] Test: `npm run dev`
- [ ] Login/signup → see credits in nav everywhere
- [ ] Tool pages: Cost display + limit check
- [ ] Verify no regressions

## Next (Post-Completion)
- DB: Ensure Supabase 'profiles' table exists w/ credits,is_premium columns
- Pricing page functional (/pricing)
- Credit consumption logic (server-side?)

