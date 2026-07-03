export function formatDateTime(value) {
	if (!value) return ''

	let str = String(value)
	str = str.replace('T', ' ')
	str = str.replace('.000+00:00', '')
	str = str.replace('.000Z', '')
	str = str.replace('Z', '')

	return str
}

export function formatDate(value) {
	if (!value) return '—'

	const str = formatDateTime(value)
	return str.length >= 10 ? str.slice(0, 10) : str
}