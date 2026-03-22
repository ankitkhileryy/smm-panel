const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

walkDir('./src/app', function(filePath) {
    if (filePath.endsWith('.tsx') && !filePath.includes('home-login-form.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content
            .replace(/bg-white/g, 'bg-[#131B2B]')
            .replace(/bg-slate-50/g, 'bg-[#1A2332]')
            .replace(/bg-slate-100/g, 'bg-[#1E293B]')
            .replace(/border-slate-100/g, 'border-[#2A3A5A]')
            .replace(/border-slate-200/g, 'border-[#2A3A5A]')
            .replace(/text-slate-900/g, 'text-white')
            .replace(/text-slate-800/g, 'text-slate-200')
            .replace(/text-blue-600/g, 'text-[#4194FF]')
            .replace(/bg-blue-600/g, 'bg-[#4194FF]');
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log("Updated: " + filePath);
        }
    }
});
