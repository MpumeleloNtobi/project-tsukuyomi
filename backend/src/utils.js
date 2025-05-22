function isValidUUID(uuid)
{
  if (!uuid || typeof uuid !== 'string') {
    return false
    }
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  return uuidRegex.test(uuid)
}

module.exports = {isValidUUID};