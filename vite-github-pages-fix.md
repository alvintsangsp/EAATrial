# Fix GitHub Pages Blank Page - Vite + Custom Domain

## Problem
Website is showing a blank page with MIME type error:
```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "application/octet-stream"
```

## Root Cause
The `vite.config.js` file has `base: '/repository-name/'` configured, which is incorrect for custom domains. This causes Vite to look for assets in the wrong path.

## Solution - Step by Step

### Step 1: Fix vite.config.js
**File**: `vite.config.js` (in your project root)

**Current content (WRONG)**:
```javascript
export default defineConfig({
  base: '/repository-name/',  // ← REMOVE THIS
  plugins: [react()],
})
```

**Change to (CORRECT)**:
```javascript
export default defineConfig({
  base: '/',  // ← Change to root path for custom domain
  plugins: [react()],
})
```

**Reason**: When using a custom domain like `eaatrial.bitebite.app`, there's no subdirectory. Assets should load from `/` not `/repository-name/`.

---

### Step 2: Verify package.json Scripts
**File**: `package.json`

Ensure the deploy script points to the `dist` folder:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Important**: 
- `predeploy` runs automatically before `deploy`
- The `deploy` command must use `-d dist` (not `src` or other folders)

---

### Step 3: Ensure CNAME File Exists
**File path**: `public/CNAME` (create if it doesn't exist)

**Content**:
```
eaatrial.bitebite.app
```

**For other projects**, create the same file with their respective domain:
```
xianqi.bitebite.app
```

**Note**: The `public` folder files are automatically copied to the `dist` folder during build.

---

### Step 4: Rebuild and Deploy

Run these commands in your project directory:

```bash
# Clean build to ensure everything is fresh
npm run build

# Deploy to GitHub Pages
npm run deploy
```

Or if using GitHub Actions, simply push your changes:
```bash
git add .
git commit -m "Fix: Update Vite base path for custom domain"
git push
```

---

### Step 5: Verify GitHub Pages Settings

Go to your repository on GitHub:

1. Click **Settings** (top right)
2. Go to **Pages** (left sidebar)
3. Under "Build and deployment":
   - **Source**: "Deploy from a branch"
   - **Branch**: Select `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**

---

### Step 6: Clear Browser Cache and Wait

1. **Hard refresh** your browser:
   - Windows: `Ctrl + Shift + Del` then clear cache
   - Mac: `Cmd + Shift + Del` then clear cache
   - Or use DevTools: Ctrl+Shift+I (F12) → Network → Disable cache (checkbox)

2. **Wait 2-5 minutes** for GitHub Pages to redeploy

3. **Visit your site**: `https://eaatrial.bitebite.app/`

4. **Open DevTools** (F12) → **Console tab** to verify:
   - No red error messages
   - No "MIME type" errors
   - No "404" errors

---

## Verification Checklist

- ✅ `vite.config.js` has `base: '/'`
- ✅ `package.json` has `"deploy": "gh-pages -d dist"`
- ✅ `public/CNAME` file exists with your domain
- ✅ GitHub Pages source is set to `gh-pages` branch
- ✅ Browser cache is cleared
- ✅ At least 2-5 minutes have passed since deployment
- ✅ Browser console shows no errors

---

## If Still Not Working

Check these in browser DevTools (F12):

1. **Console Tab**: Look for any red error messages
2. **Network Tab**: Check if `main.tsx` or `index.js` is loading (should show 200 status)
3. **Application Tab**: Check if service workers are interfering

---

## Apply to ALL Projects

Repeat Steps 1-4 for each of your GitHub Pages projects that has the same issue.
