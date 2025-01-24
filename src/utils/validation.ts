type ValidationError = {
  [key: string]: { messages: string[] };
};

export function mapValidationErrors(issues: any[]): ValidationError {
  return issues.reduce((acc: ValidationError, issue) => {
    const key = issue.path.join(".");
    if (!acc[key]) {
      acc[key] = { messages: [] };
    }
    acc[key].messages.push(issue.message);
    return acc;
  }, {});
}
