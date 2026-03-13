/**
 * Загружает JSON из public/data/
 * @param {string} filename - имя файла (например 'scientific-activity.json')
 * @returns {Promise<any>}
 */
export async function loadData(filename) {
  const res = await fetch(`/data/${filename}`)
  if (!res.ok) throw new Error(`Ошибка загрузки: ${filename}`)
  return res.json()
}
