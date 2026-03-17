
export const getColorCode = (percentage, alpha = 1) => {
    if (percentage <= 50) {
        return `rgba(76, 175, 80, ${alpha})`;   // green (#4CAF50)
    } else if (percentage > 50 && percentage < 70) {
        return `rgba(33, 150, 243, ${alpha})`;  // blue (#2196F3)
    } else if (percentage >= 70 && percentage < 80) {
        return `rgba(255, 152, 0, ${alpha})`;   // orange (#FF9800)
    } else if (percentage >= 80 && percentage < 95) {
        return `rgba(244, 67, 54, ${alpha})`;   // red (#F44336)
    } else {
        return `rgba(139, 0, 0, ${alpha})`;     // dark red (#8B0000)
    }
};

