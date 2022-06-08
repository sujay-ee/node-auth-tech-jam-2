export function getDateToday() {
    return new Date().toISOString().split('T')[0]
}