export function isDayUnlocked(dayDate: string): boolean {
  try {
    // TEST MODE: Simuliert 8. Dezember 2025
    const today = new Date('2025-12-08');
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
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}
