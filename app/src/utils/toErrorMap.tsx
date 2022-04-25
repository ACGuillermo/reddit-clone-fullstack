interface FieldError {
  field: string;
  message: string;
}

/**
 * Map array of erros from graphql response to an object accepted by formik
 *
 * Example response by graphql:
 * {field: "username", message: "Username already in use"}
 *
 */
export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};
