function pickFields(source, allowedFields) {
  const result = {};
  for (const field of allowedFields) {
    if (source[field] !== undefined) {
      result[field] = source[field];
    }
  }
  return result;
}

export default pickFields;
