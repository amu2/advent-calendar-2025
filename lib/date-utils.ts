export function isDayUnlocked(dayDate: string): boolean {
  try {
    // Use current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const unlockDate = new Date(dayDate);
    unlockDate.setHours(0, 0, 0, 0);
    
    // After December 25, 2025, all doors remain unlocked
    const christmasDay = new Date('2025-12-25');
    christmasDay.setHours(0, 0, 0, 0);
    
    if (today >= christmasDay) {
      return true;
    }
    
    return today >= unlockDate;
  } catch (error) {
    console.error('Date parsing error:', error);
    return false;
  }
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}
