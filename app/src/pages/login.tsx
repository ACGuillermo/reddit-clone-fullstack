import {
  Flex,
  Heading,
  Link,
  Stack,
  VStack,
  Text,
  Box,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { useMutation } from "urql";
import InputField from "../components/InputField";
import { toErrorMap } from "../utils/toErrorMap";

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
  const REGISTER_MUTATION = `mutation Register($username: String!, $password: String!) {
        register(input: { username: $username, password: $password }) {
          user {
            id
            username
          }
          errors {
            message
            field
          }
        }
      }
      `;
  const [, register] = useMutation(REGISTER_MUTATION);
  return (
    <Flex justify={"center"}>
      <Stack spacing={8} mx={"auto"} w="100%" maxW={"lg"} py={12} px={6}>
        <VStack spacing={2} w={"100%"} maxW={"lg"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </VStack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <Formik
              initialValues={{ username: "", password: "" }}
              onSubmit={async (value, { setErrors }) => {
                console.log(value);
                const response = await register(value);
                if (response.data?.register.errors) {
                  console.log(response.data.register.errors);
                  setErrors(toErrorMap(response.data.register.errors));
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <InputField
                    name="username"
                    label="Username"
                    placeholder="Username"
                  />
                  <InputField
                    name="password"
                    label="Password"
                    placeholder="Password"
                    type="password"
                  />
                  <Stack pt={6}>
                    <Button
                      type="submit"
                      loadingText="Logging"
                      isLoading={isSubmitting}
                      size="lg"
                      bg={"blue.400"}
                      color={"white"}
                      _hover={{
                        bg: "blue.500",
                      }}
                    >
                      Sign up
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
            <Stack pt={6}>
              <Text align={"center"}>
                <Link color={"blue.400"}>Forgot your password?</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default login;
