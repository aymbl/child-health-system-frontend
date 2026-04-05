export function formatDateTime(value) {
	if (!value) return ''

	let str = String(value)
	str = str.replace('T', ' ')
	str = str.replace('.000+00:00', '')
	str = str.replace('.000Z', '')
	str = str.replace('Z', '')

	return str
}