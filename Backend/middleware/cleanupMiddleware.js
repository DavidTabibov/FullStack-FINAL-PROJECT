import fs from 'fs';
import path from 'path';

export const cleanOldLogs = () => {
    const logsDir = path.join(process.cwd(), 'logs');
    const daysToKeep = 30;

    fs.readdir(logsDir, (err, files) => {
        if (err) {
            console.error('שגיאה בקריאת תיקיית הלוגים:', err);
            return;
        }

        const now = new Date().getTime();
        files.forEach(file => {
            const filePath = path.join(logsDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;

                const daysOld = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
                if (daysOld > daysToKeep) {
                    fs.unlink(filePath, err => {
                        if (err) console.error('שגיאה במחיקת לוג ישן:', err);
                    });
                }
            });
        });
    });
};